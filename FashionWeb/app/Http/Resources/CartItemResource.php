<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $product = $this->product;
        $variant = $product?->variants->firstWhere('size', $this->size);

        return [
            'id' => $this->id,
            'quantity' => $this->quantity,
            'size' => $this->size,
            'available_stock' => $variant?->stock,
            'product' => new ProductResource($product),
            'line_total' => $product
                ? round(($product->is_on_sale ? $product->getSalePrice() : $product->price) * $this->quantity, 2)
                : 0,
        ];
    }
}
