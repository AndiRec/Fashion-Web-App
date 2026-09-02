<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AddressResource;
use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        return AddressResource::collection($request->user()->addresses);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'country' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postal_code' => 'required|string|max:255',
            'street_address' => 'required|string|max:255',
        ]);

        $address = $request->user()->addresses()->create($validated);

        return new AddressResource($address);
    }

    public function update(Request $request, Address $address)
    {
        abort_unless($address->user_id === $request->user()->id, 404);

        $validated = $request->validate([
            'country' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postal_code' => 'required|string|max:255',
            'street_address' => 'required|string|max:255',
        ]);

        $address->update($validated);

        return new AddressResource($address);
    }

    public function destroy(Request $request, Address $address)
    {
        abort_unless($address->user_id === $request->user()->id, 404);

        $address->delete();

        return response()->json(['message' => 'Address deleted.']);
    }
}
