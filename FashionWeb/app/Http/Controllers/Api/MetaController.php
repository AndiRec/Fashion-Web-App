<?php

namespace App\Http\Controllers\Api;

use App\Enums\Category;
use App\Enums\Color;
use App\Enums\Size;
use App\Http\Controllers\Controller;

class MetaController extends Controller
{
    public function index()
    {
        return response()->json([
            'categories' => array_column(Category::cases(), 'value'),
            'colors' => array_column(Color::cases(), 'value'),
            'sizes' => array_column(Size::cases(), 'value'),
        ]);
    }
}
