<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'quantity' => $this->quantity,
            'size' => $this->size,
            'unit_price' => (float) $this->productPriceQuantity,
            'product' => new ProductResource($this->whenLoaded('product')),
        ];
    }
}
