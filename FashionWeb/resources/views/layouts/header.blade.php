<header id="header" class="site-header fixed-top border-bottom p-3" style="font-family: 'Quattrocento', serif;">
  <div class="container-lg">
    <div class="row">
      <nav class="navbar navbar-expand-lg d-flex align-items-center">

        <!-- Mobile logo (left, order 1) -->
        <a href="{{ url('/') }}" class="navbar-brand d-flex d-lg-none align-items-center px-2 order-1" style="overflow: visible;">
          <img src="{{ asset('images/ariafashion.png') }}" alt="Aria Fashion Logo"
               style="height: 40px; transform: scale(2); transform-origin: left center; object-fit: contain;">
        </a>

        <!-- Grouped Cart & Wishlist icons wrapper (mobile, order 2) -->
        <div class="d-flex d-lg-none ms-auto order-2 order-lg-0 align-items-center gap-3">
          <!-- Cart icon -->
          <a href="#" class="position-relative d-inline-flex align-items-center text-dark"
             data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart" aria-controls="offcanvasCart">
            <div class="position-relative">
              <svg class="cart" width="24" height="24">
                <use xlink:href="#cart"></use>
              </svg>
              @if($cartCount > 0)
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style="font-size: 0.6rem; z-index: 1;">
                  {{ $cartCount }}
                </span>
              @endif
            </div>
          </a>

          <!-- Wishlist icon -->
          <a href="{{ route('wishlist.index') }}" class="position-relative d-inline-flex align-items-center text-dark"
             data-bs-toggle="offcanvas" data-bs-target="#offcanvasWishlist" aria-controls="offcanvasWishlist">
            <div class="position-relative">
              <svg width="24" height="24"><use xlink:href="#heart"></use></svg>
              @if($wishlistCount > 0)
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style="font-size: 0.6rem; z-index: 1;">
                  {{ $wishlistCount }}
                </span>
              @endif
            </div>
          </a>
        </div>

        <!-- Mobile toggle (burger menu) - on right, order 3 -->
        <button class="navbar-toggler d-flex d-lg-none order-3 p-2 border-0 shadow-none ms-3"
          type="button"
          data-bs-toggle="offcanvas" data-bs-target="#bdNavbar" aria-controls="bdNavbar" aria-expanded="false"
          aria-label="Toggle navigation">
          <svg class="navbar-icon svg-black" width="40" height="40">
            <use xlink:href="#navbar-icon"></use>
          </svg>
        </button>

        <!-- Desktop logo (only visible on large screens) -->
        <a href="{{ url('/') }}" class="navbar-brand d-none d-lg-flex align-items-center order-lg-1 px-3" style="overflow: visible;">
          <img src="{{ asset('images/ariafashion.png') }}" alt="Aria Fashion Logo"
               style="height: 50px; transform: scale(2); transform-origin: left center; object-fit: contain;">
        </a>

        <!-- Offcanvas content -->
        <div class="offcanvas offcanvas-end order-3" tabindex="-1" id="bdNavbar" aria-labelledby="bdNavbarOffcanvasLabel">
          <div class="offcanvas-body">
            <!-- Close button -->
            <div class="offcanvas-header px-0">
              <button type="button" class="btn-close btn-close-black" data-bs-dismiss="offcanvas" aria-label="Close"
                data-bs-target="#bdNavbar"></button>
            </div>

            <!-- Main menu -->
            <div class="navbar-collapse order-1 order-lg-1" id="navbarMenu">
              <ul class="navbar-nav ms-5">
                <li class="nav-item">
                  <a class="nav-link text-dark fs-5 me-4" href="{{ route('products.index') }}">Shop</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link text-dark fs-5 me-4" href="{{ route('orders.myOrders') }}">My Orders</a>
                </li>
                @role('admin')
                  <li class="nav-item">
                    <a class="nav-link text-dark fs-5 me-4" href="{{ route('orders.index') }}">Orders</a>
                  </li>
                @endrole

                @auth
                  <li class="nav-item">
                    <a class="nav-link text-dark fs-5 me-4" href="{{ route('profile.edit') }}">Profile</a>
                  </li>
                @endauth
              </ul>
            </div>

            <!-- User controls moved inside offcanvas menu for mobile ONLY -->
            <ul class="user-items list-unstyled d-flex flex-column gap-3 mt-4 d-lg-none">
              <li>
                <a href="#" class="position-relative d-inline-flex align-items-center text-dark"
                  data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart" aria-controls="offcanvasCart">
                  <div class="position-relative">
                    <svg class="cart" width="24" height="24">
                      <use xlink:href="#cart"></use>
                    </svg>
                    @if($cartCount > 0)
                      <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                            style="font-size: 0.6rem; z-index: 1;">
                        {{ $cartCount }}
                      </span>
                    @endif
                  </div>
                  <span class="ms-2">Cart</span>
                </a>
              </li>
              <li>
                <a href="{{ route('wishlist.index') }}" class="position-relative d-inline-flex align-items-center text-dark">
                  <div class="position-relative">
                    <svg width="24" height="24"><use xlink:href="#heart"></use></svg>
                    @if($wishlistCount > 0)
                      <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                            style="font-size: 0.6rem; z-index: 1;">
                        {{ $wishlistCount }}
                      </span>
                    @endif
                  </div>
                  <span class="ms-2">Wishlist</span>
                </a>
              </li>
            </ul>

            <!-- User controls for desktop (keep this hidden on mobile) -->
            <ul class="user-items list-unstyled d-none d-lg-flex justify-content-end align-items-center order-3 flex-grow-1 gap-5 m-0">
              <li>
                <a href="#" class="position-relative d-inline-flex align-items-center text-white"
                  data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart" aria-controls="offcanvasCart">
                  <div class="position-relative">
                    <svg class="cart svg-black" width="24" height="24">
                      <use xlink:href="#cart"></use>
                    </svg>

                    @if($cartCount > 0)
                      <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                            style="font-size: 0.6rem; z-index: 1;">
                        {{ $cartCount }}
                      </span>
                    @endif
                  </div>
                  <span class="ms-2" style="color: black;">Cart</span>
                </a>
              </li>

              <li>
                <a href="#" class="position-relative d-inline-flex align-items-center text-white"
                  data-bs-toggle="offcanvas" data-bs-target="#offcanvasWishlist" aria-controls="offcanvasWishlist">
                  <div class="position-relative">
                    <svg class="svg-black" width="24" height="24"><use xlink:href="#heart"></use></svg>

                    @if($wishlistCount > 0)
                      <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                            style="font-size: 0.6rem; z-index: 1;">
                        {{ $wishlistCount }}
                      </span>
                    @endif
                  </div>
                  <span class="ms-2" style="color: black;">Wishlist</span>
                </a>
              </li>
            </ul>

          </div> <!-- offcanvas-body -->
        </div> <!-- offcanvas -->

      </nav>
    </div>
  </div>
</header>
