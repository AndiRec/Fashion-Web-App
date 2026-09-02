@extends('layouts.app')

@section('title', 'Shop')

@section('content')
<div class="container py-5">
    <div class="container" style="padding-top: 80px;">
        <h2 class="text-center mb-5">All Products</h2>
    </div>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    @role('admin')
        <div class="text-end mb-3">
            <a href="{{ route('products.create') }}" class="btn btn-dark">Add New Product</a>
        </div>
    @endrole

    <div class="row">
        {{-- Filter Sidebar --}}
        <div class="col-lg-3 mb-4">
            <div class="bg-light p-3 rounded shadow-sm">
                <h5 class="mb-3">Filter Products</h5>
                <form method="GET" action="{{ route('products.index') }}">
                    <div class="mb-3">
                        <label class="form-label">Category</label>
                        <select name="category" class="form-select">
                            <option value="">All Categories</option>
                            @foreach ($categories as $category)
                                <option value="{{ $category->value }}" {{ request('category') === $category->value ? 'selected' : '' }}>
                                    {{ ucfirst(strtolower($category->value)) }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Price Range</label>
                        <div class="d-flex gap-2">
                            <input type="number" name="min_price" placeholder="Min" value="{{ request('min_price') }}" class="form-control">
                            <input type="number" name="max_price" placeholder="Max" value="{{ request('max_price') }}" class="form-control">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Size</label>
                        <select name="size" class="form-select">
                            <option value="">All Sizes</option>
                            @foreach ($sizes as $size)
                                <option value="{{ $size->value }}" {{ request('size') === $size->value ? 'selected' : '' }}>
                                    {{ ucfirst(strtolower($size->value)) }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" name="new_collection" value="1" {{ request('new_collection') ? 'checked' : '' }}>
                        <label class="form-check-label">New Collection</label>
                    </div>

                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" name="on_sale" value="1" {{ request('on_sale') ? 'checked' : '' }}>
                        <label class="form-check-label">On Sale</label>
                    </div>

                    <button type="submit" class="btn btn-dark w-100">Apply Filters</button>
                </form>
            </div>
        </div>

        {{-- Products Grid --}}
        <div class="col-lg-9">
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                @forelse ($products as $product)
                    <div class="col">
                        <div class="card h-100 shadow-sm position-relative">
                            {{-- Product Image --}}
                            @if($product->productImages && $product->productImages->count())
                                <a href="{{ route('products.show', $product->id) }}">
                                    <img src="{{ asset('storage/' . $product->productImages->first()->image_path) }}"
                                         class="card-img-top"
                                         alt="{{ $product->name }}"
                                         style="width: 100%; height: 400px; object-fit: cover;">
                                </a>
                            @else
                                <a href="{{ route('products.show', $product->id) }}">
                                    <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 320px;">
                                        <span class="text-muted">No Image</span>
                                    </div>
                                </a>
                            @endif

                            {{-- Wishlist Heart --}}
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

                            {{-- Labels --}}
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
                                        <span class="text-muted text-decoration-line-through">{{ number_format($product->price, 2) }} Den</span>
                                        <span class="fw-bold text-danger ms-2">{{ number_format($product->getSalePrice(), 2) }} Den</span>
                                    @else
                                        <span class="fw-bold">{{ number_format($product->price, 2) }} Den</span>
                                    @endif
                                </div>

                                <p class="mb-0 small">Category: <strong>{{ $product->category }}</strong></p>
                            </div>

                            {{-- Footer with Actions --}}
                            <div class="card-footer bg-white border-0">
                                @role('admin')
                                    <div class="d-flex justify-content-between mb-2">
                                        <a href="{{ route('products.edit', $product->id) }}" class="btn btn-outline-dark btn-sm">Edit</a>
                                        <form action="{{ route('products.destroy', $product->id) }}" method="POST" onClick="event.stopPropagation();">
                                            @csrf
                                            @method('DELETE')
                                            <button class="btn btn-outline-danger btn-sm" onclick="return confirm('Are you sure?')">Delete</button>
                                        </form>
                                    </div>
                                @endrole

                                {{-- Customer Add to Cart --}}
                                <form action="{{ route('cart.add', $product->id) }}" method="POST" class="d-flex flex-column gap-2" onClick="event.stopPropagation();">
                                    @csrf

                                    @php
                                        $inStockVariants = $product->variants->where('stock', '>', 0);
                                    @endphp

                                    @if($inStockVariants->isNotEmpty())
                                        <select name="size" class="form-select form-select-sm" required>
                                            <option value="">Choose Size</option>
                                            @foreach($inStockVariants as $variant)
                                                <option value="{{ $variant->size }}">{{ $variant->size }} ({{ $variant->stock }} left)</option>
                                            @endforeach
                                        </select>

                                        <div class="d-flex gap-2">
                                            <input type="number" name="quantity" value="1" min="1" class="form-control form-control-sm" style="width: 60px;">
                                            <button type="submit" class="btn btn-dark btn-sm w-100">Add to Cart</button>
                                        </div>
                                    @else
                                        <div class="text-muted small">Out of stock</div>
                                    @endif
                                </form>
                            </div>
                        </div>
                    </div>
                @empty
                    <p class="text-muted">No products found.</p>
                @endforelse
            </div>

            {{-- Pagination --}}
            @if ($products instanceof \Illuminate\Pagination\LengthAwarePaginator)
                <div class="mt-4 d-flex justify-content-center">
                    {{ $products->links() }}
                </div>
            @endif
        </div>
    </div>
</div>
@endsection



