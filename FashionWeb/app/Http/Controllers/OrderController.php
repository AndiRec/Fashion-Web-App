<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItems;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
    $query = Order::with(['user', 'items.product', 'address']);

    if ($request->filled('status')) {
        $query->where('status', $request->status);
    }

    $orders = $query->latest()->get();

    $statuses = ['pending', 'shipped', 'delivered', 'canceled'];

    return view('orders.index', compact('orders', 'statuses'));
    }




    public function create()
    {
        return view('orders.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'total_price' => 'required|numeric',
            'status' => 'required|string',
            'items' => 'required|array',
        ]);

        DB::beginTransaction();

        try {
            // Step 1: Pre-check all stock
            foreach ($request->items as $item) {
                $variant = Product::findOrFail($item['product_id'])
                    ->variants()
                    ->where('size', $item['size'])
                    ->first();

                if (!$variant || $variant->stock < $item['quantity']) {
                    throw new \Exception("Insufficient stock for product {$item['product_id']} - size {$item['size']}");
                }
            }

            // Step 2: Create the order
            $order = Order::create([
                'user_id' => $request->user_id,
                'total_price' => $request->total_price,
                'status' => $request->status,
            ]);

            // Step 3: Create items + decrement stock
            foreach ($request->items as $item) {
                $order->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);

                $variant = Product::find($item['product_id'])
                    ->variants()
                    ->where('size', $item['size'])
                    ->first();

                $variant->stock -= $item['quantity'];
                $variant->save();
            }

            DB::commit();
            return redirect()->route('orders.index')->with('success', 'Order created and stock updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Order failed: ' . $e->getMessage());
        }
    }

    public function show(Order $order)
    {
        return view('orders.show', compact('order'));
    }

    public function edit(Order $order)
    {
        return view('orders.edit', compact('order'));
    }

    public function adminIndex()
    {
        $orders = Order::with(['user', 'items.product', 'address'])->get();
        return view('orders.index', compact('orders'));
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|string|in:pending,shipped,delivered,canceled',
        ]);

        $order->status = $request->status;
        $order->save();

        return back()->with('success', 'Order status updated successfully.');
    }

    public function myOrders()
    {
        $user = auth()->user();
        $orders = $user->orders()
            ->with(['items.product', 'address'])
            ->latest()
            ->get();

        return view('orders.myOrders', compact('orders'));
    }

    public function cancel(Order $order)
    {
        $user = auth()->user();

        if ($order->user_id !== $user->id) {
            abort(403, 'You are not authorized to cancel this order.');
        }

        if ($order->status !== 'pending') {
            return back()->with('error', 'Only pending orders can be canceled.');
        }

        // Restore stock
        foreach ($order->items as $item) {
            $variant = $item->product->variants()->where('size', $item->size)->first();
            if ($variant) {
                $variant->stock += $item->quantity;
                $variant->save();
            }
        }

        $order->status = 'canceled';
        $order->save();

        return back()->with('success', 'Order canceled and stock restored successfully.');
    }
}



