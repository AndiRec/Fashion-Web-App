<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
          

            // Add sale_percentage column
            $table->unsignedTinyInteger('sale_percentage')->nullable()->after('is_on_sale');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('sale_percentage');

            // Optionally drop is_on_sale if you only use it for this feature
            // $table->dropColumn('is_on_sale');
        });
    }
};



