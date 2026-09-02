@extends('layouts.app')

@section('title', 'Home')

@section('content')


<body>
  <div class="preloader">
  <div class="loader">
    <div class="dot">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 2h12l-3 20H9L6 2z" />
        <line x1="6" y1="2" x2="18" y2="2" />
      </svg>
    </div>
    <div class="dot">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 2h12l-3 20H9L6 2z" />
        <line x1="6" y1="2" x2="18" y2="2" />
      </svg>
    </div>
    <div class="dot">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 2h12l-3 20H9L6 2z" />
        <line x1="6" y1="2" x2="18" y2="2" />
      </svg>
    </div>
  </div>
</div>

  <section id="intro" class="position-relative overflow-hidden"
    style="background-image: url(images/banner-image1.jpg); background-repeat: no-repeat; background-position: center; width: 100%; height: 100vh;">
    <div class="container-lg">
      <div class="row">
        <div class="col-lg-5 col-md-8">
          <div
            class="banner-content position-absolute d-flex justify-content-center align-items-center mx-auto text-center">
            <div class="banner-text-wrapper">
              <h1 class="display-1 text-white text-capitalize mb-2">
                Aria Fashion
              </h1>
              <p class="fs-5 text-white mb-4">
                Elevate your fashion game today
              </p>
              <a href="{{ route('products.index') }}" class="btn btn-lg btn-light">Shop Now</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

<section id="trending" class="py-lg-9">
  <div class="display-header text-center">
    <h2 class="display-6 m-0">New Collection</h2>
    <p>These are the items that are trending recently.</p>
  </div>
  <div class="product-content position-relative mt-5">
    <div class="container-lg">
      <div class="row">
        <div class="arrow-wrap">
          <div class="icon-caret-arrow left-side position-absolute d-flex align-items-center bg-gray-1 border rounded-pill justify-content-center">
            <svg class="caret-arrow-left" width="25" height="25">
              <use xlink:href="#caret-arrow-left"></use>
            </svg>
          </div>
          <div class="icon-caret-arrow right-side position-absolute d-flex align-items-center bg-gray-1 border rounded-pill justify-content-center">
            <svg class="caret-arrow-right" width="25" height="25">
              <use xlink:href="#caret-arrow-right"></use>
            </svg>
          </div>
        </div>
        <div class="swiper product-swiper">
          <div class="swiper-wrapper">
            @foreach($newCollectionProducts as $product)
              <div class="swiper-slide">
                <div class="product-item">
                  <div class="image-holder">
                      <a href="{{ route('products.show', $product->id) }}">

                    <img 
                      src="{{ asset('storage/' . optional($product->productImages->first())->image_path) }}" 
                      alt="{{ $product->name }}" 
                      class="product-image"
                    >
                    </a>
                  </div>
                  <div class="product-info text-center">
                    <h3 class="m-0">
                      <a href="{{ route('products.show', $product->id) }}" class="text-dark">{{ $product->name }}</a>
                    </h3>
                    <div class="product-price text-primary fw-medium">${{ $product->price }}</div>
                  </div>
                </div>
              </div>
            @endforeach
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="text-center mt-5">
    <a href="{{ route('products.index') }}" class="btn btn-lg btn-dark">Shop All</a>
  </div>
