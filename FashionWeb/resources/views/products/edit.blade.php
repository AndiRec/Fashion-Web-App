@extends('layouts.app')

@section('title', 'Edit Product')

@section('content')
<div class="bg-custom-grey py-5">
    <div class="container py-5" style="padding-top: 80px;">
        <h2 class="text-center mb-5">Edit Product</h2>

        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

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
                <form action="{{ route('products.update', $product->id) }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')

                    <div class="mb-3">
                        <label for="name" class="form-label">Product Name</label>
                        <input type="text" name="name" id="name" value="{{ old('name', $product->name) }}" class="form-control" required>
                    </div>

                    <div class="mb-3">
                        <label for="description" class="form-label">Description</label>
                        <textarea name="description" id="description" class="form-control" rows="4" required>{{ old('description', $product->description) }}</textarea>
                    </div>

                    <div class="mb-3">
                        <label for="price" class="form-label">Price (Den)</label>
                        <input type="number" name="price" id="price" value="{{ old('price', $product->price) }}" class="form-control" required>
                    </div>

                    <div class="mb-3">
                        <label for="category" class="form-label">Category</label>
                        <select name="category" id="category" class="form-control" required>
                            @foreach (\App\Enums\Category::cases() as $category)
                                <option value="{{ $category->value }}" {{ old('category', $product->category) === $category->value ? 'selected' : '' }}>
                                    {{ ucfirst($category->value) }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="color" class="form-label">Color</label>
                        <select name="color" id="color" class="form-control" required>
                            @foreach (\App\Enums\Color::cases() as $color)
                                <option value="{{ $color->value }}" {{ old('color', $product->color) === $color->value ? 'selected' : '' }}>
                                    {{ ucfirst($color->value) }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    {{-- Updated stock input per size --}}
                    <div class="mb-4">
                        <label class="form-label">Stock Per Size</label>

                        @foreach (\App\Enums\Size::cases() as $size)
                            @php
                                $variant = $product->variants->firstWhere('size', $size->value);
                                $existingStock = old("sizes.{$size->value}", $variant ? $variant->stock : 0);
                            @endphp
                            <div class="input-group mb-2">
                                <span class="input-group-text" style="width: 80px;">{{ $size->value }}</span>
                                <input
                                    type="number"
                                    name="sizes[{{ $size->value }}]"
                                    class="form-control"
                                    value="{{ $existingStock }}"
                                    min="0"
                                    required
                                >
                            </div>
                        @endforeach
                    </div>

                    <div class="form-check form-switch mb-3">
                        <input class="form-check-input" type="checkbox" name="is_on_sale" id="is_on_sale" value="1"
                               {{ old('is_on_sale', $product->is_on_sale) ? 'checked' : '' }}>
                        <label class="form-check-label" for="is_on_sale">On Sale</label>
                    </div>

                    <div class="mb-3">
                        <label for="sale_percentage" class="form-label">Sale Percentage (%)</label>
                        <input type="number" name="sale_percentage" id="sale_percentage"
                               value="{{ old('sale_percentage', $product->sale_percentage) }}" class="form-control" min="1" max="90">
                    </div>

                    <div class="form-check form-switch mb-3">
                        <input class="form-check-input" type="checkbox" name="new_collection" id="new_collection" value="1"
                               {{ old('new_collection', $product->new_collection ?? false) ? 'checked' : '' }}>
                        <label class="form-check-label" for="new_collection">New Collection</label>
                    </div>

                    <div class="mb-3">
                        <label for="images" class="form-label">Upload New Images</label>
                        <input type="file" name="images[]" id="images" class="form-control" multiple>
                    </div>

                    <div class="text-end">
                        <button type="submit" class="btn btn-dark">Update Product</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection



