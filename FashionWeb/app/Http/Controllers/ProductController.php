<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Enum;
use App\Enums\Category;
use App\Enums\Color;
use App\Enums\Size;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('size')) {
            $query->whereHas('variants', function ($q) use ($request) {
                $q->where('size', $request->size);
            });
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', floatval($request->min_price));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', floatval($request->max_price));
        }

        if ($request->has('on_sale')) {
            $query->where('is_on_sale', true);
        }

        if ($request->has('new_collection')) {
            $query->where('new_collection', true);
        }

        $products = $query->paginate(12);

        return view('products.index', [
            'products' => $products,
            'categories' => Category::cases(),
            'sizes' => Size::cases(),
        ]);
    }

    public function create()
    {
        $categories = Category::cases();
        $colors = Color::cases();
        $sizes = Size::cases();

        return view('products.create', compact('categories', 'colors', 'sizes'));
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'name'            => 'required|string|max:255',
        'description'     => 'required|string',
        'price'           => 'required|numeric|min:0',
        'category'        => ['required', new Enum(Category::class)],
        'color'           => ['required', new Enum(Color::class)],
        'image'           => 'nullable|image|max:2048',
        'sizes'           => 'required|array',
        'sizes.*'         => 'nullable|numeric|min:0',
        'sale_percentage' => 'nullable|integer|min:1|max:90',
    ]);

    $isOnSale = $request->has('is_on_sale');
    $salePercentage = $isOnSale ? $request->input('sale_percentage') : null;
    $isNewCollection = $request->has('new_collection');

    $product = Product::create([
        'name'            => $validated['name'],
        'description'     => $validated['description'],
        'price'           => $validated['price'],
        'category'        => $validated['category'],
        'color'           => $validated['color'],
        'is_on_sale'      => $isOnSale,
        'sale_percentage' => $salePercentage,
        'new_collection'  => $isNewCollection,
    ]);

    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('products', 'public');
        $product->update(['image' => $imagePath]);
    }

    foreach ($request->input('sizes') as $size => $stock) {
        $product->variants()->create([
            'size'  => $size,
            'stock' => (int) $stock,
        ]);
    }

    return redirect()->route('products.index')->with('success', 'Product created successfully.');
}





    public function show($id)
    {
        $product = Product::with(['productImages', 'variants'])->find($id);

        if (!$product) {
            return redirect()->route('products.index')->with('error', 'Product not found.');
        }

        return view('products.show', compact('product'));
    }

    public function edit($id)
    {
        $product = Product::with(['productImages', 'variants'])->find($id);

        if (!$product) {
            return redirect()->route('products.index')->with('error', 'Product not found.');
        }

        $categories = Category::cases();
        $colors = Color::cases();
        $sizes = Size::cases();

        return view('products.edit', compact('product', 'categories', 'colors', 'sizes'));
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name'            => 'required|string|max:255',
            'description'     => 'nullable|string',
            'price'           => 'required|integer|min:0',
            'category'        => ['required', new Enum(Category::class)],
            'color'           => ['required', new Enum(Color::class)],
            'sale_percentage' => 'nullable|integer|min:1|max:90',
            'images.*'        => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'sizes'           => 'nullable|array',
            'sizes.*'         => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $product = Product::find($id);

        if (!$product) {
            return redirect()->route('products.index')->with('error', 'Product not found.');
        }

        $isOnSale = $request->has('is_on_sale');
        $salePercentage = $isOnSale ? $request->input('sale_percentage') : null;
        $isNewCollection = $request->has('new_collection');

        $product->update([
            'name'            => $request->input('name'),
            'description'     => $request->input('description'),
            'price'           => $request->input('price'),
            'category'        => $request->input('category'),
            'color'           => $request->input('color'),
            'is_on_sale'      => $isOnSale,
            'sale_percentage' => $salePercentage,
            'new_collection'  => $isNewCollection,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('product_images', 'public');
                $product->productImages()->create([
                    'image_path' => $path,
                ]);
            }
        }

        // Update or create variants
        if ($request->has('sizes')) {
            foreach ($request->input('sizes') as $size => $stock) {
                $variant = $product->variants()->where('size', $size)->first();

                if ($variant) {
                    $variant->update(['stock' => (int) $stock]);
                } else {
                    $product->variants()->create([
                        'size' => $size,
                        'stock' => (int) $stock,
                    ]);
                }
            }
        }

        return redirect()->route('products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return redirect()->route('products.index')->with('error', 'Product not found.');
        }

        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
    }
}


