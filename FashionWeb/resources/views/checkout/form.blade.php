@extends('layouts.app')

@section('content')
<div class="container my-5">
    <h2 class="mb-4 text-center fw-bold">Checkout</h2>

    @if(session('error'))
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            {{ session('error') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif

    <div class="row g-4">
        {{-- Cart Summary --}}
        <div class="col-lg-6">
            <div class="card shadow-sm">
                <div class="card-header bg-primary text-white fw-semibold fs-5">
                    Your Cart Summary
                </div>
                <div class="card-body p-0">
                    @php $total = 0; @endphp
                    <div class="table-responsive">
                        <table class="table mb-0 align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th>Product</th>
                                    <th>Size</th>
                                    <th class="text-center" style="width: 80px;">Qty</th>
                                    <th class="text-end" style="width: 120px;">Unit Price</th>
                                    <th class="text-end" style="width: 120px;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($user->cartItems as $item)
                                    @php
                                        $product = $item->product;
                                        $variant = $product->variants->firstWhere('size', $item->size);
                                        $maxStock = $variant ? $variant->stock : 0;

                                        $unitPrice = ($product->is_on_sale && $product->sale_percentage)
                                            ? $product->getSalePrice()
                                            : $product->price;

                                        $lineTotal = $unitPrice * $item->quantity;
                                        $total += $lineTotal;
                                    @endphp
                                    <tr>
                                        <td>{{ $product->name }}</td>
                                        <td>{{ $item->size }}</td>
                                        <td class="text-center">{{ $item->quantity }}</td>
                                        <td class="text-end">
                                            @if($product->is_on_sale && $product->sale_percentage)
                                                <div>
                                                    <span class="text-muted text-decoration-line-through">{{ number_format($product->price, 2) }} Den</span><br>
                                                    <span class="text-danger fw-bold">{{ number_format($unitPrice, 2) }} Den</span><br>
                                                    <span class="badge bg-danger">-{{ $product->sale_percentage }}%</span>
                                                </div>
                                            @else
                                                {{ number_format($unitPrice, 2) }} Den
                                            @endif
                                        </td>
                                        <td class="text-end fw-semibold">{{ number_format($lineTotal, 2) }} Den</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="card-footer bg-light text-end fw-bold fs-5">
                    Total: {{ number_format($total, 2) }} Den
                </div>
            </div>
        </div>

        {{-- Checkout Form --}}
        <div class="col-lg-6">
            <div class="card shadow-sm">
                <div class="card-header bg-primary text-white fw-semibold fs-5">
                    Your Information & Shipping Address
                </div>
                <div class="card-body">
                    <form method="POST" action="{{ route('checkout.submit') }}">
                        @csrf

                        {{-- User Info --}}
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Name:</label>
                            <input type="text" class="form-control" value="{{ $user->name }}" disabled>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-semibold">Email:</label>
                            <input type="email" class="form-control" value="{{ $user->email }}" disabled>
                        </div>

                        <div class="mb-4">
                            <label for="phone" class="form-label fw-semibold">Phone Number <span class="text-danger">*</span></label>
                            <input type="tel" class="form-control @error('phone') is-invalid @enderror" name="phone" id="phone" value="{{ old('phone', $user->phone) }}" required placeholder="+1 555 123 4567">
                            @error('phone')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <hr>

                        {{-- Address Selection --}}
                        <div class="mb-3">
                            <label for="address_id" class="form-label fw-semibold">Choose a saved address:</label>
                            @if($addresses->isNotEmpty())
                                <select name="address_id" id="address_id" class="form-select" onchange="toggleNewAddress(this)">
                                    <option value="" selected>-- Add New Address --</option>
                                    @foreach($addresses as $address)
                                        <option value="{{ $address->id }}">
                                            {{ $address->street_address }}, {{ $address->city }}, {{ $address->postal_code }}, {{ $address->country }}
                                        </option>
                                    @endforeach
                                </select>
                            @else
                                <p class="text-muted fst-italic">You don’t have any saved addresses. Please enter a new one below.</p>
                            @endif
                        </div>

                        {{-- New Address Fields --}}
                        <div id="new-address-fields" class="mb-4">
                            <h6 class="fw-semibold mb-3">Or Enter a New Address:</h6>

                            <div class="mb-3">
                                <label for="street_address" class="form-label">Street <span class="text-danger">*</span></label>
                                <input type="text" class="form-control @error('street_address') is-invalid @enderror" name="street_address" id="street_address" placeholder="123 Main St" value="{{ old('street_address') }}">
                                @error('street_address')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="city" class="form-label">City <span class="text-danger">*</span></label>
                                <input type="text" class="form-control @error('city') is-invalid @enderror" name="city" id="city" placeholder="Your City" value="{{ old('city') }}">
                                @error('city')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="postal_code" class="form-label">Postal Code <span class="text-danger">*</span></label>
                                <input type="text" class="form-control @error('postal_code') is-invalid @enderror" name="postal_code" id="postal_code" placeholder="12345" value="{{ old('postal_code') }}">
                                @error('postal_code')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="country" class="form-label">Country <span class="text-danger">*</span></label>
                                <input type="text" class="form-control @error('country') is-invalid @enderror" name="country" id="country" placeholder="Country" value="{{ old('country') }}">
                                @error('country')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary w-100 btn-lg fw-semibold">Confirm and Place Order</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    function toggleNewAddress(select) {
        const newAddressFields = document.getElementById('new-address-fields');
        newAddressFields.style.display = select.value ? 'none' : 'block';
    }

    document.addEventListener('DOMContentLoaded', () => {
        const select = document.getElementById('address_id');
        if (select && select.value) {
            toggleNewAddress(select);
        }
    });
</script>
@endsection



