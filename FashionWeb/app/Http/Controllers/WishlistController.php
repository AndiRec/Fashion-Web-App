<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    /**
     * Display a listing of the wishlist.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Get all wishlist items for the authenticated user
        $wishlist = auth()->user()->wishlistItems()->with('product')->get(); // assuming relation exists

        return view('wishlist.index', compact('wishlist'));
    }

    public function add(Request $request, Product $product)
    {
        $user = auth()->user();

        // Avoid duplicate
        if (!$user->wishlistItems()->where('product_id', $product->id)->exists()) {
            $user->wishlistItems()->create(['product_id' => $product->id]);
        }

        return redirect()->route('home')->with('success', 'Product added to wishlist!');
    }
    public function toggle(Product $product)
    {
    $user = auth()->user();

    $wishlistItem = $user->wishlistItems()->where('product_id', $product->id)->first();

    if ($wishlistItem) {
        $wishlistItem->delete();
        $message = 'Product removed from wishlist.';
    } else {
        $user->wishlistItems()->create(['product_id' => $product->id]);
        $message = 'Product added to wishlist.';
    }

    if (request()->ajax()) {
        return response()->json(['status' => 'success', 'message' => $message]);
    }

    return back()->with('success', $message);
    }
    /**
     * Store a newly created wishlist item in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate input
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        // Add product to the user's wishlist
        Wishlist::create([
            'user_id' => auth()->id(),
            'product_id' => $request->product_id,
        ]);

        return redirect()->route('home')->with('success', 'Product added to wishlist.');
    }

    /**
     * Remove the specified product from the wishlist.
     *
     * @param \App\Models\Wishlist $wishlist
     * @return \Illuminate\Http\Response
     */
    public function destroy(Wishlist $wishlist)
    {
        // Ensure the user is trying to delete their own wishlist item
        if ($wishlist->user_id !== auth()->id()) {
            return redirect()->route('home')->with('error', 'Unauthorized action.');
        }

        $wishlist->delete();

        return redirect()->route('home')->with('success', 'Product removed from wishlist.');
    }
}
