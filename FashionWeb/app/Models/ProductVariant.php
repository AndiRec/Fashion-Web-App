<?php

namespace App\Models;
use App\Enums\Size;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class ProductVariant extends Model
{
    protected $fillable = ['product_id', 'size', 'stock'];

    protected $casts = [
        'size' => Size::class,
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}





