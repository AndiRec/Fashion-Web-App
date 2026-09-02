<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('shopping_carts', function (Blueprint $table) {
            // Add the size column
            $table->string('size')->after('product_id');

            // Add a unique constraint across user_id + product_id + size
            $table->unique(['user_id', 'product_id', 'size'], 'unique_cart_user_product_size');
        });
    }

    public function down(): void
    {
        Schema::table('shopping_carts', function (Blueprint $table) {
            $table->dropUnique('unique_cart_user_product_size');
            $table->dropColumn('size');
        });
    }
};


