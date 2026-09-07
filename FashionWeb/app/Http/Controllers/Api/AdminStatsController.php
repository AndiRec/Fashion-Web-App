<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Resources\ProductResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class AdminStatsController extends Controller
{
    private const PAID_STATUSES = ['pending', 'shipped', 'delivered'];

    public function index(Request $request)
    {
        [$from, $to] = $this->resolveRange($request->string('range', 'all_time')->toString());

        $rangedOrders = Order::query()->when($from, fn ($q) => $q->where('created_at', '>=', $from))
            ->when($to, fn ($q) => $q->where('created_at', '<=', $to));

        $revenue = (clone $rangedOrders)->whereIn('status', self::PAID_STATUSES)->sum('total_price');

        $ordersByStatus = (clone $rangedOrders)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        $lowStockProducts = Product::with(['productImages', 'variants'])
            ->whereHas('variants', fn ($q) => $q->where('stock', '>', 0))
            ->get()
            ->filter(fn ($product) => $product->variants->sum('stock') <= 10)
            ->sortBy(fn ($product) => $product->variants->sum('stock'))
            ->take(5)
            ->values();

        $recentOrders = Order::with(['user', 'items.product.productImages', 'items.product.variants', 'address'])
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'range' => $request->string('range', 'all_time')->toString(),
            'total_revenue' => (float) $revenue,
            'total_orders' => (clone $rangedOrders)->count(),
            'total_products' => Product::count(),
            'pending_orders' => (int) ($ordersByStatus['pending'] ?? 0),
            'orders_by_status' => $ordersByStatus,
            'monthly_revenue' => $this->monthlyRevenue(),
            'low_stock_products' => ProductResource::collection($lowStockProducts),
            'recent_orders' => OrderResource::collection($recentOrders),
        ]);
    }

    /**
     * Revenue for each of the last 12 calendar months, oldest first — grouped
     * in PHP rather than a DB-specific date function so it works the same on
     * SQLite (local dev) and MySQL/Postgres (production) alike.
     */
    private function monthlyRevenue(): array
    {
        $windowStart = now()->subMonths(11)->startOfMonth();

        $orders = Order::whereIn('status', self::PAID_STATUSES)
            ->where('created_at', '>=', $windowStart)
            ->get(['total_price', 'created_at']);

        $grouped = $orders->groupBy(fn (Order $order) => $order->created_at->format('Y-m'));

        return collect(range(11, 0))
            ->map(function (int $monthsAgo) use ($grouped) {
                $date = now()->subMonthsNoOverflow($monthsAgo);
                $key = $date->format('Y-m');
                $monthOrders = $grouped->get($key, collect());

                return [
                    'month' => $key,
                    'label' => $date->format('M Y'),
                    'revenue' => (float) $monthOrders->sum('total_price'),
                    'orders' => $monthOrders->count(),
                ];
            })
            ->values()
            ->all();
    }

    /**
     * @return array{0: ?Carbon, 1: ?Carbon}
     */
    private function resolveRange(string $range): array
    {
        return match ($range) {
            'this_month' => [now()->startOfMonth(), now()->endOfMonth()],
            'last_month' => [now()->subMonthNoOverflow()->startOfMonth(), now()->subMonthNoOverflow()->endOfMonth()],
            'last_30_days' => [now()->subDays(30)->startOfDay(), now()->endOfDay()],
            'this_year' => [now()->startOfYear(), now()->endOfYear()],
            default => [null, null],
        };
    }
}
