<!-- Offcanvas Cart Updated -->
<div class="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1" id="offcanvasCart" aria-labelledby="My Cart">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title">Shopping Cart</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <div class="order-md-last">
      <h4 class="d-flex justify-content-between align-items-center mb-3">
        <span class="text-primary">Your Cart</span>
        <span class="badge bg-primary rounded-pill">{{ count($cartItems) }}</span>
      </h4>

      @if($cartItems->isEmpty())
        <p>Your cart is empty.</p>
      @else
        <ul class="list-group mb-3">
          @php $total = 0; @endphp
          @foreach($cartItems as $item)
            @php
              $product = $item->product;
              $unitPrice = $product->is_on_sale ? $product->getSalePrice() : $product->price;
              $itemTotal = $unitPrice * $item->quantity;
              $total += $itemTotal;
              $variant = $product->variants->firstWhere('size', $item->size);
              $maxStock = $variant ? $variant->stock : 1;
            @endphp
            <li class="list-group-item d-flex gap-3 align-items-center">
              {{-- Product Image --}}
              <div style="width: 80px; height: 100px;">
                @if($product->productImages->count())
                  <img src="{{ asset('storage/' . $product->productImages->first()->image_path) }}" 
                       alt="{{ $product->name }}" 
                       style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">
                @else
                  <div style="width: 100%; height: 100%; background-color: #eee; border-radius: 6px; display:flex; align-items:center; justify-content:center; color: #999;">
                    No Image
                  </div>
                @endif
              </div>

              {{-- Product Info --}}
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between">
                  <h6 class="mb-1 fw-bold">{{ $product->name ?? 'Unnamed Product' }}</h6>
                  {{-- Remove Button --}}
                  <form action="{{ route('cart.remove', $item->id) }}" method="POST">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-sm btn-link text-danger px-1 py-0">×</button>
                  </form>
                </div>

                {{-- Product Size --}}
                <small class="text-muted d-block mb-1">
                  <strong>Size:</strong> {{ $item->size }}
                </small>

                {{-- Product Description --}}
                <small class="text-muted d-block mb-1">
                  {{ $product->description ?? 'No description available' }}
                </small>

                {{-- Quantity Controls --}}
                <form action="{{ route('cart.update', $item->id) }}" method="POST" class="d-inline-flex align-items-center">
                  @csrf
                  @method('PATCH')
                  <div class="input-group input-group-sm" style="max-width: 120px;">
                    <button type="submit" name="quantity" value="{{ $item->quantity - 1 }}"
                            class="btn btn-outline-primary rounded-start"
                            {{ $item->quantity <= 1 ? 'disabled' : '' }}>
                      &minus;
                    </button>

                    <span class="input-group-text bg-white border border-primary text-dark" style="width: 40px; text-align: center;">
                      {{ $item->quantity }}
                    </span>

                    <button type="submit" name="quantity" value="{{ $item->quantity + 1 }}"
                            class="btn btn-outline-primary rounded-end"
                            {{ $item->quantity >= $maxStock ? 'disabled' : '' }}>
                      &#43;
                    </button>
                  </div>
                </form>

                @if($variant && $item->quantity >= $variant->stock)
                  <small class="text-danger d-block mt-1">Only {{ $variant->stock }} left in stock</small>
                @endif

                {{-- Price Display --}}
                <div class="mt-2">
                  @if($product->is_on_sale && $product->sale_percentage)
                    <small class="text-danger fw-bold">On Sale: -{{ $product->getDiscountPercentage() }}%</small><br>
                    <small class="text-muted text-decoration-line-through">{{ number_format($product->price, 2) }} Den</small>
                    <span class="text-success fw-bold">→ {{ number_format($product->getSalePrice(), 2) }} Den</span>
                  @else
                    <span class="fw-bold">{{ number_format($product->price, 2) }} Den</span>
                  @endif
                </div>
              </div>
            </li>
          @endforeach

          {{-- Totals --}}
          <li class="list-group-item d-flex justify-content-between">
            <span>Total Items:</span>
            <strong>{{ $cartItems->sum('quantity') }}</strong>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>Total Amount (Den):</span>
            <strong>{{ number_format($total, 2) }}</strong>
          </li>
        </ul>

        {{-- Checkout Button --}}
        <a href="{{ route('checkout.form') }}" class="btn btn-dark w-100 mt-3 fw-bold">
          Proceed to Checkout
        </a>
      @endif
    </div>
  </div>
</div>



