@extends('layouts.app')

@section('title', 'Your Wishlist')

@section('content')
<div class="container py-5">
    <h2 class="text-center mb-5">Your Wishlist</h2>

    @if($wishlist && $wishlist->count())
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            @foreach($wishlist as $item)
                @php
                    $product = $item->product;
                @endphp
                <div class="col">
                    <div class="card h-100 shadow-sm position-relative">
                        {{-- Product Image wrapped in link --}}
                        @if($product->productImages && $product->productImages->count())
                            <a href="{{ route('products.show', $product->id) }}">
                                <img src="{{ asset('storage/' . $product->productImages->first()->image_path) }}"
                                     class="card-img-top"
                                     alt="{{ $product->name }}"
                                     style="width: 100%; height: 320px; object-fit: cover;">
                            </a>
                        @else
                            <a href="{{ route('products.show', $product->id) }}">
                                <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 320px;">
                                    <span class="text-muted">No Image</span>
                                </div>
                            </a>
                        @endif



                        {{-- Wishlist Heart (optional toggle) --}}
                        <form action="{{ route('wishlist.toggle', $product->id) }}" method="POST"
                              class="position-absolute top-0 end-0 m-2" onClick="event.stopPropagation();">
                            @csrf
                            <form action="{{ route('wishlist.toggle', $product->id) }}" method="POST"
                                  class="position-absolute top-0 end-0 m-2" onClick="event.stopPropagation();">
                                @csrf
                                <button type="submit" class="btn btn-sm btn-light rounded-circle wishlist-btn" aria-label="Toggle wishlist">
                                @if(auth()->check() && auth()->user()->wishlistItems->contains('product_id', $product->id))
                                    <i class="bi bi-heart-fill text-danger"></i>
                                @else
                                    <i class="bi bi-heart"></i>
                                @endif
                            </button>
                        </form>

                        {{-- Labels if you want (optional) --}}
                        @if($product->new_collection)
                            <span class="badge bg-primary position-absolute top-0 start-0 m-2">New</span>
                        @endif
                        @if($product->is_on_sale)
                            <span class="badge bg-danger position-absolute top-0 start-0 m-2">-{{ $product->getDiscountPercentage() }}%</span>
                        @endif

                        {{-- Product Details --}}
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">{{ $product->name }}</h5>
                            <p class="card-text text-muted small">{{ \Illuminate\Support\Str::limit($product->description, 70) }}</p>

                            <div class="mt-auto mb-2">
                                @if($product->is_on_sale && $product->sale_percentage)
                                    <span class="text-muted text-decoration-line-through">${{ number_format($product->price, 2) }}</span>
                                    <span class="fw-bold text-danger ms-2">${{ number_format($product->getSalePrice(), 2) }}</span>
                                @else
                                    <span class="fw-bold">${{ number_format($product->price, 2) }}</span>
                                @endif
                            </div>

                            <p class="mb-0 small">Category: <strong>{{ $product->category }}</strong></p>
                        </div>

                        {{-- Footer with Remove button --}}
                        <div class="card-footer bg-white border-0">
                            <form action="{{ route('wishlist.remove', $item->id) }}" method="POST" onClick="event.stopPropagation();">
                                @csrf
                                @method('DELETE')
                                <button class="btn btn-outline-danger btn-sm w-100" onclick="return confirm('Are you sure you want to remove this item from your wishlist?')">
                                    Remove from Wishlist
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    @else
        <p class="text-muted text-center">Your wishlist is empty.</p>
    @endif
</div>
@endsection
