<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Order;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the invoices for the given order.
     *
     * @param \App\Models\Order $order
     * @return \Illuminate\Http\Response
     */
    public function index(Order $order)
    {
        // Fetch all invoices for the given order
        $invoices = $order->invoices;
        return view('invoice.index', compact('invoices', 'order'));
    }

    /**
     * Show the form for creating a new invoice.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Order $order)
    {
        return view('invoice.create', compact('order'));
    }

    /**
     * Store a newly created invoice in the database.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Order $order)
    {
        // Validate the input
        $request->validate([
            'invoice_number' => 'required|string|max:255',
            'total_amount' => 'required|numeric',
            'invoice_date' => 'required|date',
        ]);

        // Create the new invoice for the order
        Invoice::create([
            'order_id' => $order->id,
            'invoice_number' => $request->invoice_number,
            'total_amount' => $request->total_amount,
            'invoice_date' => $request->invoice_date,
        ]);

        return redirect()->route('invoice.index', $order)->with('success', 'Invoice created successfully.');
    }

    /**
     * Show the form for editing the specified invoice.
     *
     * @param \App\Models\Invoice $invoice
     * @return \Illuminate\Http\Response
     */
    public function edit(Invoice $invoice)
    {
        return view('invoice.edit', compact('invoice'));
    }

    /**
     * Update the specified invoice in the database.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Invoice $invoice
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Invoice $invoice)
    {
        // Validate the input
        $request->validate([
            'invoice_number' => 'required|string|max:255',
            'total_amount' => 'required|numeric',
            'invoice_date' => 'required|date',
        ]);

        // Update the invoice
        $invoice->update($request->only(['invoice_number', 'total_amount', 'invoice_date']));

        return redirect()->route('invoice.index', $invoice->order)->with('success', 'Invoice updated successfully.');
    }

    /**
     * Remove the specified invoice from the database.
     *
     * @param \App\Models\Invoice $invoice
     * @return \Illuminate\Http\Response
     */
    public function destroy(Invoice $invoice)
    {
        // Delete the invoice
        $invoice->delete();

        return redirect()->route('invoice.index', $invoice->order)->with('success', 'Invoice deleted successfully.');
    }
}
