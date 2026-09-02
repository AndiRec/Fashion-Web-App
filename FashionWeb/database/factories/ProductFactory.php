<?php

namespace Database\Factories;

use App\Enums\Category;
use App\Enums\Color;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'description' => fake()->paragraph(),
            'price' => fake()->numberBetween(500, 6000),
            'category' => fake()->randomElement(Category::cases())->value,
            'color' => fake()->randomElement(Color::cases())->value,
            'is_on_sale' => false,
            'sale_percentage' => null,
            'new_collection' => false,
        ];
    }
}
