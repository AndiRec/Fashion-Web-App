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
     * A handful of entries reuse the real boutique photography already
     * shipped in public/images; the rest ship without images so the UI's
     * placeholder state is easy to see too.
     */
    public function run(): void
    {
        if (Product::count() > 0) {
            return;
        }

        $catalog = [
            ['name' => 'Cornflower Tailored Blazer', 'category' => 'coat', 'color' => 'blue', 'price' => 4200, 'image' => 'lookbook-blazer-blue.jpg', 'new' => true],
            ['name' => 'Charcoal Button Vest', 'category' => 'top', 'color' => 'black', 'price' => 2400, 'image' => 'lookbook-vest-charcoal.jpg'],
            ['name' => 'Golden Hour Eyelet Dress', 'category' => 'dress', 'color' => 'white', 'price' => 2900, 'image' => 'lookbook-dress-yellow.jpg', 'new' => true, 'sale' => 20],
            ['name' => 'Struga Safari Belted Dress', 'category' => 'dress', 'color' => 'white', 'price' => 3100, 'image' => 'lookbook-dress-safari.jpg'],
            ['name' => 'Blush Satin Cropped Blazer', 'category' => 'coat', 'color' => 'white', 'price' => 4600, 'image' => 'lookbook-blazer-blush.jpg', 'sale' => 15],
            ['name' => 'Pleated Satin Midi Skirt', 'category' => 'skirt', 'color' => 'black', 'price' => 1900, 'new' => true],
            ['name' => 'Ohrid Linen Wrap Skirt', 'category' => 'skirt', 'color' => 'green', 'price' => 1650],
            ['name' => 'Cotton Poplin Blouse', 'category' => 'blouse', 'color' => 'white', 'price' => 1450, 'sale' => 25],
            ['name' => 'Ribbed Essential Tee', 'category' => 'tshirt', 'color' => 'white', 'price' => 850],
            ['name' => 'Wide Leg Tailored Trousers', 'category' => 'pants', 'color' => 'black', 'price' => 2400, 'new' => true],
            ['name' => 'Fitted Bodycon Dress', 'category' => 'bodycon', 'color' => 'red', 'price' => 2600, 'sale' => 30],
            ['name' => 'Silk Twill Headscarf', 'category' => 'accessory', 'color' => 'green', 'price' => 690],
        ];

        Storage::disk('public')->makeDirectory('products');

        foreach ($catalog as $data) {
            $product = Product::create([
                'name' => $data['name'],
                'description' => "The {$data['name']} is crafted from premium fabric with an effortless, timeless silhouette — designed for everyday elegance at Aria Fashion, Struga.",
                'price' => $data['price'],
                'category' => $data['category'],
                'color' => $data['color'],
                'is_on_sale' => isset($data['sale']),
                'sale_percentage' => $data['sale'] ?? null,
                'new_collection' => $data['new'] ?? false,
            ]);

            if (isset($data['image'])) {
                $source = public_path('images/'.$data['image']);

                if (File::exists($source)) {
                    $destination = 'products/'.$data['image'];
                    Storage::disk('public')->put($destination, File::get($source));

                    $product->productImages()->create(['image_path' => $destination]);
                }
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
