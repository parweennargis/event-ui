(function ($) {
    "use strict";
    // back to top - start
    // --------------------------------------------------
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.backtotop:hidden').stop(true, true).fadeIn();
        } else {
            $('.backtotop').stop(true, true).fadeOut();
        }
    });
    $(function () {
        $(".scroll").click(function () {
            $("html,body").animate({
                scrollTop: $(".thetop").offset().top
            }, "slow");
            return false
        })
    });
    // back to top - end
    // --------------------------------------------------





    // preloader - start
    // --------------------------------------------------
    $(window).on('load', function () {
        verifyUser(function(isUser) {
            toggleCartLogin(isUser);
        });
        cart();
        $('#preloader').fadeOut('slow', function () { $(this).remove(); });
    });
    // preloader - end
    // --------------------------------------------------


    function toggleCartLogin(isUser) {
        if (isUser) {
            $('.login').hide();
            $('.signup').hide();
        } else {
            $('.cart').hide();
            $('.user').hide();
            localStorage.removeItem('token');
        }
    }


    // add to calendar - start
    // --------------------------------------------------
    addeventatc.settings({
        license: "replace-with-your-licensekey",
        css: true
    });
    // add to calendar - end
    // --------------------------------------------------





    // multy count down - start
    // --------------------------------------------------
    $('.countdown-list').each(function () {
        $('[data-countdown]').each(function () {
            var $this = $(this),
                finalDate = $(this).data('countdown');
            $this.countdown(finalDate, function (event) {
                var $this = $(this).html(event.strftime('' +
                    '<li class="timer-item days"><strong>%D</strong><small>days</small></li>' +
                    '<li class="timer-item hours"><strong>%H</strong><small>hours</small></li>' +
                    '<li class="timer-item mins"><strong>%M</strong><small>mins</small></li>' +
                    '<li class="timer-item seco"><strong>%S</strong><small>seco</small></li>'));
            });
        });

    });
    // multy count down - end
    // --------------------------------------------------





    // gallery popup - start
    // --------------------------------------------------
    $('.zoom-gallery').magnificPopup({
        type: 'image',
        closeBtnInside: false,
        delegate: '.popup-link',
        closeOnContentClick: false,
        mainClass: 'mfp-with-zoom mfp-img-mobile',
        gallery: {
            enabled: true
        },
        zoom: {
            enabled: true,
            duration: 300, // don't foget to change the duration also in CSS
            opener: function (element) {
                return element.find('img');
            }
        }
    });
    $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        preloader: true,
        mainClass: 'play-icon',
        fixedContentPos: true
    });

    // gallery popup - end
    // --------------------------------------------------


    // Lightcase Init
    if ($('a[data-rel^=lightcase]').length > 0) {
        $('a[data-rel^=lightcase]').lightcase({
            showCaption: false
        });
    }



    // altranative menu - start
    // --------------------------------------------------
    $(document).ready(function () {
        $("#sidebar").mCustomScrollbar({
            theme: "minimal"
        });

        $('#sidebar-dismiss, .overlay').on('click', function () {
            $('#sidebar').removeClass('active');
        });

        $('#sidebarCollapse').on('click', function () {
            $('#sidebar').addClass('active');
            $('.collapse.in').toggleClass('in');
            $('a[aria-expanded=true]').attr('aria-expanded', 'false');
        });
    });
    // altranative menu - end
    // --------------------------------------------------





    // search box - start
    // --------------------------------------------------
    $('.toggle-overlay').on('click', function () {
        $('.search-body').toggleClass('search-open');
    });
    // search box - end
    // --------------------------------------------------





    // parallax - start
    // --------------------------------------------------
    $('.jarallax').jarallax({
        speed: 0.3
    });
    // parallax - end
    // --------------------------------------------------





    // popup register & login modal - start
    // --------------------------------------------------
    $('.forgot-section').hide();
    $(function () {
        $('.login-modal-btn , .register-modal-btn').magnificPopup({
            modal: true,
            type: 'inline',
            preloader: false,
            focus: '#username'
        });
        $(document).on('click', '.popup-modal-dismiss', function (e) {
            e.preventDefault();
            $.magnificPopup.close();
        });

        $(document).on('click', '.register-modal-btn', function (e) {
            e.preventDefault();
            $('.login-section').show();
            $('.forgot-section').hide();
        });

        $(document).on('click', '.forgot a', function (e) {
            e.preventDefault();
            // $.magnificPopup.close();
            $('.login-section').hide();
            $('.forgot-section').show();
        });
    });
    // popup register & login modal - end
    // --------------------------------------------------





    // header-section - Start
    // --------------------------------------------------
    var mainHeader = $('.auto-hide-header'),
        secondaryNavigation = $('.cd-secondary-nav'),
        //this applies only if secondary nav is below intro section
        belowNavHeroContent = $('.sub-nav-hero'),
        headerHeight = mainHeader.height();

    //set scrolling variables
    var scrolling = false,
        previousTop = 0,
        currentTop = 0,
        scrollDelta = 10,
        scrollOffset = 150;

    $(window).on('scroll', function () {
        if (!scrolling) {
            scrolling = true;
            (!window.requestAnimationFrame) ?
                setTimeout(autoHideHeader, 250) : requestAnimationFrame(autoHideHeader);
        }
    });

    $(window).on('resize', function () {
        headerHeight = mainHeader.height();
    });

    function autoHideHeader() {
        var currentTop = $(window).scrollTop();

        (belowNavHeroContent.length > 0) ?
            checkStickyNavigation(currentTop) // secondary navigation below intro
            : checkSimpleNavigation(currentTop);

        previousTop = currentTop;
        scrolling = false;
    }

    function checkSimpleNavigation(currentTop) {
        //there's no secondary nav or secondary nav is below primary nav
        if (previousTop - currentTop > scrollDelta) {
            //if scrolling up...
            mainHeader.removeClass('is-hidden');
        } else if (currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
            //if scrolling down...
            mainHeader.addClass('is-hidden');
        }
    }

    function checkStickyNavigation(currentTop) {
        //secondary nav below intro section - sticky secondary nav
        var secondaryNavOffsetTop = belowNavHeroContent.offset().top - secondaryNavigation.height() - mainHeader.height();

        if (previousTop >= currentTop) {
            //if scrolling up... 
            if (currentTop < secondaryNavOffsetTop) {
                //secondary nav is not fixed
                mainHeader.removeClass('is-hidden');
                secondaryNavigation.removeClass('fixed slide-up');
                belowNavHeroContent.removeClass('secondary-nav-fixed');
            } else if (previousTop - currentTop > scrollDelta) {
                //secondary nav is fixed
                mainHeader.removeClass('is-hidden');
                secondaryNavigation.removeClass('slide-up').addClass('fixed');
                belowNavHeroContent.addClass('secondary-nav-fixed');
            }

        } else {
            //if scrolling down...  
            if (currentTop > secondaryNavOffsetTop + scrollOffset) {
                //hide primary nav
                mainHeader.addClass('is-hidden');
                secondaryNavigation.addClass('fixed slide-up');
                belowNavHeroContent.addClass('secondary-nav-fixed');
            } else if (currentTop > secondaryNavOffsetTop) {
                //once the secondary nav is fixed, do not hide primary nav if you haven't scrolled more than scrollOffset 
                mainHeader.removeClass('is-hidden');
                secondaryNavigation.addClass('fixed').removeClass('slide-up');
                belowNavHeroContent.addClass('secondary-nav-fixed');
            }

        }
    };
    // header-section - end
    // --------------------------------------------------





    // sticky menu - start
    // --------------------------------------------------
    var headerId = $(".sticky-header-section , .scrolltop-fixed-header-section");
    $(window).on('scroll', function () {
        var amountScrolled = $(window).scrollTop();
        if ($(this).scrollTop() > 250) {
            headerId.removeClass("not-stuck");
            headerId.addClass("stuck");
        } else {
            headerId.removeClass("stuck");
            headerId.addClass("not-stuck");
        }
    });
    // sticky menu - end
    // --------------------------------------------------





    // index-1 - main-carousel1 - start
    // --------------------------------------------------
    $('#main-carousel1').owlCarousel({
        items: 1,
        nav: true,
        margin: 0,
        loop: true,
        center: true,
        autoplay: true,
        smartSpeed: 1000,
        autoplayTimeout: 5000
    });
    var dot = $('#main-carousel1 .owl-dot');
    dot.each(function () {
        var index = $(this).index() + 1;
        if (index < 10) {
            $(this).html('0').append(index);
        } else {
            $(this).html(index);
        }
    });
    // index-1 - main-carousel1 - end
    // --------------------------------------------------





    // index-2 - main-carousel2 - start
    // --------------------------------------------------
    $('#main-carousel2').slick({
        speed: 500,
        fade: true,
        dots: false,
        arrows: true,
        autoplay: true,
        infinite: true,
        slidesToShow: 1,
        cssEase: 'linear',
        autoplaySpeed: 2000
    });
    // index-2 - main-carousel2 - end
    // --------------------------------------------------





    // upcomming-event-carousel - main-slider - start
    // --------------------------------------------------
    $('#upcomming-event-carousel').owlCarousel({
        items: 2,
        loop: true,
        margin: 30,
        nav: true,
        dots: false,
        center: true,
        autoplay: true,
        smartSpeed: 1000,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
                nav: false,
                dots: true,
            },
            360: {
                items: 1,
                nav: false,
                dots: true,
            },
            768: {
                items: 1,
            },
            991: {
                items: 1,
            },
            1199: {
                items: 2,
            }
        }
    });
    // upcomming-event-carousel - main-slider - end
    // --------------------------------------------------





    // event-expertise-carousel - start
    // --------------------------------------------------
    $('#event-expertise-carousel').owlCarousel({
        items: 3,
        loop: true,
        margin: 30,
        autoplay: true,
        smartSpeed: 1000,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
            },
            360: {
                items: 1,
            },
            768: {
                items: 2,
            },
            991: {
                items: 3,
            },
            1199: {
                items: 3,
            }
        }
    });
    // event-expertise-carousel - end
    // --------------------------------------------------





    // speaker section - carousel - start
    // --------------------------------------------------
    $(".slider-for").slick({
        fade: true,
        arrows: false,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: ".slider-nav"
    });
    $(".slider-nav").slick({
        dots: true,
        arrows: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        focusOnSelect: true,
        asNavFor: ".slider-for",
        responsive: [{
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                centerMode: true
            }
        }]
    });
    // speaker section - carousel - end
    // --------------------------------------------------





    // partners-carousel - start
    // --------------------------------------------------
    $('#partners-carousel').owlCarousel({
        nav: true,
        items: 1,
        loop: true,
        autoplay: true,
        smartSpeed: 1000,
        autoplayTimeout: 4000,
        autoplayHoverPause: true
    });
    // partners-carousel - end
    // --------------------------------------------------





    // partners-carousel - start
    // --------------------------------------------------
    $('#clients-testimonial-carousel').owlCarousel({
        items: 1,
        loop: true,
        margin: 30,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        animateIn: 'lightSpeedIn',
        dots: false
    });
    // partners-carousel - end
    // --------------------------------------------------





    // event-details-carousel - start
    // --------------------------------------------------
    $('#event-details-carousel').owlCarousel({
        nav: true,
        items: 1,
        loop: true,
        smartSpeed: 1000
    });
    // event-details-carousel - end
    // --------------------------------------------------





    // event-details-carousel - start
    // --------------------------------------------------
    $('#testimonial5-carousel').owlCarousel({
        items: 1,
        nav: true,
        loop: true,
        margin: 30,
        autoplay: true,
        smartSpeed: 1000,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        animateIn: 'lightSpeedIn'
    });
    // event-details-carousel - end
    // --------------------------------------------------





    // management-service-carousel --> home 4 - start
    // --------------------------------------------------
    $('#management-service-carousel').owlCarousel({
        items: 4,
        margin: 2,
        nav: false,
        loop: true,
        autoplay: true,
        smartSpeed: 500,
        autoplayTimeout: 2000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
            },
            360: {
                items: 1,
            },
            768: {
                items: 2,
            },
            991: {
                items: 3,
            },
            1199: {
                items: 4,
            }
        }
    });
    // management-service-carousel --> home 4 - end
    // --------------------------------------------------





    // gallery masonry - start
    // --------------------------------------------------
    // init Isotope
    var $grid = $(".grid").isotope({
        itemSelector: ".element-item",
        layoutMode: "fitRows"
    });
    // filter functions
    var filterFns = {
        // show if number is greater than 50
        numberGreaterThan50: function () {
            var number = $(this)
                .find(".number")
                .text();
            return parseInt(number, 10) > 50;
        },
        // show if name ends with -ium
        ium: function () {
            var name = $(this)
                .find(".name")
                .text();
            return name.match(/ium$/);
        }
    };
    // bind filter button click
    $(".filters-button-group").on("click", "button", function () {
        var filterValue = $(this).attr("data-filter");
        // use filterFn if matches value
        filterValue = filterFns[filterValue] || filterValue;
        $grid.isotope({ filter: filterValue });
    });
    // change is-checked class on buttons
    $(".button-group").each(function (i, buttonGroup) {
        var $buttonGroup = $(buttonGroup);
        $buttonGroup.on("click", "button", function () {
            $buttonGroup.find(".is-checked").removeClass("is-checked");
            $(this).addClass("is-checked");
        });
    });

    var $grid = $('.grid').isotope({
        percentPosition: true,
        itemSelector: '.grid-item',
        masonry: {
            columnWidth: '.grid-sizer'
        }
    });
    // layout Isotope after each image loads
    $grid.imagesLoaded().progress(function () {
        $grid.isotope('layout');
    });
    // gallery masonry - end
    // --------------------------------------------------





    // google map - start
    // --------------------------------------------------
    function isMobile() {
        return ('ontouchstart' in document.documentElement);
    }

    function init_gmap() {
        if (typeof google == 'undefined') return;
        var options = {
            zoom: 14,
            center: [40.725062, -74.0012177],
            styles: [
                { elementType: 'geometry', stylers: [{ color: '#e0dad2' }] },
                { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
                { elementType: 'labels.text.fill', stylers: [{ color: '#3f362b' }] },
                {
                    featureType: 'administrative.locality',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#383026' }]
                },
                {
                    featureType: 'poi',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#645644' }]
                },
                {
                    featureType: 'poi.park',
                    elementType: 'geometry',
                    stylers: [{ color: '#bbafa1' }]
                },
                {
                    featureType: 'poi.park',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#645644' }]
                },
                {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [{ color: '#d6cdc2' }]
                },
                {
                    featureType: 'road',
                    elementType: 'geometry.stroke',
                    stylers: [{ color: '#d6cdc2' }]
                },
                {
                    featureType: 'road',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#645644' }]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry',
                    stylers: [{ color: '#ffffff' }]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry.stroke',
                    stylers: [{ color: '#ffffff' }]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#3f362b' }]
                },
                {
                    featureType: 'transit',
                    elementType: 'geometry',
                    stylers: [{ color: '#eaeaea' }]
                },
                {
                    featureType: 'transit.station',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#d00000' }]
                },
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{ color: '#a3ccff' }]
                },
                {
                    featureType: 'water',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#515c6d' }]
                },
                {
                    featureType: 'water',
                    elementType: 'labels.text.stroke',
                    stylers: [{ color: '#17263c' }]
                }
            ],
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
            },
            navigationControl: true,
            scrollwheel: false,
            streetViewControl: true,
        }

        if (isMobile()) {
            options.draggable = false;
        }

        $('#google-map').gmap3({
            map: {
                options: options
            },
            marker: {
                latLng: [40.725062, -74.0012177],
                options: { icon: '' }
            }
        });
    }
    init_gmap();
    // google map - end
    // --------------------------------------------------

    //----------------------------------------------------
    //Custom Implementation

    var partners = [
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_112.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_122.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_87.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_17.jpg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/c_1.PNG",
        "https://www.thetruckingnetworkevents.ca/uploads/images/c_4.PNG",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_4.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_5.png ",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_9.png ",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_10.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_11.jpg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_13.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_14.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_18.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_19.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_20.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_21.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_22.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_25.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_26.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_30.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_33.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_35.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_36.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_38.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_39.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_40.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_41.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_46.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_47.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_48.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_49.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_52.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_53.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_54.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_55.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_56.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_58.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_60.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_1.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_2.png ",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_3.png ",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_37.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_6.png ",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_7.png ",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_15.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_16.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_24.jpg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_138.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_136.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_135.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_134.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_131.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_128.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_127.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_126.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_125.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_124.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_121.jpg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_120.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_119.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_118.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_116.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_115.jpg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_111.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_110.jpg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_107.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_106.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_105.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_104.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_101.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_100.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_99.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_98.jpg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_97.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_96.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_95.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_94.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_92.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_91.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_90.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_89.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_88.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_85.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_84.jpg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_83.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_82.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_81.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_79.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_78.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_74.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_73.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_72.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_70.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_67.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_65.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_64.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_62.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_44.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_188.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_189.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_12.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_114.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_86.jpeg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_103.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_112.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_122.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_87.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_17.jpg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/c_1.PNG",
        "https://www.thetruckingnetworkevents.ca/uploads/images/c_4.PNG",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_4.png ",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_5.png ",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_9.png ",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_10.png",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_11.jpg",
        "https://www.thetruckingnetworkevents.ca/uploads/images/client_13.png",
    ];
    var partnerHtml = '';
    partners.forEach(function (partner) {
        partnerHtml += "<div class='item' style='height: 10%'><a href='#!'><img  src='" + partner + "'/></a></div>";
    });

    $('#partner-carousel').html(partnerHtml);

    $('#partner-carousel').owlCarousel({
        items: 4,
        margin: 2,
        nav: false,
        loop: true,
        autoplay: true,
        smartSpeed: 500,
        autoplayTimeout: 2000,
        autoplayHoverPause: true,
        dots: false,
        autoHeight: true,
        height: 100,
        responsive: {
            0: {
                items: 1,
            },
            360: {
                items: 1,
            },
            768: {
                items: 2,
            },
            991: {
                items: 3,
            },
            1199: {
                items: 4,
            }
        }
    });

    // event-details-promotion-carousel - start
    // --------------------------------------------------
    $('#event-details-promotion-carousel').owlCarousel({
        nav: true,
        items: 1,
        loop: true,
        smartSpeed: 1000
    });
    // event-details-promotion-carousel - end
    // --------------------------------------------------

    $(document).on('click', '.page-item.next-item', function (e) {
        e.preventDefault();
        var currentPage = +($('.page-item.active').attr('data-page'));
        var maxPage = +($(this).children().attr('data-page'));
        var eventCategoryId = $('div.event-tab-menu').find('.active.show').attr('data-event');
        if (currentPage <= maxPage) {
            eventList(currentPage + 1, eventCategoryId, function (err, data) {
                if (err) {
                    return;
                }
                $('.page-item.active').removeClass('active').next().addClass('active');
            });
        }
    });

    $(document).on('click', '.page-item.prev-item', function (e) {
        e.preventDefault();
        var currentPage = +($('.page-item.active').attr('data-page'));
        var minPage = +($(this).children().attr('data-page'));
        var eventCategoryId = $('div.event-tab-menu').find('.active.show').attr('data-event');
        if (currentPage >= minPage) {
            eventList(currentPage - 1, eventCategoryId, function (err, data) {
                if (err) {
                    return;
                }
                $('.page-item.active').removeClass('active').prev().addClass('active');
            });

        }
    });

    $(document).on('click', '.page-item.curr-item', function (e) {
        e.preventDefault();
        var currentPage = +($(this).attr('data-page'));
        var eventCategoryId = $('div.event-tab-menu').find('.active.show').attr('data-event');
        eventList(currentPage, eventCategoryId, function (err, data) {
            if (err) {
                return;
            }
            $('.page-item.active').removeClass('active')
            $(this).addClass('active');
        });

    });

    function eventList(page, eventCategoryId, cb) {
        var data;
        $.ajax({
            url: '/events',
            method: 'GET',
            data: {
                'page': page,
                'eventCategoryId': eventCategoryId
            },
            success: function (result) {
                // console.log(result);
                var html = '<div class="row">';
                if (result && result.data) {
                    var items = result.data.items;
                    if (items.length) {
                        result.data.items.forEach((item) => {
                            if (item.ad) {
                                html += '<div class="col-lg-3 col-md-6 col-sm-12"><div class="event-item2 clearfix text-center no-shadow"><img src="assets/images/ad-img.jpg" alt="Image_not_found"></div></div>';
                            } else {
                                html += '<div class="col-lg-3 col-md-6 col-sm-12"><div class="event-item2 clearfix"><div class="event-image"><div class="post-date"><span class="date">' + item.startDay + '</span><small class="month">' + item.startMonth + '</small></div><a href="#" class="post-share"><img src="assets/images/share.png" alt="Share"></a><img src="assets/images/upcoming-img.jpg" alt="Image_not_found"></div><div class="event-content"><div class="event-title mb-15"><h3 class="title">' + item.title + '</h3><span class="ticket-price greycolor">' + item.short_description + '</span></div><div class="event-post-meta ul-li-block mb-15"><ul><li><span class="icon"><i class="far fa-clock"></i></span>' + item.start_time + 'to ' + item.end_time + '</li><li><span class="icon"><i class="fas fa-map-marker-alt"></i></span>' + item.venue.name + '</li></ul></div><div class="text-center"><a href="event/' + item._id + '" class="button-red">Event Details</a></div></div></div></div>';
                            }
                        })
                        html += '</div>';
                        $('#ttn-event').html(html);
                        data = result.data;
                        return cb(null, data);
                    } else {
                        html += '<p>No Event(s) Found';
                        $('#ttn-event').html(html);
                        data = result.data;
                        return cb(null, data);
                    }

                }
            },
            error: function (xhr, status, error) {
                console.log(error);
                return cb(error);
            }
        });
    }


    // form open
    $('.exhibitor').hide();
    $('.jobseekers').hide();
    $(document).on('click', '#jobForm', function (e) {
        e.preventDefault();
        $('.jobseekers').show();
        $('.exhibitor').hide();
        $("#jobseekers").prop("checked", true);
        $("#exhibitor").prop("checked", false);

    });
    $(document).on('click', '#exhibitorForm', function (e) {
        e.preventDefault();
        $('.exhibitor').show();
        $('.jobseekers').hide();
        $("#exhibitor").prop("checked", true);
        $("#jobseekers").prop("checked", false);
    });

    $(document).ready(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    $('#login-now').click(function (e) {
        e.preventDefault();
        var email = $('#login-email').val() || '';
        var password = $('#login-password').val() || '';
        // check validation
        var isError = false;
        var required = { password, email };
        for (const [key, value] of Object.entries(required)) {
            const newKey = 'login-' + key;
            if (value === '') {
                $(`#${newKey}`).focus();
                $(`#${newKey}`).addClass('border-red');
                isError = true;
            } else {
                $(`#${newKey}`).removeClass('border-red');
            }
        }
        if (isError) return;
        // process the form
        $.ajax({
            method: 'POST',
            url: '/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                'email': email,
                'password': password
            }),
            success: function (response) {
                console.log(response);
                if (response.data) {
                    localStorage.setItem('token', 'Bearer ' + response.data.token);
                    $('#register-modal-form').each(function() {
                        this.reset();
                    });
                    // $('#register-modal').modal('hide');
                    location.href = "/"
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr.status);
                console.log(xhr.responseJSON);
                $('#login-now-message').html(xhr.responseJSON.data.errors);
            }
        })
    });

    $('div.event-tab-menu ul li').on('click', function (e) {
        e.preventDefault();
        var previousTabId = $('div.event-tab-menu').find('.active.show').attr('data-event');
        var currentTabId = $(this).children().attr('data-event');
        if (previousTabId != currentTabId) {
            eventList(1, currentTabId, function (err, data) {
                var paginationHtml = refreshPagination(data);
                $('.event-pagination').html(paginationHtml);
            });
        }
    });

    function refreshPagination(data) {
        console.log(data);
        var html = '';
        if (data && data.noOfPages > 1) {
            html += '<div class="pagination ul-li clearfix"><ul><li class="page-item prev-item"><a class="page-link" href="#" data-page="1">Prev</a></li>';
            for (var i = 1; i <= data.noOfPages; i++) {
                html += '<li class="page-item curr-item';
                if (i == 1) html += ' active"';
                else html += '"';
                html += 'data-page="' + i + '"><a class="page-link" href="#">' + i + '</a></li>';
            }
            html += '<li class="page-item next-item"><a class="page-link" href="#" data-page="' + data.noOfPages + '">Next</a></li></ul></div>';
        }
        return html;
    }

    // Plan page slider

    $(document).ready(function () {
        $('.customer-logos').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 1500,
            arrows: true,
            dots: false,
            pauseOnHover: true,
            responsive: [{
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            }, {
                breakpoint: 520,
                settings: {
                    slidesToShow: 1
                }
            }]
        });
    });
    $(document).ready(function() {
        $('.otheruser').slick({
            slidesToShow: 5,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 1500,
            arrows: true,
            dots: false,
            pauseOnHover: true,
            responsive: [{
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            }, {
                breakpoint: 520,
                settings: {
                    slidesToShow: 1
                }
            }]
        });
    });

    // Plan page slider end
    $(".inputbutton").on("click", function () {

        var $button = $(this);
        var oldValue = $button.parent().find("input").val();

        if ($button.text() == "+") {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 1) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 1;
            }
        }

        $button.parent().find("input").val(newVal);
    });


    // fixed sub total section
    $(window).scroll(function fix_element() {

        if (window.matchMedia("(max-width: 767px)").matches) {
            $('#subtotal').css(
                $(window).scrollTop() > 500 ? { 'position': 'relative', 'top': 'auto' } : { 'position': 'relative', 'top': 'auto' }
            );
            return fix_element;
        } else {
            $('#subtotal').css(
                $(window).scrollTop() > 500 ? { 'position': 'fixed', 'top': '10px' } : { 'position': 'relative', 'top': 'auto' }
            );
            return fix_element;
        }

    }());

    $('#payment-form').hide();
    $("#payment").on("click", function() {
        $('#payment-form').toggle();


    });

    $('.add-to-cart').on('click', function(e) {
        e.preventDefault();
        verifyUser(function(isVerify){
            if (!isVerify) {
                $('#login-modal').modal("show");
                return;
            }

            var price = $(this).attr('data-price');
            var event = $(this).attr('data-event');
            var id = $(this).attr('data-id');
            var quantity = $('#quantity-' + id).val();

            // console.log($(this).attr('data-price'));
            // console.log($(this).attr('data-event'));
            // console.log($(this).attr('data-id'));
            // console.log($('#quantity-' + $(this).attr('data-id')).val());
            $.ajax({
                method: 'POST',
                url: '/cart',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    quantity,
                    eventId: event,
                    pricingId: price        
                }),
                success: function(response) {
                    console.log(response);
                    cart();
                },
                error: function(xhr, status, error) {
                    console.log(xhr.status);
                    console.log(xhr.responseJSON);
                }
            });
        });
    });

    function verifyUser(cb) {
        var token = localStorage.getItem('token');
        if(!token) {
            if (location.href === window.location.origin + window.location.pathname) {
                $('#absolute-eventmake-section').show();
            }
            return cb(false);
        }
        $.ajax({
            method: 'GET',
            url: '/verify',
            headers: {
                'Content-Type': 'application/json'
            },
            success: function(response) {
                console.log(response);
                if (location.href === window.location.origin + window.location.pathname) {
                    $('#absolute-eventmake-section').hide();
                }
                console.log(location.href);
                console.log(window.location);
                return cb(true);
            },
            error: function(xhr, status, error) {
                console.log(xhr.status);
                console.log(xhr.responseJSON);
                return cb(false);
            }
        });
    }

    $('.logout').on('click', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'GET',
            url: '/logout',
            success: function(response) {
                localStorage.clear();
                location.href = '/';
            },
            error: function(xhr, status, error) {
                localStorage.clear();
                location.href = '/';
            }
        });
    });

    $('.pay-now').on('click', function(e) {
        e.preventDefault();
        var data = {};
        var isChecked = $('#payment').is(':checked');
        data['isSameAsBilling'] = isChecked;
        // console.log('isChecked: ', isChecked);
        if (!isChecked) {
            var billingInfo = $('#payment-form').serializeArray();
            console.log(billingInfo);
            billingInfo.forEach(function(row) {
                data[row.name] = row.value;
            });
        }
        console.log(data);
        $.ajax({
            method: 'POST',
            url: '/payment',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function(response) {
                console.log(response);
            },
            error: function(xhr, status, error) {
                console.log(xhr.status);
                console.log(xhr.responseJSON);
            }
        });
    });

    $('.forgot-password').on('click', function(e) {
        e.preventDefault();
        var email = $('#forgot-password').val() || '';
        if (email.trim() === '') {
            // set focus on the fields, so that it can be edited
            $('#forgot-password').focus();
            $('#forgot-password').addClass('border-red');
            return;
        }
        
        $.ajax({
            method: 'POST',
            url: '/forgot-password',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ email }),
            success: function(response) {
                console.log(response);
                $('#reset-password-message').html('Email has been sent, Please check your inbox');
            },
            error: function(xhr, status, error) {
                console.log(xhr.status);
                console.log(xhr.responseJSON);
                $('#reset-password-message').html(xhr.responseJSON.data.errors);
            }
        });

    });

    $('.change-password').on('click', function(e) {
        e.preventDefault();
        var formArr = $('#change-password').serializeArray();
        var data = {};
        formArr.forEach(function(row) {
            data[row.name] = row.value;
        });
        var isError = false;
        for (const [key, value] of Object.entries(data)) {
            if (value === '') {
                $(`input[name=${key}]`).focus();
                $(`input[name=${key}]`).addClass('border-red');
                isError = true;
            }
        }
        if (isError) return;

        if (data['password'] !== data['confirm_password']) {
            $('#change-password-message').html('Password does not match');
            return;
        }
        var searchParams = new URLSearchParams(window.location.search)
        data['token'] = searchParams.get('token');
        $.ajax({
            method: 'POST',
            url: '/change-password',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function(response) {
                console.log(response);
                $('#change-password-message').html('Password has been changed successfully');
                location.href = '/';
            },
            error: function(xhr) {
                console.log(xhr.status);
                console.log(xhr.responseJSON);
                $('#change-password-message').html(xhr.responseJSON.data.errors);
            }
        });
    });

    function cart() {
        var token = localStorage.getItem('token');
        if(!token) return;
        $.ajax({
            method: 'GET',
            url: '/cart/count',
            headers: {
                'Content-Type': 'application/json'
            },
            success: function(response) {
                console.log(response);
                $('.cart-value').html(response.data);
            },
            error: function(xhr) {
                console.log(xhr.status);
                console.log(xhr.responseJSON);
            }
        });
    }

    $('.continueshopping').on('click', function(e) {
        e.preventDefault();
        if (history.length) history.back();
        else location.href = '/'; 
    });

    $('.remove').on('click', function(e) {
        e.preventDefault();
        var cartId = $(this).attr('data-id');
        if (!cartId) return;
        $.ajax({
            method: 'DELETE',
            url: '/cart/' + cartId,
            headers: {
                'Content-Type': 'application/json'
            },
            success: function(response) {
                console.log(response);
            },
            error: function(xhr) {
                console.log(xhr.status);
                console.log(xhr.responseJSON);
            }
        });
    });

    $('#profile-job-seeker').on('click', function(e) {
        e.preventDefault();
        var arr = $('#profile-update').serializeArray();
        var data = {};
        $(arr).each(function (index, obj) {
            data[obj.name] = obj.value;
        });
        $.ajax({
            method: 'PUT',
            url: '/profile',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function(response) {
                console.log(response);
            },
            error: function(xhr) {
                console.log(xhr.status);
                console.log(xhr.responseJSON);
            }
        });
    });

    $('.upload-resume').on('click', function(e) {
        e.preventDefault();
        const formData = new FormData();
        var files = $('#resume').get(0).files;
        var name = $('#resume').attr('data-name');
        if (files.length === 0) {
            $('#profile_message').html('Please upload file');
            return;
        }
        formData.append('name', name);
        $.each(files, function(key, value){
            formData.append('file', value);
          });    
         // process the form
         $.ajax({
            type: 'POST',
            url: '/upload',
            data: formData,
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            cache: false,
            success: function (data) {
                console.log(data);
                // redirect to event listing page
                // location.href = '/';
            },
            error: function (error) {
                console.log(error);
            }
        })
        
    });

    $('#interested-attend').on('click', function(e) {
        e.preventDefault();
        var eventId = $(this).attr('data-event');
        verifyUser(function(isVerify) {
            if(!isVerify) {
                $('#login-modal').modal('show');
                return;
            }
            //TODO: hit api to check if profile is complete and its jobseeker
        });
    })
})(jQuery);