<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartItemResource;
use App\Models\Product;
use App\Models\ShoppingCart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cartItems = $request->user()
            ->cartItems()
            ->with(['product.productImages', 'product.variants'])
            ->get();

        return CartItemResource::collection($cartItems);
    }

    public function store(Request $request, Product $product)
    {
        $request->validate(['size' => 'required|string']);

        $size = $request->input('size');
        $variant = $product->variants()->where('size', $size)->first();

        if (! $variant || $variant->stock < 1) {
            return response()->json(['message' => 'This size is out of stock.'], 422);
        }

        $userId = $request->user()->id;

        $existingItem = ShoppingCart::where('user_id', $userId)
            ->where('product_id', $product->id)
            ->where('size', $size)
            ->first();

        $currentQuantity = $existingItem ? $existingItem->quantity : 0;

        if ($currentQuantity + 1 > $variant->stock) {
            return response()->json(['message' => 'You cannot add more than the available stock for this size.'], 422);
        }

        if ($existingItem) {
            $existingItem->increment('quantity');
        } else {
            ShoppingCart::create([
                'user_id' => $userId,
                'product_id' => $product->id,
                'size' => $size,
                'quantity' => 1,
            ]);
        }

        return response()->json(['message' => 'Product added to cart.'], 201);
    }

    public function update(Request $request, ShoppingCart $cartItem)
    {
        abort_unless($cartItem->user_id === $request->user()->id, 404);

        $requestedQuantity = $request->integer('quantity', 1);
        $variant = $cartItem->product->variants()->where('size', $cartItem->size)->first();

        if (! $variant || $variant->stock < $requestedQuantity || $requestedQuantity < 1) {
            return response()->json(['message' => 'Requested quantity exceeds available stock.'], 422);
        }

        $cartItem->update(['quantity' => $requestedQuantity]);

        return new CartItemResource($cartItem->load(['product.productImages', 'product.variants']));
    }

    public function destroy(Request $request, ShoppingCart $cartItem)
    {
        abort_unless($cartItem->user_id === $request->user()->id, 404);

        $cartItem->delete();

        return response()->json(['message' => 'Product removed from cart.']);
    }
}
