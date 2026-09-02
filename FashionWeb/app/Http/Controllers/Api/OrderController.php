<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function adminIndex(Request $request)
    {
        $query = Order::with(['user', 'items.product.productImages', 'items.product.variants', 'address']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->string('search');

            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        return OrderResource::collection($query->latest()->paginate($request->integer('per_page', 20)));
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|string|in:pending,shipped,delivered,canceled',
        ]);

        $order->update(['status' => $request->status]);

        return new OrderResource($order->load(['user', 'items.product.productImages', 'items.product.variants', 'address']));
    }

    public function myOrders(Request $request)
    {
        $orders = $request->user()
            ->orders()
            ->with(['items.product.productImages', 'items.product.variants', 'address'])
            ->latest()
            ->get();

        return OrderResource::collection($orders);
    }

    public function show(Request $request, Order $order)
    {
        abort_unless($order->user_id === $request->user()->id || $request->user()->hasRole('admin'), 403);

        return new OrderResource($order->load(['items.product.productImages', 'items.product.variants', 'address', 'user']));
    }

    public function cancel(Request $request, Order $order)
    {
        $user = $request->user();

        abort_unless($order->user_id === $user->id, 403);

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Only pending orders can be canceled.'], 422);
        }

        foreach ($order->items as $item) {
            $variant = $item->product->variants()->where('size', $item->size)->first();
            $variant?->increment('stock', $item->quantity);
        }

        $order->update(['status' => 'canceled']);

        return new OrderResource($order->load(['items.product.productImages', 'items.product.variants', 'address']));
    }
}
