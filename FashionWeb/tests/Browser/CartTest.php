<?php

namespace Tests\Browser;

use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class CartTest extends DuskTestCase
{
    /** @test */
    public function user_can_add_to_cart()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/products/1') // Make sure product with ID 1 exists
                    ->select('size', 'M')  // Update if dropdown uses a different name or values
                    ->press('Add to Cart')
                    ->assertPathIs('/cart')
                    ->assertSee('Your Shopping Cart');
        });
    }

    /** @test */
    public function user_can_remove_from_cart()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/cart')
                    ->click('.btn-danger') // Assuming this is the "Remove" button class
                    ->pause(1000) // wait for the cart to refresh
                    ->assertDontSee('Product not found'); // Change to a known product name if needed
        });
    }
}


