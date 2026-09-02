(function ($) {

  "use strict";

  $(document).ready(function () {
    // Header sticky
    const headerSticky = function () {
      const header = document.querySelector('#header');
      if (!header) return;
      const trigHeight = 1;

      window.addEventListener('scroll', function () {
        let tj = window.scrollY;

        if (tj > trigHeight) {
          header.classList.add('sticky');
          header.classList.remove('border-bottom');
        } else {
          header.classList.remove('sticky');
          header.classList.add('border-bottom');
        }
      });
    };

    $(".youtube").colorbox({
      iframe: true,
      innerWidth: 960,
      innerHeight: 585
    });

    // Document ready
    $(document).ready(function () {
      headerSticky();
      initSlider();
      initProductQty();
    });
  });

  var initSlider = function () {

    var swiper = new Swiper(".product-swiper", {
      slidesPerView: 'auto',
      spaceBetween: 8,  // Matches gap between slides
      navigation: {
        nextEl: '.icon-caret-arrow.right-side',
        prevEl: '.icon-caret-arrow.left-side',
      },
      freeMode: true,  // Enables smooth swipe snapping
      freeModeSticky: false,
      momentumRatio: 1,
      breakpoints: {
        0: {
          slidesPerView: 'auto',
          spaceBetween: 8,
        },
        580: {
          slidesPerView: 'auto',
          spaceBetween: 8,
        },
        800: {
          slidesPerView: 'auto',
          spaceBetween: 8,
        },
        1299: {
          slidesPerView: 'auto',
          spaceBetween: 8,
        },
      },
    });

    var reviewSwiper = new Swiper(".review-swiper", {
      spaceBetween: 30,
      navigation: {
        nextEl: '.icon-arrow.right-side',
        prevEl: '.icon-arrow.left-side',
      },
    });

  };

  // Window load
  $(window).on('load', function () {
    $(".preloader").fadeOut("slow");
  });

  // Product Quantity
  var initProductQty = function () {
    $('.product-qty').each(function () {

      var $el_product = $(this);

      $el_product.find('.quantity-right-plus').click(function (e) {
        e.preventDefault();
        var quantity = parseInt($el_product.find('#quantity').val());
        $el_product.find('#quantity').val(quantity + 1);
      });

      $el_product.find('.quantity-left-minus').click(function (e) {
        e.preventDefault();
        var quantity = parseInt($el_product.find('#quantity').val());
        if (quantity > 0) {
          $el_product.find('#quantity').val(quantity - 1);
        }
      });

    });
  };

})(jQuery);
