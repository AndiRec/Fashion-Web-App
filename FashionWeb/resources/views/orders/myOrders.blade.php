@extends('layouts.app')

@section('title', 'My Orders')

@section('content')
<div class="bg-light py-5" style="min-height: 100vh;">
    <div class="container py-5">
        <div class="container" style="padding-top: 80px;">
            <h2 class="text-center mb-5">My Orders</h2>
        </div>

        @if($orders->isEmpty())
            <div class="alert alert-info text-center">
                <strong>No orders yet.</strong><br>
                Start shopping to fill your order history.
                <br>
                <a href="{{ route('products.index') }}" class="btn btn-dark mt-3">Shop Now</a>
            </div>
        @else
            <div class="row row-cols-1 g-4">
                @foreach($orders as $order)
                    @php
                        $statusClass = match($order->status) {
                            'pending' => 'warning',
                            'canceled' => 'danger',
                            'completed', 'shipped', 'delivered' => 'success',
                            default => 'secondary',
                        };
                    @endphp

                    <div class="col">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                {{-- Order Info --}}
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <span class="text-muted">
                                        <strong>Placed on:</strong> {{ $order->created_at->format('F j, Y \a\t g:i A') }}
                                    </span>
                                    <span class="badge bg-{{ $statusClass }} text-uppercase">
                                        {{ $order->status }}
                                    </span>
                                </div>

                                {{-- Order Items --}}
                                <h6 class="fw-bold mb-2">Items:</h6>
                                <ul class="list-group list-group-flush mb-3">
                                    @foreach($order->items as $item)
                                        @php
                                            $product = $item->product;
                                            $variant = $product->variants->first(); // fallback
                                            $sizeLabel = $item->size ?? ($variant->size ?? 'Not specified');
                                            $isOnSale = $product->is_on_sale;
                                            $originalPrice = $product->price;
                                            $salePrice = $product->getSalePrice();
                                            $discount = $product->getDiscountPercentage();
                                        @endphp

                                        <li class="list-group-item d-flex align-items-center">
                                            {{-- Product Image --}}
                                            @if($product && $product->productImages->count())
                                                <img src="{{ asset('storage/' . $product->productImages->first()->image_path) }}"
                                                     alt="{{ $product->name }}"
                                                     class="me-3"
                                                     style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px;">
                                            @else
                                                <div class="me-3 bg-light d-flex align-items-center justify-content-center"
                                                     style="width: 70px; height: 70px; border-radius: 8px;">
                                                    <small class="text-muted">No image</small>
                                                </div>
                                            @endif

                                            {{-- Product Info --}}
                                            <div class="flex-grow-1">
                                                <div class="fw-bold d-flex align-items-center">
                                                    {{ $product->name }}
                                                    @if($isOnSale)
                                                        <span class="badge bg-danger ms-2">SALE</span>
                                                    @endif
                                                </div>

                                                <small class="text-muted">
                                                    Size: {{ $sizeLabel }}<br>
                                                    Qty: {{ $item->quantity }}
                                                </small>

                                                @if($isOnSale)
                                                    <div class="d-flex align-items-center gap-2">
                                                        <small class="text-muted text-decoration-line-through">
                                                            {{ number_format($originalPrice, 2) }} Den
                                                        </small>
                                                        <small class="fw-bold text-danger">
                                                            {{ number_format($salePrice, 2) }} Den
                                                        </small>
                                                        <span class="badge bg-danger">-{{ $discount }}%</span>
                                                    </div>
                                                @else
                                                    <small class="text-muted">
                                                        Price: {{ number_format($originalPrice, 2) }} Den
                                                    </small>
                                                @endif
                                            </div>
                                        </li>
                                    @endforeach
                                </ul>

                                {{-- Order Total --}}
                                <p class="mb-2">
                                    <strong>Total:</strong> {{ number_format($order->total_price, 2) }} Den
                                </p>

                                {{-- Address --}}
                                <p class="mb-0">
                                    <strong>Shipping Address:</strong><br>
                                    @if($order->address)
                                        {{ $order->address->street_address }},
                                        {{ $order->address->city }},
                                        {{ $order->address->country }}
                                    @else
                                        <em>Not provided</em>
                                    @endif
                                </p>

                                {{-- Cancel Button --}}
                                @if($order->status === 'pending' && $order->created_at->diffInMinutes(now()) <= 5)
                                    <form action="{{ route('orders.cancel', $order->id) }}" method="POST"
                                          class="text-end mt-3"
                                          onsubmit="return confirm('Are you sure you want to cancel this order?');">
                                        @csrf
                                        <button type="submit" class="btn btn-outline-danger">Cancel Order</button>
                                    </form>
                                @endif
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        @endif
    </div>
</div>
@endsection



