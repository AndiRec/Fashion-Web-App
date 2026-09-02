@extends('layouts.app')

@section('content')
<div class="container d-flex justify-content-center">
    <div style="margin-top: 10rem; width: 100%; max-width: 600px;">
        <div class="card shadow-sm" style="width: 100%; position: relative;">

            {{-- Product Image --}}
            @if($product->productImages && $product->productImages->count())
                <img 
                    id="product-main-image"
                    class="product-image"
                    src="{{ asset('storage/' . $product->productImages->first()->image_path) }}"
                    alt="{{ $product->name }}"
                    style="width: 100%; height: 400px; object-fit: cover; cursor: pointer;">
            @else
                <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 300px;">
                    <span class="text-muted">No Image</span>
                </div>
            @endif

            {{-- Labels --}}
            <div class="position-absolute top-0 start-0 m-2" style="z-index: 10;">
                @if($product->new_collection)
                    <span class="badge bg-primary me-1">New</span>
                @endif
                @if($product->is_on_sale)
                    <span class="badge bg-danger">-{{ $product->getDiscountPercentage() }}%</span>
                @endif
            </div>

            {{-- Small Thumbnail --}}
            @if($product->productImages && $product->productImages->count())
                <div class="position-absolute top-0 end-0 m-2" style="z-index: 10;">
                    <img 
                        src="{{ asset('storage/' . $product->productImages->first()->image_path) }}" 
                        alt="Thumbnail" 
                        style="width: 80px; height: 80px; object-fit: cover; border: 2px solid #fff; border-radius: 0.5rem; box-shadow: 0 0 5px rgba(0,0,0,0.2);"
                    >
                </div>
            @endif

            {{-- Card Body --}}
            <div class="card-body">
                <h5 class="card-title">{{ $product->name }}</h5>
                <p class="card-text text-muted small">{{ $product->description }}</p>

                @if($product->is_on_sale && $product->sale_percentage)
                    <div class="mb-2">
                        <span class="text-muted text-decoration-line-through">{{ number_format($product->price, 2) }} Den</span>
                        <span class="fw-bold text-danger ms-2">{{ number_format($product->getSalePrice(), 2) }} Den</span>
                    </div>
                @else
                    <div class="mb-2">
                        <span class="fw-bold">{{ number_format($product->price, 2) }} Den</span>
                    </div>
                @endif

                <p class="mb-1 small">Category: <strong>{{ $product->category }}</strong></p>
                <p class="mb-1 small">Color: <strong>{{ $product->color }}</strong></p>
                <p class="mb-1 small">New Collection: <strong>{{ $product->new_collection ? 'Yes' : 'No' }}</strong></p>

                {{-- Sizes and Add to Cart --}}
                <div class="mt-4">
                    <form action="{{ route('cart.add', $product->id) }}" method="POST" onsubmit="return validateSizeSelection();">
                        @csrf

                        <h6 class="mb-2">Select Size:</h6>
                        <div class="d-flex flex-wrap gap-2 mb-3">
                            @foreach($product->variants as $variant)
                                @php
                                    $isOutOfStock = $variant->stock === 0;
                                    $sizeValue = is_object($variant->size) ? $variant->size->value : $variant->size;
                                @endphp

                                <div>
                                    <input 
                                        type="radio" 
                                        name="size" 
                                        id="size-{{ $sizeValue }}" 
                                        value="{{ $sizeValue }}"
                                        class="btn-check"
                                        {{ $isOutOfStock ? 'disabled' : '' }}
                                    >
                                    <label 
                                        for="size-{{ $sizeValue }}" 
                                        title="{{ $isOutOfStock ? 'Out of stock' : '' }}"
                                        class="btn btn-outline-dark"
                                        style="min-width: 60px;
                                               opacity: {{ $isOutOfStock ? '0.5' : '1' }};
                                               cursor: {{ $isOutOfStock ? 'not-allowed' : 'pointer' }};"
                                    >
                                        {{ $sizeValue }}
                                    </label>
                                </div>
                            @endforeach
                        </div>

                        <button type="submit" class="btn btn-dark w-100">Add to Cart</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- Fullscreen Modal for Zoomed Image --}}
<div id="image-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:1050; justify-content:center; align-items:center; overflow:auto; padding:1rem;">
    <img id="modal-image" src="" alt="Full Product Image" style="max-width: 90%; max-height: 90%; border-radius: 5px;">
    <button id="modal-close-btn" aria-label="Close" style="position:absolute; top:1rem; right:1rem; background:none; border:none; font-size:2.5rem; color:#fff; cursor:pointer;">&times;</button>
</div>

<script>
    function validateSizeSelection() {
        const selected = document.querySelector('input[name="size"]:checked');
        if (!selected) {
            alert('Please select a size before adding to cart.');
            return false;
        }
        return true;
    }

    document.addEventListener('DOMContentLoaded', function () {
        const mainImage = document.getElementById('product-main-image');
        const modal = document.getElementById('image-modal');
        const modalImage = document.getElementById('modal-image');
        const closeBtn = document.getElementById('modal-close-btn');

        if (mainImage) {
            mainImage.addEventListener('click', () => {
                modalImage.src = mainImage.src;
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        }

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });
</script>
@endsection



