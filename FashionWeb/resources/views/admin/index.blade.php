@extends('layouts.app')

@section('content')
<div class="container">
    <h1 style="margin-bottom: 20px;">Latest Products</h1>

    @if(session('success'))
        <div style="color: green; margin-bottom: 20px;">{{ session('success') }}</div>
    @endif

    @role('admin')
        <a href="{{ route('products.create') }}" style="display: inline-block; margin-bottom: 20px; color: white; background-color: #333; padding: 10px 15px; border-radius: 5px; text-decoration: none;">Add New Product</a>
    @endrole

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px;">
        @forelse ($products as $product)
            <div style="background-color: white; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 15px;">
                <div style="text-align: center;">
                    @if($product->productImages && $product->productImages->count() > 0)
                        <img src="{{ asset('storage/' . $product->productImages->first()->image_path) }}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;" alt="Product Image">
                    @else
                        <div style="width: 100%; height: 200px; background-color: #eee; border-radius: 8px;">No Image</div>
                    @endif
                </div>

                <h3 style="margin: 10px 0;">{{ $product->name }}</h3>

                <p style="color: #777;">{{ \Illuminate\Support\Str::limit($product->description, 60) }}</p>

                <div style="margin: 10px 0;">
                    @if($product->is_on_sale && $product->sale_percentage)
                        <span style="text-decoration: line-through; color: #888;">${{ number_format($product->price, 2) }}</span>
                        <span style="color: red; font-weight: bold;">${{ number_format($product->getSalePrice(), 2) }}</span>
                        <span style="background: red; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px;">-{{ $product->getDiscountPercentage() }}%</span>
                    @else
                        <span style="font-weight: bold;">${{ number_format($product->price, 2) }}</span>
                    @endif
                </div>

                <p style="font-size: 14px; color: #555;">Category: <strong>{{ $product->category }}</strong></p>
                <p style="font-size: 14px; color: #555;">Stock: <strong>{{ $product->stock }}</strong></p>

                {{-- Actions --}}
                <div style="margin-top: 10px;">
                    @role('admin')
                        <a href="{{ route('products.edit', $product->id) }}" style="text-decoration: none; color: #007BFF;">Edit</a> |
                        <form action="{{ route('products.destroy', $product->id) }}" method="POST" style="display:inline;">
                            @csrf
                            @method('DELETE')
                            <button type="submit" onclick="return confirm('Are you sure?')" style="color: red; border: none; background: none; cursor: pointer;">Delete</button>
                        </form>
                        <br><br>
                    @endrole

                    {{-- Add to Cart --}}
                    <form action="{{ route('cart.add', $product->id) }}" method="POST" style="display: flex; gap: 5px; margin-bottom: 10px;">
                        @csrf
                        <input type="number" name="quantity" value="1" min="1" max="{{ $product->stock }}" style="width: 60px; padding: 5px;">
                        <button type="submit" style="padding: 5px 10px; background-color: #28a745; color: white; border: none; border-radius: 4px;">Add to Cart</button>
                    </form>

                    {{-- Wishlist --}}
                    <form action="{{ route('wishlist.toggle', $product->id) }}" method="POST" style="display:inline;">
                        @csrf
                        <button type="submit" style="background: none; border: none; font-size: 20px;">
                            @if(auth()->check() && auth()->user()->wishlistItems->contains('product_id', $product->id))
                                ❤️
                            @else
                                🤍
                            @endif
                        </button>
                    </form>
                </div>
            </div>
        @empty
            <p>No products found.</p>
        @endforelse
    </div>

    {{-- Pagination --}}
    @if ($products instanceof \Illuminate\Pagination\LengthAwarePaginator)
        <div style="margin-top: 30px;">
            {{ $products->links() }}
        </div>
    @endif
</div>
@endsection
