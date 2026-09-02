<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Resources\ProductResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class AdminStatsController extends Controller
{
    public function index()
    {
        $revenue = Order::whereIn('status', ['pending', 'shipped', 'delivered'])->sum('total_price');

        $ordersByStatus = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        $lowStockProducts = Product::with(['productImages', 'variants'])
            ->whereHas('variants', fn ($q) => $q->where('stock', '>', 0))
            ->get()
            ->filter(fn ($product) => $product->variants->sum('stock') <= 10)
            ->sortBy(fn ($product) => $product->variants->sum('stock'))
            ->take(5)
            ->values();

        $recentOrders = Order::with(['user', 'items.product.productImages', 'items.product.variants', 'address'])->latest()->take(5)->get();

        return response()->json([
            'total_revenue' => (float) $revenue,
            'total_orders' => Order::count(),
            'total_products' => Product::count(),
            'pending_orders' => (int) ($ordersByStatus['pending'] ?? 0),
            'orders_by_status' => $ordersByStatus,
            'low_stock_products' => ProductResource::collection($lowStockProducts),
            'recent_orders' => OrderResource::collection($recentOrders),
        ]);
    }
}
