<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_products_index_returns_paginated_products(): void
    {
        Product::factory()->count(3)->create();

        $this->getJson('/api/products')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_guest_cannot_create_product(): void
    {
        $this->postJson('/api/products', [])->assertUnauthorized();
    }

    public function test_admin_can_create_product(): void
    {
        Role::firstOrCreate(['name' => 'admin']);

        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $response = $this->actingAs($admin)->postJson('/api/products', [
            'name' => 'Test Dress',
            'description' => 'A lovely test dress.',
            'price' => 1000,
            'category' => 'dress',
            'color' => 'black',
            'sizes' => ['S' => 5, 'M' => 5],
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('products', ['name' => 'Test Dress']);
    }
}
