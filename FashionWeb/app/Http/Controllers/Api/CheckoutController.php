<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'address_id' => 'nullable|exists:addresses,id',
            'street_address' => 'nullable|string',
            'city' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'country' => 'nullable|string',
        ]);

        $user = $request->user();

        if (! $user->phone) {
            $user->update(['phone' => $request->phone]);
        }

        $address = null;

        if ($request->filled('address_id')) {
            $address = Address::where('id', $request->address_id)
                ->where('user_id', $user->id)
                ->first();

            if (! $address) {
                return response()->json(['message' => 'Invalid address selected.'], 422);
            }
        } elseif ($request->filled('street_address')) {
            $address = $user->addresses()->firstOrCreate([
                'street_address' => $request->street_address,
                'city' => $request->city,
                'postal_code' => $request->postal_code,
                'country' => $request->country,
            ]);
        } else {
            return response()->json(['message' => 'Please select or enter an address.'], 422);
        }

        $cartItems = $user->cartItems()->with('product.variants')->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Your cart is empty.'], 422);
        }

        try {
            $order = DB::transaction(function () use ($cartItems, $user, $address) {
                foreach ($cartItems as $item) {
                    $variant = $item->product->variants->firstWhere('size', $item->size);

                    if (! $variant || $variant->stock < $item->quantity) {
                        throw new \RuntimeException("Not enough stock for {$item->product->name} - size {$item->size}");
                    }
                }

                $totalPrice = $cartItems->reduce(function ($carry, $item) {
                    $price = $item->product->is_on_sale
                        ? $item->product->getSalePrice()
                        : $item->product->price;

                    return $carry + ($price * $item->quantity);
                }, 0);

                $order = $user->orders()->create([
                    'total_price' => $totalPrice,
                    'status' => 'pending',
                    'address_id' => $address->id,
                ]);

                foreach ($cartItems as $item) {
                    $order->items()->create([
                        'product_id' => $item->product_id,
                        'quantity' => $item->quantity,
                        'productPriceQuantity' => $item->product->is_on_sale
                            ? $item->product->getSalePrice()
                            : $item->product->price,
                        'size' => $item->size,
                    ]);

                    $variant = $item->product->variants->firstWhere('size', $item->size);
                    $variant->decrement('stock', $item->quantity);
                }

                $user->cartItems()->delete();

                return $order;
            });
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return new OrderResource($order->load(['items.product.productImages', 'items.product.variants', 'address']));
    }
}
