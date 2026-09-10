<?php

namespace App\Http\Controllers\Api;

use App\Enums\Category;
use App\Enums\Color;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->with(['productImages', 'variants']);

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('size')) {
            $query->whereHas('variants', function ($q) use ($request) {
                $q->where('size', $request->size)->where('stock', '>', 0);
            });
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', floatval($request->min_price));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', floatval($request->max_price));
        }

        if ($request->boolean('on_sale')) {
            $query->where('is_on_sale', true);
        }

        if ($request->boolean('new_collection')) {
            $query->where('new_collection', true);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        if ($request->filled('stock_status')) {
            $query->withSum('variants as stock_sum', 'stock')->groupBy('products.id');

            match ($request->input('stock_status')) {
                'out' => $query->having('stock_sum', '<=', 0),
                'low' => $query->having('stock_sum', '>', 0)->having('stock_sum', '<=', 10),
                'in_stock' => $query->having('stock_sum', '>', 10),
                default => null,
            };
        }

        match ($request->input('sort')) {
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'oldest' => $query->orderBy('created_at', 'asc'),
            'name_asc' => $query->orderBy('name', 'asc'),
            'stock_asc' => $query->withSum('variants as stock_sum_sort', 'stock')->orderBy('stock_sum_sort', 'asc'),
            'stock_desc' => $query->withSum('variants as stock_sum_sort', 'stock')->orderBy('stock_sum_sort', 'desc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        $products = $query->paginate($request->integer('per_page', 12));

        return ProductResource::collection($products);
    }

    public function show(Product $product)
    {
        $product->load(['productImages', 'variants']);

        return new ProductResource($product);
    }

    public function featured()
    {
        return response()->json([
            'new_collection' => ProductResource::collection(
                Product::with('productImages', 'variants')->where('new_collection', true)->latest()->limit(8)->get()
            ),
            'on_sale' => ProductResource::collection(
                Product::with('productImages', 'variants')->where('is_on_sale', true)->latest()->limit(8)->get()
            ),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category' => ['required', new Enum(Category::class)],
            'color' => ['nullable', new Enum(Color::class)],
            'images' => 'nullable|array',
            'images.*' => 'image|max:10240',
            'sizes' => 'required|array',
            'sizes.*' => 'nullable|numeric|min:0',
            'is_on_sale' => 'boolean',
            'new_collection' => 'boolean',
            'sale_percentage' => 'nullable|integer|min:1|max:90',
        ]);

        $isOnSale = $request->boolean('is_on_sale');

        $product = Product::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'category' => $validated['category'],
            'color' => $validated['color'] ?? null,
            'is_on_sale' => $isOnSale,
            'sale_percentage' => $isOnSale ? $request->input('sale_percentage') : null,
            'new_collection' => $request->boolean('new_collection'),
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $product->productImages()->create([
                    'image_path' => $image->store('products', 'public'),
                ]);
            }
        }

        foreach ($request->input('sizes') as $size => $stock) {
            $product->variants()->create([
                'size' => $size,
                'stock' => (int) $stock,
            ]);
        }

        return new ProductResource($product->load(['productImages', 'variants']));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category' => ['required', new Enum(Category::class)],
            'color' => ['nullable', new Enum(Color::class)],
            'images' => 'nullable|array',
            'images.*' => 'image|max:10240',
            'sizes' => 'nullable|array',
            'sizes.*' => 'nullable|numeric|min:0',
            'is_on_sale' => 'boolean',
            'new_collection' => 'boolean',
            'sale_percentage' => 'nullable|integer|min:1|max:90',
        ]);

        $isOnSale = $request->boolean('is_on_sale');

        $product->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'category' => $validated['category'],
            'color' => $validated['color'] ?? $product->color,
            'is_on_sale' => $isOnSale,
            'sale_percentage' => $isOnSale ? $request->input('sale_percentage') : null,
            'new_collection' => $request->boolean('new_collection'),
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $product->productImages()->create([
                    'image_path' => $image->store('products', 'public'),
                ]);
            }
        }

        if ($request->has('sizes')) {
            foreach ($request->input('sizes') as $size => $stock) {
                $product->variants()->updateOrCreate(
                    ['size' => $size],
                    ['stock' => (int) $stock]
                );
            }
        }

        return new ProductResource($product->load(['productImages', 'variants']));
    }

    public function destroyImage(Product $product, \App\Models\ProductImage $image)
    {
        abort_unless($image->product_id === $product->id, 404);

        \Illuminate\Support\Facades\Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return response()->json(['message' => 'Image removed.']);
    }

    public function destroy(Product $product)
    {
        foreach ($product->productImages as $image) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($image->image_path);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully.']);
    }
}
