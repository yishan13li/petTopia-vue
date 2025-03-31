import { onMounted } from 'vue'
;(function ($) {
  'use strict'

  var initPreloader = function () {
    // 確保 DOM 完全加載
    onMounted(() => {
      // 檢查當前路徑是否為子目錄
      var pathParts = window.location.pathname.split('/')
      if (pathParts.length <= 2) {
        // 使用 Vue 內的方式操作 DOM
        document.body.classList.add('preloader-site')
      }
    })

    // 監聽頁面加載完成事件
    onMounted(() => {
      // 檢查當前路徑是否為子目錄
      var pathParts = window.location.pathname.split('/')
      if (pathParts.length <= 2) {
        setTimeout(() => {
          // 假設這裡是你用來控制預加載器的邏輯
          document.querySelector('.preloader-wrapper').style.display = 'none'
          document.body.classList.remove('preloader-site')
        }, 100)
      }
    })

    // 監聽路由變化
    $(document).on('click', 'a[href]', function () {
      // 檢查目標路徑是否為子目錄
      var href = $(this).attr('href')
      if (href) {
        var targetPathParts = href.split('/')
        var currentPathParts = window.location.pathname.split('/')

        // 只在非子目錄跳轉時顯示預加載器
        if (
          targetPathParts.length <= 2 ||
          (targetPathParts.length > 2 &&
            currentPathParts.length > 2 &&
            targetPathParts[1] !== currentPathParts[1])
        ) {
          setTimeout(function () {
            $('.preloader-wrapper').fadeIn()
            $('body').addClass('preloader-site')
          }, 0)
        }
      }
    })
  }

  // init Chocolat light box
  var initChocolat = function () {
    Chocolat(document.querySelectorAll('.image-link'), {
      imageSize: 'contain',
      loop: true,
    })
  }

  var initSwiper = function () {
    var swiper = new Swiper('.main-swiper', {
      speed: 500,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    })

    var bestselling_swiper = new Swiper('.bestselling-swiper', {
      slidesPerView: 4,
      spaceBetween: 30,
      speed: 500,
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 3,
        },
        991: {
          slidesPerView: 4,
        },
      },
    })

    var testimonial_swiper = new Swiper('.testimonial-swiper', {
      slidesPerView: 1,
      speed: 500,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    })

    var products_swiper = new Swiper('.products-carousel', {
      slidesPerView: 4,
      spaceBetween: 30,
      speed: 500,
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 3,
        },
        991: {
          slidesPerView: 4,
        },
      },
    })
  }

  var initProductQty = function () {
    $('.product-qty').each(function () {
      var $el_product = $(this)
      var quantity = 0

      $el_product.find('.quantity-right-plus').click(function (e) {
        e.preventDefault()
        var quantity = parseInt($el_product.find('#quantity').val())
        $el_product.find('#quantity').val(quantity + 1)
      })

      $el_product.find('.quantity-left-minus').click(function (e) {
        e.preventDefault()
        var quantity = parseInt($el_product.find('#quantity').val())
        if (quantity > 0) {
          $el_product.find('#quantity').val(quantity - 1)
        }
      })
    })
  }

  // init jarallax parallax
  var initJarallax = function () {
    jarallax(document.querySelectorAll('.jarallax'))

    jarallax(document.querySelectorAll('.jarallax-keep-img'), {
      keepImg: true,
    })
  }

  // document ready
  $(document).ready(function () {
    initPreloader()
    initSwiper()
    initProductQty()
    initJarallax()
    initChocolat()

    // product single page
    var thumb_slider = new Swiper('.product-thumbnail-slider', {
      spaceBetween: 8,
      slidesPerView: 3,
      freeMode: true,
      watchSlidesProgress: true,
    })

    var large_slider = new Swiper('.product-large-slider', {
      spaceBetween: 10,
      slidesPerView: 1,
      effect: 'fade',
      thumbs: {
        swiper: thumb_slider,
      },
    })

    window.addEventListener('load', (event) => {
      //isotope
      $('.isotope-container').isotope({
        // options
        itemSelector: '.item',
        layoutMode: 'masonry',
      })

      var $grid = $('.entry-container').isotope({
        itemSelector: '.entry-item',
        layoutMode: 'masonry',
      })

      // Initialize Isotope
      var $container = $('.isotope-container').isotope({
        // options
        itemSelector: '.item',
        layoutMode: 'masonry',
      })

      $(document).ready(function () {
        //active button
        $('.filter-button').click(function () {
          $('.filter-button').removeClass('active')
          $(this).addClass('active')
        })
      })

      // Filter items on button click
      $('.filter-button').click(function () {
        var filterValue = $(this).attr('data-filter')
        if (filterValue === '*') {
          // Show all items
          $container.isotope({ filter: '*' })
        } else {
          // Show filtered items
          $container.isotope({ filter: filterValue })
        }
      })
    })
  }) // End of a document
})(jQuery)