</section>




  <section id="collection" class="overflow-hidden">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-4 col-md-6 col-sm-12 mb-4 image-zoom-effect">
          <div class="collection-item position-relative mx-auto">
            <div class="image-holder">
              <img src="images/collection-item1.jpg" alt="product" class="img-fluid">
              <div class="product-info position-absolute d-flex justify-content-center align-items-center">
                <div class="border d-flex justify-content-center align-items-center text-center">
                  <div class="text-wrap">
                    <h3 class="m-0">
                      <a href="#" class="text-light">Learn Pottery</a>
                    </h3>
                    <div class="btn-wrap">
                      <a href="contact.html" class="btn btn-link text-light">Join Now</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-12 mb-4 image-zoom-effect">
          <div class="collection-item position-relative mx-auto">
            <div class="image-holder">
              <img src="images/collection-item2.jpg" alt="product" class="img-fluid">
            </div>
            <div class="product-info position-absolute d-flex justify-content-center align-items-center">
              <div class="border d-flex justify-content-center align-items-center text-center">
                <div class="text-wrap">
                  <h3 class="m-0">
                    <a href="#" class="text-light">Clay Pieces</a>
                  </h3>
                  <div class="btn-wrap">
                    <a href="shop.html" class="btn btn-link text-light">Shop Now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-12 mb-4 image-zoom-effect">
          <div class="collection-item position-relative mx-auto">
            <div class="image-holder">
              <img src="images/collection-item3.jpg" alt="product" class="img-fluid">
            </div>
            <div class="product-info position-absolute d-flex justify-content-center align-items-center">
              <div class="border d-flex justify-content-center align-items-center text-center">
                <div class="text-wrap">
                  <h3 class="m-0">
                    <a href="#" class="text-light">Ceramic Pieces</a>
                  </h3>
                  <div class="btn-wrap">
                    <a href="shop.html" class="btn btn-link text-light">Shop Now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="video-player" class="video overflow-hidden position-relative"
    style="background-image: url(images/video-item.jpg); background-repeat: no-repeat; background-position: center; background-attachment: fixed; width: 100%; height: 682px;">
    <div class="row">
      <div class="video-content">
        <div class="video-bg">
          <div
            class="player position-absolute top-50 start-50 translate-middle d-flex justify-content-center align-items-center">
            <a class='youtube play-btn d-flex justify-content-center align-items-center bg-white rounded-pill'
              href="https://www.youtube.com/embed/l4MOE3hZATA">
              <svg class="play text-dark" width="32" height="42">
                <use xlink:href="#play"></use>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="sale" class="py-lg-9">
  <div class="display-header text-center">
    <h2 class="display-6 m-0">On Sale</h2>
    <p>These are the items that are on sale recently.</p>
  </div>

  <div class="product-content position-relative mt-5">
    <div class="container-lg">
      <div class="row">

        <div class="arrow-wrap">
          <div class="icon-caret-arrow left-side position-absolute d-flex align-items-center bg-gray-1 border rounded-pill justify-content-center">
            <svg class="caret-arrow-left" width="25" height="25">
              <use xlink:href="#caret-arrow-left"></use>
            </svg>
          </div>
          <div class="icon-caret-arrow right-side position-absolute d-flex align-items-center bg-gray-1 border rounded-pill justify-content-center">
            <svg class="caret-arrow-right" width="25" height="25">
              <use xlink:href="#caret-arrow-right"></use>
            </svg>
          </div>
        </div>

        <div class="swiper product-swiper">
          <div class="swiper-wrapper">
            @foreach($saleProducts as $product)
              <div class="swiper-slide">
                <div class="product-item">
                  <div class="image-holder">
                    <a href="{{ route('products.show', $product->id) }}">
                      <img 
                        src="{{ asset('storage/' . optional($product->productImages->first())->image_path) }}" 
                        alt="{{ $product->name }}" 
                        class="product-image"
                      >
                    </a>
                  </div>
                  <div class="product-info text-center">
                    <h3 class="m-0">
                      <a href="{{ route('products.show', $product->id) }}" class="text-dark">{{ $product->name }}</a>
                    </h3>
                    <div class="product-price">
                      <span class="text-muted text-decoration-line-through">${{ $product->price }}</span>
                      <span class="text-success fw-bold me-2">${{ $product->getSalePrice() }}</span>
                    </div>
                    <div class="discount-percentage text-danger fw-medium">
                      -{{ $product->getDiscountPercentage() }}%
                    </div>
                  </div>
                </div>
              </div>
            @endforeach
          </div>
        </div>

      </div>
    </div>
  </div>

  <div class="text-center mt-5">
    <a href="{{ route('products.index') }}" class="btn btn-lg btn-dark">Shop All</a>
  </div>
