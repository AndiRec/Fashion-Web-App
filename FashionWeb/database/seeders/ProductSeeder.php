<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ProductSeeder extends Seeder
{
    /**
     * Demo catalog so a fresh `migrate:fresh --seed` shows a populated store.
     * Reuses the sample photography already shipped in public/images.
     */
    public function run(): void
    {
        if (Product::count() > 0) {
            return;
        }

        $catalog = [
            ['name' => 'Struga Silk Slip Dress', 'category' => 'dress', 'color' => 'black', 'price' => 3200, 'image' => 'product-item1.jpg', 'new' => true],
            ['name' => 'Ohrid Linen Midi Dress', 'category' => 'dress', 'color' => 'white', 'price' => 2800, 'image' => 'product-item2.jpg', 'sale' => 30],
            ['name' => 'Pleated Satin Skirt', 'category' => 'skirt', 'color' => 'black', 'price' => 1900, 'image' => 'product-item3.jpg', 'new' => true],
            ['name' => 'Draped Wrap Skirt', 'category' => 'skirt', 'color' => 'green', 'price' => 1650, 'image' => 'product-item4.jpg'],
            ['name' => 'Cotton Poplin Blouse', 'category' => 'blouse', 'color' => 'white', 'price' => 1450, 'image' => 'product-item5.jpg', 'sale' => 20],
            ['name' => 'Tailored Silk Blouse', 'category' => 'blouse', 'color' => 'blue', 'price' => 1800, 'image' => 'product-item6.jpg'],
            ['name' => 'Ribbed Essential Tee', 'category' => 'tshirt', 'color' => 'white', 'price' => 850, 'image' => 'product-item7.jpg'],
            ['name' => 'Oversized Graphic Tee', 'category' => 'tshirt', 'color' => 'black', 'price' => 950, 'image' => 'product-item8.jpg', 'new' => true],
            ['name' => 'Wide Leg Tailored Trousers', 'category' => 'pants', 'color' => 'black', 'price' => 2400, 'image' => 'product-item9.jpg'],
            ['name' => 'High Waist Denim', 'category' => 'pants', 'color' => 'blue', 'price' => 2100, 'image' => 'product-item10.jpg', 'sale' => 15],
            ['name' => 'Belted Wool Coat', 'category' => 'coat', 'color' => 'black', 'price' => 5600, 'image' => 'product-item11.jpg', 'new' => true],
            ['name' => 'Fitted Bodycon Dress', 'category' => 'bodycon', 'color' => 'red', 'price' => 2600, 'image' => 'product-item12.jpg', 'sale' => 25],
        ];

        Storage::disk('public')->makeDirectory('products');

        foreach ($catalog as $data) {
            $product = Product::create([
                'name' => $data['name'],
                'description' => "The {$data['name']} is crafted from premium fabric with an effortless, timeless silhouette — designed in Struga for everyday elegance.",
                'price' => $data['price'],
                'category' => $data['category'],
                'color' => $data['color'],
                'is_on_sale' => isset($data['sale']),
                'sale_percentage' => $data['sale'] ?? null,
                'new_collection' => $data['new'] ?? false,
            ]);

            $source = public_path('images/'.$data['image']);

            if (File::exists($source)) {
                $destination = 'products/'.$data['image'];
                Storage::disk('public')->put($destination, File::get($source));

                $product->productImages()->create(['image_path' => $destination]);
            }

            foreach (['XS', 'S', 'M', 'L', 'XL'] as $size) {
                $product->variants()->create([
                    'size' => $size,
                    'stock' => random_int(0, 20),
                ]);
            }
        }
    }
}
