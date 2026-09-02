<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | The React SPA (resources are served from a completely separate origin,
    | e.g. http://localhost:5173 in dev) talks to this API over fetch/axios,
    | so every "api/*" route needs CORS headers. Allowed origins are driven
    | by FRONTEND_URL (and FRONTEND_URLS for multiple, comma separated) so
    | production domains can be configured purely via environment variables.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter(array_merge(
        [env('FRONTEND_URL', 'http://localhost:5173')],
        explode(',', (string) env('FRONTEND_URLS', ''))
    )),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
