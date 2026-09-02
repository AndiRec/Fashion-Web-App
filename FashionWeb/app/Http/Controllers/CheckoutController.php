<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmationMail;

class CheckoutController extends Controller
{
    public function form()
    {
        $user = auth()->user();
        $addresses = $user->addresses;

        if ($user->cartItems()->count() === 0) {
            return redirect()
                ->route('products.index')
                ->with('error', 'Your cart is empty. Add products before checking out.');
        }

        return view('checkout.form', compact('user', 'addresses'));
    }

    public function submitOrder(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'address_id' => 'nullable|exists:addresses,id',
            'street_address' => 'nullable|string',
            'city' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'country' => 'nullable|string',
        ]);

        $user = auth()->user();

        if (!$user->phone) {
            $user->update(['phone' => $request->phone]);
        }

        // Determine the address to use
        $address = null;

        if ($request->filled('address_id')) {
            $address = Address::where('id', $request->address_id)
                              ->where('user_id', $user->id)
                              ->first();

            if (!$address) {
                return back()->with('error', 'Invalid address selected.');
            }
        } elseif ($request->filled('street_address')) {
            $address = $user->addresses()->firstOrCreate([
                'street_address' => $request->street_address,
                'city' => $request->city,
                'postal_code' => $request->postal_code,
                'country' => $request->country,
            ]);
        } else {
            return back()->with('error', 'Please select or enter an address.');
        }

        $cartItems = $user->cartItems()->with('product.variants')->get();

        if ($cartItems->isEmpty()) {
            return back()->with('error', 'Your cart is empty.');
        }

        DB::beginTransaction();

        try {
            // Step 1: Pre-check all stock
            foreach ($cartItems as $item) {
                $variant = $item->product->variants->firstWhere('size', $item->size);

                if (!$variant || $variant->stock < $item->quantity) {
                    throw new \Exception("Not enough stock for {$item->product->name} - size {$item->size}");
                }
            }

            // Step 2: Calculate total price
            $totalPrice = $cartItems->reduce(function ($carry, $item) {
                $price = $item->product->is_on_sale
                    ? $item->product->getSalePrice()
                    : $item->product->price;

                return $carry + ($price * $item->quantity);
            }, 0);

            // Step 3: Create order
            $order = $user->orders()->create([
                'total_price' => $totalPrice,
                'status' => 'pending',
                'address_id' => $address->id,
            ]);

            // Step 4: Create items + decrement stock
            foreach ($cartItems as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'productPriceQuantity' => $item->product->is_on_sale
                        ? $item->product->getSalePrice()
                        : $item->product->price,
                    'size' => $item->size, // ✅ Save the size the user selected
                ]);


                $variant = $item->product->variants->firstWhere('size', $item->size);
                $variant->stock -= $item->quantity;
                $variant->save();
            }

            // Step 5: Clear cart and commit
            $user->cartItems()->delete();
            DB::commit();

            // Optional: send confirmation email
            // Mail::to($user->email)->send(new OrderConfirmationMail($order));
            // Mail::to('admin@fashionboutique.test')->send(new OrderConfirmationMail($order));

            return redirect()
                ->route('products.index')
                ->with('success', 'Order placed successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Order failed: ' . $e->getMessage());
        }
    }
}



