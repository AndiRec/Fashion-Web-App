@extends('layouts.app')

@section('content')
<div class="container" style="max-width: 960px; margin: auto; padding: 20px;">
    <h2 style="font-size: 2rem; font-weight: 600; margin-bottom: 30px;">Your Shopping Cart</h2>

    @if($cartItems->isEmpty())
        <p style="color: #555; font-size: 1.125rem;">Your cart is empty.</p>
    @else
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
            @foreach($cartItems as $item)
                <div style="background-color: white; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 15px; display: flex; flex-direction: column;">

                    {{-- Product Image --}}
                    <div style="text-align: center; margin-bottom: 15px;">
                        @if($item->product && $item->product->productImages->count())
                            <img src="{{ asset('storage/' . $item->product->productImages->first()->image_path) }}" 
                                 alt="{{ $item->product->name }}" 
                                 style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px;">
                        @else
                            <div style="width: 100%; height: 180px; background-color: #eee; border-radius: 8px; display:flex; align-items:center; justify-content:center; color: #aaa; font-weight: 600;">
                                No Image
                            </div>
                        @endif
                    </div>

                    {{-- Product Name --}}
                    <h3 style="font-size: 1.25rem; margin-bottom: 10px; font-weight: 600;">{{ $item->product->name ?? 'Product not found' }}</h3>

                    {{-- Quantity Update Form --}}
                    <form action="{{ route('cart.update', $item->id) }}" method="POST" style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                        @csrf
                        @method('PATCH')
                        <label for="quantity-{{ $item->id }}" style="font-weight: 600;">Quantity:</label>
                        <input id="quantity-{{ $item->id }}" type="number" name="quantity" value="{{ $item->quantity }}" min="1" max="{{ $item->product->stock ?? 100 }}" 
                               style="width: 60px; padding: 5px; border: 1px solid #ccc; border-radius: 4px; text-align: center;">
                        <button type="submit" 
                                style="background-color: #007BFF; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;">
                            Update
                        </button>
                    </form>

                    {{-- Price and Discount --}}
                    <div style="margin-bottom: 10px;">
                        @if($item->product->is_on_sale && $item->product->sale_percentage)
                            <span style="text-decoration: line-through; color: #888;">${{ number_format($item->product->price, 2) }}</span>
                            <span style="color: red; font-weight: bold; margin-left: 10px;">${{ number_format($item->product->getSalePrice(), 2) }}</span>
                            <span style="background: red; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-left: 8px;">
                                -{{ $item->product->getDiscountPercentage() }}%
                            </span>
                        @else
                            <span style="font-weight: bold;">${{ number_format($item->product->price, 2) }}</span>
                        @endif
                    </div>

                    {{-- Total Price per Item --}}
                    @php
                        $unitPrice = $item->product->is_on_sale ? $item->product->getSalePrice() : $item->product->price;
                    @endphp
                    <p style="font-weight: 600; color: #333; margin-bottom: 15px;">Total: ${{ number_format($unitPrice * $item->quantity, 2) }}</p>

                    {{-- Remove Button --}}
                    <form action="{{ route('cart.remove', $item->id) }}" method="POST" style="margin-top: auto;">
                        @csrf
                        @method('DELETE')
                        <button type="submit" onclick="return confirm('Remove this item from your cart?')"
                                style="width: 100%; background-color: #dc3545; color: white; padding: 10px 0; border: none; border-radius: 6px; cursor: pointer; transition: background-color 0.3s;">
                            Remove
                        </button>
                    </form>
                </div>
            @endforeach
        </div>

        {{-- Checkout Button --}}
        <div style="margin-top: 40px; text-align: right;">
            <form action="{{ route('checkout.form') }}" method="GET">
                @csrf
                <button type="submit"
                        style="background-color: #000; color: white; padding: 12px 25px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; font-size: 1rem; transition: background-color 0.3s;">
                    Proceed to Checkout
                </button>
            </form>
        </div>
    @endif
</div>
@endsection
