<?php

namespace App\Http\Controllers;

use App\Models\OrderItems;
use Illuminate\Http\Request;

class OrderItemsController extends Controller
{
    /**
     * Display a listing of the order items.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Get all order items
        $orderItems = OrderItems::with('product')->get();
        return view('order_items.index', compact('orderItems'));
    }

    /**
     * Show the form for creating a new order item.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('order_items.create');
    }

    /**
     * Store a newly created order item in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate input
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'productPriceQuantity' => 'required|numeric',
        ]);

        // Create the order item
        OrderItems::create([
            'order_id' => $request->order_id,
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'productPriceQuantity' => $request->productPriceQuantity,
        ]);

        return redirect()->route('order_items.index')->with('success', 'Order item added successfully.');
    }

    /**
     * Display the specified order item.
     *
     * @param \App\Models\OrderItems $orderItem
     * @return \Illuminate\Http\Response
     */
    public function show(OrderItems $orderItem)
    {
        return view('order_items.show', compact('orderItem'));
    }

    /**
     * Show the form for editing the specified order item.
     *
     * @param \App\Models\OrderItems $orderItem
     * @return \Illuminate\Http\Response
     */
    public function edit(OrderItems $orderItem)
    {
        return view('order_items.edit', compact('orderItem'));
    }

    /**
     * Update the specified order item in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\OrderItems $orderItem
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, OrderItems $orderItem)
    {
        // Validate input
        $request->validate([
            'quantity' => 'required|integer|min:1',
            'productPriceQuantity' => 'required|numeric',
        ]);

        // Update the order item
        $orderItem->update([
            'quantity' => $request->quantity,
            'productPriceQuantity' => $request->productPriceQuantity,
        ]);

        return redirect()->route('order_items.index')->with('success', 'Order item updated successfully.');
    }

    /**
     * Remove the specified order item from storage.
     *
     * @param \App\Models\OrderItems $orderItem
     * @return \Illuminate\Http\Response
     */
    public function destroy(OrderItems $orderItem)
    {
        $orderItem->delete();
        return redirect()->route('order_items.index')->with('success', 'Order item deleted successfully.');
    }
}
