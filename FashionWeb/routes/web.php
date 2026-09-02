<?php

use Illuminate\Support\Facades\Route;

// The site is now a decoupled React SPA (see /frontend) talking to this
// app over the JSON API in routes/api.php. This file intentionally has
// no page routes left — Laravel only serves the API, storage files, and
// (in production) can optionally serve the built SPA, see README.
Route::get('/', function () {
    return response()->json([
        'message' => 'Aria Fashion API is running. See /api for endpoints.',
    ]);
});
