<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('products', function (Blueprint $table) {
        $table->id(); // Primary key
        $table->string('name');
        $table->text('description')->nullable(); // You can store larger text here
        $table->integer('price'); // Adjust precision and scale as needed
        $table->string('category');//Maybe Enumm??????????????????????????Easier to manipulate like this(front-end dropdown)
        $table->string('color');
        $table->boolean('is_on_sale')->default(false);
        $table->boolean('new_collection')->default(false);
        $table->timestamps(); // Created_at and updated_at
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
