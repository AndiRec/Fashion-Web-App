
<!-- Offcanvas Wishlist -->
<div class="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1" id="offcanvasWishlist" aria-labelledby="offcanvasWishlistLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasWishlistLabel">Your Wishlist</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <div class="order-md-last">
      <h4 class="d-flex justify-content-between align-items-center mb-3">
        <span class="text-primary">Your Wishlist</span>
        <span class="badge bg-primary rounded-pill">{{ $wishlistCount }}</span>
      </h4>

      @if($wishlistCount == 0)
        <p>Your wishlist is empty.</p>
        <a href="{{ route('products.index') }}" class="btn btn-primary w-100 mt-3">Start Shopping</a>
      @else
        <ul class="list-group mb-3">
          @foreach($wishlist as $item)
            @php $product = $item->product; @endphp
            <li class="list-group-item">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <div style="max-width: 70%;">
                  <h6 class="my-0">{{ $product->name ?? 'Product not found' }}</h6>
                  <small class="text-muted">{{ $product->description ?? 'No description available' }}</small><br>
                  <small class="text-muted fw-semibold">${{ number_format($product->price, 2) }}</small>
                </div>
                @if($product->productImages && $product->productImages->count())
                  <img src="{{ asset('storage/' . $product->productImages->first()->image_path) }}"
                       alt="{{ $product->name }}"
                       style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;">
                @else
                  <div style="width: 60px; height: 60px; background-color: #eee; border-radius: 6px; display:flex; align-items:center; justify-content:center; color: #999; font-size: 0.75rem;">
                    No Image
                  </div>
                @endif
              </div>

              <form action="{{ route('wishlist.remove', $item->id) }}" method="POST"
                    onsubmit="return confirm('Remove from wishlist?')">
                @csrf
                @method('DELETE')
                <button type="submit" class="btn btn-sm btn-outline-danger w-100">Remove</button>
              </form>
            </li>
          @endforeach
        </ul>

        <a href="{{ route('wishlist.index') }}" class="w-100 btn btn-outline-dark btn-lg">Go to Full Wishlist</a>
      @endif
    </div>
  </div>
</div>
