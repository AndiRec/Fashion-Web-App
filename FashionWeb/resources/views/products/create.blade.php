@extends('layouts.app')

@section('title', 'Create Product')

@section('content')
<div class="container py-5" style="padding-top: 80px;">
    <h2 class="text-center mb-5">Create Product</h2>

    {{-- Success Message --}}
    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    {{-- Validation Errors --}}
    @if($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="card shadow-sm">
        <div class="card-body">
            <form action="{{ route('products.store') }}" method="POST" enctype="multipart/form-data">
                @csrf

                <div class="mb-3">
                    <label for="name" class="form-label">Product Name</label>
                    <input type="text" name="name" id="name" class="form-control" required>
                </div>

                <div class="mb-3">
                    <label for="description" class="form-label">Description</label>
                    <textarea name="description" id="description" rows="4" class="form-control" required></textarea>
                </div>

                <div class="mb-3">
                    <label for="price" class="form-label">Price (€)</label>
                    <input type="number" step="0.01" name="price" id="price" class="form-control" required>
                </div>

                <div class="mb-3">
                    <label for="category" class="form-label">Category</label>
                    <select name="category" id="category" class="form-select" required>
                        @foreach(\App\Enums\Category::cases() as $category)
                            <option value="{{ $category->value }}">{{ $category->value }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="mb-3">
                    <label for="color" class="form-label">Color</label>
                    <select name="color" id="color" class="form-select" required>
                        @foreach(\App\Enums\Color::cases() as $color)
                            <option value="{{ $color->value }}">{{ $color->value }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="mb-3">
                    <label for="image" class="form-label">Product Image</label>
                    <input type="file" name="image" id="image" class="form-control">
                </div>

                <div class="mb-3">
                    <label class="form-label">Sizes and Stock</label>
                    @foreach(\App\Enums\Size::cases() as $size)
                        <div class="input-group mb-2">
                            <span class="input-group-text">{{ $size->value }}</span>
                            <input type="number" name="sizes[{{ $size->value }}]" value="0" min="0" class="form-control">
                        </div>
                    @endforeach
                </div>

                <div class="form-check form-switch mb-3">
                    <input class="form-check-input" type="checkbox" name="is_on_sale" id="is_on_sale">
                    <label class="form-check-label" for="is_on_sale">On Sale</label>
                </div>

                {{-- Sale Percentage Input (Hidden Initially) --}}
                <div class="mb-3" id="sale_percentage_group" style="display: none;">
                    <label for="sale_percentage" class="form-label">Sale Percentage (%)</label>
                    <input type="number" name="sale_percentage" id="sale_percentage" class="form-control" min="1" max="90">
                </div>

                <div class="form-check form-switch mb-3">
                    <input class="form-check-input" type="checkbox" name="new_collection" id="new_collection">
                    <label class="form-check-label" for="new_collection">New Collection</label>
                </div>

                <div class="text-end">
                    <button type="submit" class="btn btn-dark">Create Product</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const isOnSaleCheckbox = document.getElementById('is_on_sale');
        const saleGroup = document.getElementById('sale_percentage_group');

        function toggleSaleField() {
            saleGroup.style.display = isOnSaleCheckbox.checked ? 'block' : 'none';
        }

        isOnSaleCheckbox.addEventListener('change', toggleSaleField);
        toggleSaleField(); // initial load
    });
</script>
@endpush



