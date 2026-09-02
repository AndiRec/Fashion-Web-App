<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    /**
     * Display a listing of the addresses for the authenticated user.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Get all addresses for the authenticated user
        $addresses = Address::where('user_id', auth()->id())->get();
        return view('address.index', compact('addresses'));
    }

    /**
     * Show the form for creating a new address.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('address.create');
    }

    /**
     * Store a newly created address in the database.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate the input
        $request->validate([
            'country' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postal_code' => 'required|string|max:255',
            'street_address' => 'required|string|max:255',
        ]);

        // Create the new address for the authenticated user
        Address::create([
            'user_id' => auth()->id(),
            'country' => $request->country,
            'city' => $request->city,
            'postal_code' => $request->postal_code,
            'street_address' => $request->street_address,
        ]);

        return redirect()->route('address.index')->with('success', 'Address added successfully.');
    }

    /**
     * Show the form for editing the specified address.
     *
     * @param \App\Models\Address $address
     * @return \Illuminate\Http\Response
     */
    public function edit(Address $address)
    {
        // Check if the address belongs to the authenticated user
        if ($address->user_id !== auth()->id()) {
            return redirect()->route('address.index')->with('error', 'Unauthorized action.');
        }

        return view('address.edit', compact('address'));
    }

    /**
     * Update the specified address in the database.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Address $address
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Address $address)
    {
        // Check if the address belongs to the authenticated user
        if ($address->user_id !== auth()->id()) {
            return redirect()->route('address.index')->with('error', 'Unauthorized action.');
        }

        // Validate the input
        $request->validate([
            'country' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postal_code' => 'required|string|max:255',
            'street_address' => 'required|string|max:255',
        ]);

        // Update the address
        $address->update($request->only(['country', 'city', 'postal_code', 'street_address']));

        return redirect()->route('address.index')->with('success', 'Address updated successfully.');
    }

    /**
     * Remove the specified address from the database.
     *
     * @param \App\Models\Address $address
     * @return \Illuminate\Http\Response
     */
    public function destroy(Address $address)
    {
        // Check if the address belongs to the authenticated user
        if ($address->user_id !== auth()->id()) {
            return redirect()->route('address.index')->with('error', 'Unauthorized action.');
        }

        // Delete the address
        $address->delete();

        return redirect()->route('address.index')->with('success', 'Address deleted successfully.');
    }
}
