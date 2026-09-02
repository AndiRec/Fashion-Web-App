 <nav>
        <div class="links">
            <a href="/">Home</a>
            <a href="/products">Products</a>
            <a href="/cart">Cart</a>
            <a href="/wishlist">Wishlist</a>
            <a href="/my-orders">My Orders</a>
        </div>

        <form method="POST" action="{{ route('logout') }}" class="logout-form">
            @csrf
            <button type="submit">Log Out</button>
        </form>
    </nav>