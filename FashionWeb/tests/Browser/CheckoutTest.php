<?php

namespace Tests\Browser;

use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class CheckoutTest extends DuskTestCase
{
    /** @test */
    public function user_can_checkout()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/products')
                    ->press('Proceed to Checkout') // corrected button label
                    ->assertPathIs('/checkout')
                    ->type('address', '123 Main St')
                    ->press('Place Order') // make sure this button exists in your checkout form
                    ->assertSee('Order Confirmed'); // adjust based on confirmation page
        });
    }
}



