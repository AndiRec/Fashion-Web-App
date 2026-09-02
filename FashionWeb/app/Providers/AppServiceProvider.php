<?php

namespace App\Providers;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // The API returns single resources unwrapped (no top-level "data" key)
        // to match the frontend's types. Paginated collections are unaffected
        // and always keep their data/links/meta shape.
        JsonResource::withoutWrapping();
    }
}
