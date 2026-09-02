<?php

namespace App\Http\Controllers;

use App\Models\ShoppingCart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShoppingCartController extends Controller
{
    /**
     * Display the shopping cart for the authenticated user.
     */
    public function index()
    {
        $cartItems = ShoppingCart::where('user_id', Auth::id())
            ->with('product.productImages')
            ->get();

        return view('cart.index', compact('cartItems'));
    }

    /**
     * Add a product with a selected size to the shopping cart.
     */
    public function add(Request $request, $productId)
    {
        $request->validate([
            'size' => 'required|string',
        ]);

        $product = Product::findOrFail($productId);
        $size = $request->input('size');

        // Check the matching variant stock
        $variant = $product->variants()->where('size', $size)->first();

        if (!$variant || $variant->stock < 1) {
            return back()->with('error', 'This size is out of stock.');
        }

        $userId = Auth::id();

        // Check if already in cart
        $existingItem = ShoppingCart::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('size', $size)
            ->first();

        $currentQuantity = $existingItem ? $existingItem->quantity : 0;

        // Check if adding would exceed stock
        if ($currentQuantity + 1 > $variant->stock) {
            return back()->with('error', 'You cannot add more than available stock for this size.');
        }

        if ($existingItem) {
            $existingItem->quantity += 1;
            $existingItem->save();
        } else {
            ShoppingCart::create([
                'user_id' => $userId,
                'product_id' => $productId,
                'size' => $size,
                'quantity' => 1,
            ]);
        }

    return redirect()->to(url()->previous())->with('success', 'Product added to cart.');
    }

    /**
     * Update the quantity of a cart item.
     */
    public function update(Request $request, $id)
    {
        $cartItem = ShoppingCart::find($id);

        if (!$cartItem || $cartItem->user_id !== Auth::id()) {
            return redirect()->route('home')->with('error', 'Cart item not found.');
        }

        $requestedQuantity = (int) $request->input('quantity', 1);
        $variant = $cartItem->product->variants()->where('size', $cartItem->size)->first();

        if (!$variant || $variant->stock < $requestedQuantity) {
            return redirect()->route('home', ['showCart' => 'true'])
                ->with('error', 'Requested quantity exceeds available stock.');
        }

        $cartItem->quantity = $requestedQuantity;
        $cartItem->save();


return redirect()->to(url()->previous())->with([
    'success' => 'Cart updated successfully.',
    'showCart' => true
]);
    }

    /**
     * Remove a product from the shopping cart.
     */
    public function remove($id)
    {
        $cartItem = ShoppingCart::find($id);

        if (!$cartItem || $cartItem->user_id !== Auth::id()) {
            return redirect()->route('home')->with('error', 'Cart item not found.');
        }

        $cartItem->delete();

        return redirect()->route('home', ['showCart' => 'true'])->with('success', 'Product removed from cart.');
    }
}



