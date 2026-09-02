<?php

namespace App\Http\Controllers;
use App\Models\ShoppingCart;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Product;

class HomeController extends Controller
{
    public function index()
{

    $newCollectionProducts = Product::with('productImages')
        ->where('new_collection', true)
        ->latest()
        ->limit(4)
        ->get();

    $saleProducts = Product::with('productImages')
        ->where('is_on_sale', true)
        ->latest()
        ->limit(4)
        ->get();

    return view('home', compact('newCollectionProducts', 'saleProducts'));
}
}
