@extends('layouts.app')

@section('title', 'All Orders')

@section('content')
<div class="bg-light py-5" style="min-height: 100vh;">
    <div class="container py-5">
        <div class="mb-5 text-center">
            <h2 class="fw-bold">All Orders</h2>
        </div>

        {{-- Success message --}}
        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        {{-- Filter form --}}
        <form method="GET" action="{{ route('orders.index') }}" class="mb-4">
            <div class="row align-items-end">
                <div class="col-md-4">
                    <label for="status" class="form-label">Filter by Status</label>
                    <select name="status" id="status" class="form-select">
                        <option value="">-- All Statuses --</option>
                        @foreach($statuses as $status)
                            <option value="{{ $status }}" {{ request('status') === $status ? 'selected' : '' }}>
                                {{ ucfirst($status) }}
                            </option>
                        @endforeach
                    </select>
                </div>
                <div class="col-md-2">
                    <button type="submit" class="btn btn-dark">Filter</button>
                </div>
            </div>
        </form>

        {{-- Orders --}}
        @foreach($orders as $order)
            @php
                $user = $order->user;
                $address = $order->address;
                $statusClass = match($order->status) {
                    'pending' => 'warning',
                    'canceled' => 'danger',
                    'completed', 'shipped', 'delivered' => 'success',
                    default => 'secondary',
                };
            @endphp

            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <h5 class="fw-bold">Order #{{ $order->id }}</h5>
                            <p class="mb-1"><strong>Date:</strong> {{ $order->created_at->format('F j, Y \a\t g:i A') }}</p>
                            <p class="mb-1"><strong>User:</strong> {{ $user->name }} {{ $user->last_name ?? '' }}</p>
                            <p class="mb-1"><strong>Email:</strong> {{ $user->email }}</p>
                            <p class="mb-1"><strong>Phone:</strong> {{ $user->phone ?? '-' }}</p>
                            <p class="mb-1">
                                <strong>Address:</strong><br>
                                {{ $address->street_address ?? 'N/A' }},
                                {{ $address->city ?? 'N/A' }},
                                {{ $address->country ?? 'N/A' }}
                            </p>
                        </div>
                        <div>
                            <span class="badge bg-{{ $statusClass }} text-uppercase">
                                {{ $order->status }}
                            </span>
                        </div>
                    </div>

                    {{-- Status section on right side above items --}}
                    <div class="d-flex justify-content-end align-items-center flex-wrap mb-3">
                        <form action="{{ route('orders.updateStatus', $order->id) }}" method="POST" class="d-flex align-items-center gap-2">
                            @csrf
                            <select name="status" class="form-select form-select-sm w-auto">
                                <option value="pending" {{ $order->status === 'pending' ? 'selected' : '' }}>Pending</option>
                                <option value="shipped" {{ $order->status === 'shipped' ? 'selected' : '' }}>Shipped</option>
                                <option value="delivered" {{ $order->status === 'delivered' ? 'selected' : '' }}>Delivered</option>
                                <option value="canceled" {{ $order->status === 'canceled' ? 'selected' : '' }}>Canceled</option>
                            </select>
                            <button type="submit" class="btn btn-sm btn-outline-dark">Update</button>
                        </form>
                    </div>

                    <hr>

                    <div class="row">
                        <div class="col-md-8">
                            <h6 class="fw-bold mb-3">Items:</h6>
                            <ul class="list-group list-group-flush">
                                @foreach($order->items as $item)
                                    @php
                                        $product = $item->product;
                                        $image = $product->productImages->first();
                                        $variant = $product->variants->firstWhere('size', $item->size ?? null);
                                        $sizeLabel = $item->size ?? ($variant->size ?? 'N/A');
                                    @endphp

                                    <li class="list-group-item d-flex align-items-start gap-3">
                                        <div style="width: 70px; height: 70px;">
                                            @if($image)
                                                <img src="{{ asset('storage/' . $image->image_path) }}"
                                                     alt="{{ $product->name }}"
                                                     class="img-fluid rounded"
                                                     style="object-fit: cover; width: 100%; height: 100%;">
                                            @else
                                                <div class="bg-light d-flex justify-content-center align-items-center rounded" style="width: 70px; height: 70px;">
                                                    <small class="text-muted">No image</small>
                                                </div>
                                            @endif
                                        </div>

                                        <div class="flex-grow-1">
                                            <p class="mb-1 fw-semibold">{{ $product->name }}</p>

                                            <div class="mt-2">
                                                <div class="d-flex flex-column flex-md-row align-items-md-center gap-2">
                                                    @if($product->is_on_sale)
                                                        <div class="d-flex align-items-center gap-2">
                                                            <span class="fw-bold text-danger fs-6">
                                                                {{ number_format($item->productPriceQuantity, 2) }} Den
                                                            </span>
                                                            <span class="text-muted text-decoration-line-through">
                                                                {{ number_format($product->price * $item->quantity, 2) }} Den
                                                            </span>
                                                            <span class="badge rounded-pill bg-success px-2 py-1" style="font-size: 0.75rem;">
                                                                -{{ $product->sale_percentage }}%
                                                            </span>
                                                        </div>
                                                    @else
                                                        <span class="fw-bold text-dark fs-6">
                                                            {{ number_format($item->productPriceQuantity, 2) }} Den
                                                        </span>
                                                    @endif
                                                </div>

                                                <div class="text-muted small mt-1">
                                                    Size: {{ $sizeLabel }} &nbsp;|&nbsp;
                                                    Color: {{ ucfirst($product->color) }} &nbsp;|&nbsp;
                                                    Quantity: {{ $item->quantity }}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                @endforeach
                            </ul>
                        </div>

                        <div class="col-md-4 d-flex align-items-center justify-content-end">
                            <div class="text-end">
                                <h6 class="fw-semibold mb-2">Total Amount</h6>
                                <h4 class="fw-bold text-dark">{{ number_format($order->total_price, 2) }} Den</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
</div>
@endsection



