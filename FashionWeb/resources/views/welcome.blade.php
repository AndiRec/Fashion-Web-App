@extends('layouts.app')

@section('content')
<!-- Hero Section -->
<section class="py-5 bg-light text-center">
    <div class="container">
        <h1 class="display-4 fw-bold">Welcome to <span class="text-primary">FashionWeb</span></h1>
        <p class="lead text-muted">Discover the latest trends in fashion and style.</p>
        <a href="{{ route('products.index') }}" class="btn btn-primary px-4 mt-3">Shop Now</a>
    </div>
</section>

<!-- New Collection -->
<section class="py-5">
    <div class="container">
        <h2 class="text-center mb-4">New Collection</h2>
        <div class="row gy-4 justify-content-center">
            @foreach($newCollectionProducts as $product)
                <div class="col-6 col-sm-4 col-md-3 col-lg-2">
                    <div class="card border-0 shadow-sm h-100">
                        @if($product->productImages && $product->productImages->count())
                            <img src="{{ asset('storage/' . $product->productImages->first()->image_path) }}" alt="{{ $product->name }}" class="card-img-top img-fluid" style="object-fit: cover; height: 180px;">
                        @else
                            <div class="bg-secondary d-flex align-items-center justify-content-center text-white" style="height: 180px;">No Image</div>
                        @endif
                        <div class="card-body text-center">
                            <h6 class="fw-bold mb-1">{{ $product->name }}</h6>
                            @if($product->is_on_sale && $product->sale_percentage)
                                <div class="mb-1">
                                    <small class="text-muted text-decoration-line-through">${{ number_format($product->price, 2) }}</small><br>
                                    <span class="text-danger fw-bold">${{ number_format($product->getSalePrice(), 2) }}</span>
                                    <span class="badge bg-danger ms-1">-{{ $product->getDiscountPercentage() }}%</span>
                                </div>
                            @else
                                <div class="fw-bold mb-1">${{ number_format($product->price, 2) }}</div>
                            @endif
                            <a href="{{ route('products.show', $product->id) }}" class="btn btn-outline-primary btn-sm">View</a>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</section>

<!-- On Sale -->
<section class="py-5 bg-light">
    <div class="container">
        <h2 class="text-center mb-4">On Sale</h2>
        <div class="row gy-4 justify-content-center">
            @foreach($saleProducts as $product)
                <div class="col-6 col-sm-4 col-md-3 col-lg-2">
                    <div class="card border-0 shadow-sm h-100">
                        @if($product->productImages && $product->productImages->count())
                            <img src="{{ asset('storage/' . $product->productImages->first()->image_path) }}" alt="{{ $product->name }}" class="card-img-top img-fluid" style="object-fit: cover; height: 180px;">
                        @else
                            <div class="bg-secondary d-flex align-items-center justify-content-center text-white" style="height: 180px;">No Image</div>
                        @endif
                        <div class="card-body text-center">
                            <h6 class="fw-bold mb-1">{{ $product->name }}</h6>
                            <div class="mb-1">
                                <small class="text-muted text-decoration-line-through">${{ number_format($product->price, 2) }}</small><br>
                                <span class="text-danger fw-bold">${{ number_format($product->getSalePrice(), 2) }}</span>
                                <span class="badge bg-danger ms-1">-{{ $product->getDiscountPercentage() }}%</span>
                            </div>
                            <a href="{{ route('products.show', $product->id) }}" class="btn btn-outline-primary btn-sm">View</a>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</section>

<!-- About -->
<section class="py-5">
    <div class="container text-center">
        <h2 class="mb-3">About FashionWeb</h2>
        <p class="text-muted mx-auto" style="max-width: 600px;">
            FashionWeb is your destination for quality, style, and affordability. Whether you're shopping for basics or bold statements, we've got something for every wardrobe. Start your journey with us today.
        </p>
    </div>
</section>
@endsection
