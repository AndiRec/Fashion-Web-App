<?php

namespace Tests\Browser;

use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class ProductViewTest extends DuskTestCase
{
    /** @test */
    public function user_can_view_product_list()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/products')
                    ->assertSee('New Collection'); // Text seen in product listing
        });
    }

    /** @test */
    public function user_can_view_product_detail()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/products/1') // Use valid product ID
                    ->assertSee('Add to Cart'); // Visible button on detail page
        });
    }
}

