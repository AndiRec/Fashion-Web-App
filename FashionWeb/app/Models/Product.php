<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'price', 'category', 'color', 'is_on_sale', 'new_collection', 'sale_percentage'];

    public function productImages()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function getSalePrice(): float
            {
            if (!$this->is_on_sale || !$this->sale_percentage) {
            return $this->price;
            }
            $discount = ($this->price * $this->sale_percentage) / 100;
            return round($this->price - $discount, 2);
            }


        public function getDiscountPercentage(): int
            {
            return $this->is_on_sale && $this->sale_percentage
            ? $this->sale_percentage
            : 0;
            }

        public function variants()
        {
            return $this->hasMany(ProductVariant::class);
        }


    
    
}


