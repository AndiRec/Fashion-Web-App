<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\WishlistResource;
use App\Models\Product;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $wishlist = $request->user()
            ->wishlistItems()
            ->with('product.productImages', 'product.variants')
            ->get();

        return WishlistResource::collection($wishlist);
    }

    public function toggle(Request $request, Product $product)
    {
        $user = $request->user();
        $item = $user->wishlistItems()->where('product_id', $product->id)->first();

        if ($item) {
            $item->delete();

            return response()->json(['status' => 'removed', 'message' => 'Product removed from wishlist.']);
        }

        $user->wishlistItems()->create(['product_id' => $product->id]);

        return response()->json(['status' => 'added', 'message' => 'Product added to wishlist.']);
    }

    public function destroy(Request $request, \App\Models\Wishlist $wishlist)
    {
        abort_unless($wishlist->user_id === $request->user()->id, 404);

        $wishlist->delete();

        return response()->json(['message' => 'Product removed from wishlist.']);
    }

    public function clear(Request $request)
    {
        $request->user()->wishlistItems()->delete();

        return response()->json(['message' => 'Wishlist cleared.']);
    }
}
