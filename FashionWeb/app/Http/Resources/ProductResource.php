<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => (float) $this->price,
            'sale_price' => $this->getSalePrice(),
            'discount_percentage' => $this->getDiscountPercentage(),
            'is_on_sale' => (bool) $this->is_on_sale,
            'new_collection' => (bool) $this->new_collection,
            'category' => $this->category,
            'color' => $this->color,
            'total_stock' => $this->whenLoaded('variants', function () {
                return $this->variants->sum('stock');
            }),
            'images' => ProductImageResource::collection($this->whenLoaded('productImages')),
            'variants' => ProductVariantResource::collection($this->whenLoaded('variants')),
            'created_at' => $this->created_at,
        ];
    }
}
