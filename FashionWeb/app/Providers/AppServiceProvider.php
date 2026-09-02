<?php

namespace App\Providers;

use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
use App\Models\ShoppingCart;
use App\Models\Wishlist;
use App\Models\Product;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        View::composer('*', function ($view) {
            $cartItems = collect(); // Prevents null error
            $cartCount = 0;
            $wishlist = collect();
            $wishlistCount = 0;
            $newCollectionProducts = collect(); // Initialize empty

            if (Auth::check()) {
                $userId = Auth::id();
                $cartItems = ShoppingCart::where('user_id', $userId)->with('product.productImages')->get();
                $cartCount = $cartItems->pluck('product_id')->unique()->count();

                $wishlist = Wishlist::where('user_id', $userId)->with('product.productImages')->get();
                $wishlistCount = $wishlist->pluck('product_id')->unique()->count();
            }

            // Always load New Collection products (limit 10)
            $newCollectionProducts = Product::where('new_collection', true)
                ->with('productImages') // eager-load images
                ->take(10)
                ->get();

            $view->with(compact(
                'cartItems',
                'cartCount',
                'wishlist',
                'wishlistCount',
                'newCollectionProducts'
            ));
        });
    }
}