</section>


  <section id="class" class="video overflow-hidden position-relative"
    style="background-image: url(images/blog-item.jpg); background-repeat: no-repeat; background-position: center; background-attachment: fixed; width: 100%; height: 682px;">
    <div class="row">
      <div
        class="post-content position-absolute top-50 start-50 translate-middle d-flex justify-content-center align-items-center">
        <div class="display-header text-center text-light">
          <h2 class="display-6   m-0 text-light mb-3">Learn Pottery with us</h2>
          <p>Join our pottery classes to know about the ceramics.</p>
          <a href="blog.html" class="btn btn-lg btn-light mt-3">Join Now</a>
        </div>
      </div>
    </div>
  </section>

  <section id="blog" class="py-lg-8">
    <div class="container-lg">
      <div class="display-header text-center">
        <h2 class="display-6 m-0">Latest Blog</h2>
        <p>Learn more about ceramics and pottery</p>
      </div>
      <div class="row align-items-center mt-5">
        <div class="col-lg-4 col-md-6">
          <div class="post-media mb-3">
            <img src="images/post-item1.jpg" alt="post" class="img-fluid">
            <div class="post-content">
              <h3 class="fs-4 my-4 mb-2 text-capitalize  ">
                <a href="single-post.html">Best way to learn pottery</a>
              </h3>
              <p>lorem ipsum dolor sit amet, elit consectetur adipiscing. Odio tincidunt et, massa, turpis nec dolor
                posuere tempus. Nulla congue et dolor sit amet, elit consectetur adipiscing.lorem ipsum dolor sit amet,
                elit consectetur adipiscing. <span><a href="single-post.html"
                    class="text-opacity-25 text-decoration-underline fst-italic">Read More</a></span> </p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="post-media mb-3">
            <img src="images/post-item3.jpg" alt="post" class="img-fluid">
            <div class="post-content">
              <h3 class="fs-4 my-4 mb-2 text-capitalize  ">
                <a href="single-post.html">How to manage the clay</a>
              </h3>
              <p>lorem ipsum dolor sit amet, elit consectetur adipiscing. Odio tincidunt et, massa, turpis nec dolor
                posuere tempus. Nulla congue et dolor sit amet, elit consectetur adipiscing.lorem ipsum dolor sit amet,
                elit consectetur adipiscing. <span><a href="single-post.html"
                    class="text-opacity-25 text-decoration-underline fst-italic">Read More</a></span> </p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="post-media mb-3">
            <img src="images/post-item4.jpg" alt="post" class="img-fluid">
            <div class="post-content">
              <h3 class="fs-4 my-4 mb-2 text-capitalize  ">
                <a href="single-post.html">Give some time for glazing</a>
              </h3>
              <p>lorem ipsum dolor sit amet, elit consectetur adipiscing. Odio tincidunt et, massa, turpis nec dolor
                posuere tempus. Nulla congue et dolor sit amet, elit consectetur adipiscing.lorem ipsum dolor sit amet,
                elit consectetur adipiscing. <span><a href="single-post.html"
                    class="text-opacity-25 text-decoration-underline fst-italic">Read More</a></span> </p>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-5">
        <a href="blog.html" class="btn btn-lg btn-dark">Read All</a>
      </div>
    </div>

  </section>

  <section id="company-services">
    <div class="container-lg">
      <div class="row">
        <div class="col-lg-4 col-md-6 mb-2">
          <div class="icon-box text-center border-top border-bottom py-3">
            <div class="icon-box-icon mb-1">
              <svg class="truck svg-primary" width="39" height="39">
                <use xlink:href="#truck"></use>
              </svg>
            </div>
            <div class="icon-box-content">
              <p class="fs-5">Inside City delivery within 3 days</p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6 mb-2">
          <div class="icon-box text-center border-top border-bottom py-3">
            <div class="icon-box-icon mb-1">
              <svg class="coffee svg-primary" width="39" height="39">
                <use xlink:href="#coffee"></use>
              </svg>
            </div>
            <div class="icon-box-content">
              <p class="fs-5">Free Samples with Every Order</p>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6 mb-2">
          <div class="icon-box text-center border-top border-bottom py-3">
            <div class="icon-box-icon mb-1">
              <svg class="luggage-cart svg-primary" width="39" height="39">
                <use xlink:href="#luggage-cart"></use>
              </svg>
            </div>
            <div class="icon-box-content">
              <p class="fs-5">Free Shipping on Orders Above $600</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="instagram-wrap" class="py-lg-8">
    <div class="container-lg">
      <div class="row">
        <h2 class="display-6 text-center  ">Shop Our Insta</h2>
        <div class="col-lg-2 col-md-6 mb-3">
          <div class="image-holder position-relative">
            <a href="https://www.instagram.com/ariaa.fashionn/p/DJrdEdvM3L_/" target="_blank">
              <img src="images\IMG-20250522-WA0018.jpg" alt="instagram" class="img-fluid">
              <div class="border insta-item position-absolute d-flex align-items-center justify-content-center">
                <svg class="insta svg-white" width="25" height="25">
                  <use xlink:href="#insta"></use>
                </svg>
              </div>
            </a>
          </div>
        </div>
        <div class="col-lg-2 col-md-6 mb-3">
          <div class="image-holder position-relative">
            <a href="https://www.instagram.com/ariaa.fashionn/p/DHegMZXMps9/" target="_blank">
              <img src="images\IMG-20250522-WA0003.jpg" alt="instagram" class="img-fluid">
              <div class="border insta-item position-absolute d-flex align-items-center justify-content-center">
                <svg class="insta svg-white" width="25" height="25">
                  <use xlink:href="#insta"></use>
                </svg>
              </div>
            </a>
          </div>
        </div>
        <div class="col-lg-2 col-md-6 mb-3">
          <div class="image-holder position-relative">
            <a href="https://www.instagram.com/ariaa.fashionn/p/DJQxqrCsFZT/" target="_blank">
              <img src="images\IMG-20250522-WA0009.jpg" alt="instagram" class="img-fluid">
              <div class="border insta-item position-absolute d-flex align-items-center justify-content-center">
                <svg class="insta svg-white" width="25" height="25">
                  <use xlink:href="#insta"></use>
                </svg>
              </div>
            </a>
          </div>
        </div>
        <div class="col-lg-2 col-md-6 mb-3">
          <div class="image-holder position-relative">
            <a href="https://www.instagram.com/ariaa.fashionn/p/DJkAlDPMZqN/" target="_blank">
              <img src="images\IMG-20250522-WA0015.jpg" alt="instagram" class="img-fluid">
              <div class="border insta-item position-absolute d-flex align-items-center justify-content-center">
                <svg class="insta svg-white" width="25" height="25">
                  <use xlink:href="#insta"></use>
                </svg>
              </div>
            </a>
          </div>
        </div>
        <div class="col-lg-2 col-md-6 mb-3">
          <div class="image-holder position-relative">
            <a href="https://www.instagram.com/ariaa.fashionn/p/DJTT-_ksaDq/" target="_blank">
              <img src="images\IMG-20250522-WA0008.jpg" alt="instagram" class="img-fluid">
              <div class="border insta-item position-absolute d-flex align-items-center justify-content-center">
                <svg class="insta svg-white" width="25" height="25">
                  <use xlink:href="#insta"></use>
                </svg>
              </div>
            </a>
          </div>
        </div>
        <div class="col-lg-2 col-md-6 mb-3">
          <div class="image-holder position-relative">
            <a href="https://www.instagram.com/ariaa.fashionn/p/DH_-NTKsAsb/" target="_blank">
              <img src="images\IMG-20250522-WA0005.jpg" alt="instagram" class="img-fluid">
              <div class="border insta-item position-absolute d-flex align-items-center justify-content-center">
                <svg class="insta svg-white" width="25" height="25">
                  <use xlink:href="#insta"></use>
                </svg>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>





  
</body>
@endsection



