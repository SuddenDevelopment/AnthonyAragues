/************skillbar**********/
'use script';
jQuery(window).on('scroll', function(){
  var winT = jQuery(window).scrollTop(),
      winH = jQuery(window).height(),
      skillsDiv = jQuery('#skills'),
      skillbar = jQuery('.skillbar'),
      skillsT = skillsDiv.offset().top;
  if(winT + winH  > skillsT){
    skillbar.each(function(){
      jQuery(this).find('.skillbar-bar').animate({
        width:jQuery(this).attr('data-percent')
      },6000);
    });
  }
});

/***************mixitup*********************/
'use script';
jQuery(function () {
  var portfolioList = jQuery('#portfoliolist');
  filterList = {
    init: function () {
      // MixItUp plugin
      // http://mixitup.io
      portfolioList.mixItUp({
        selectors: {
          target: '.portfolio',
          filter: '.filter' 
        },
        load: {
          filter: '.gd, .wd, .brand, .htmlf'  
        }     
      });               
    }
  };
  filterList.init();
}); 

/****************scroll to top*****************/
'use script';
var toTop = jQuery('.to_top');
toTop.on("click", function(){
 jQuery("html, body").animate({ scrollTop: 0 }, 600);
 return false;
});

/***************** Smooth scroll ****************/
'use script';
var aHref = jQuery('a[href*="#"]:not([href="#"])');
aHref.on("click", function() {
  if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
    var target = jQuery(this.hash);
    target = target.length ? target : jQuery('[name=' + this.hash.slice(1) + ']');
    if (target.length) {
      jQuery('html, body').animate({
        scrollTop: target.offset().top
      }, 1000);
      return false;
    }
  }
});

/*************************Swiper carousel**********************/
'use script';
if(jQuery(window).width() >= 992){
  var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',

    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    slidesPerView: 3,
    slidesPerColumn: 2,
    paginationClickable: true
  });
}
if(jQuery(window).width() < 992){
  var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',

    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    slidesPerView: 2,
    slidesPerColumn: 2,
    paginationClickable: true
  });
}
if(jQuery(window).width() <= 500){
  var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',

    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    slidesPerView: 1,
    slidesPerColumn: 2,
    paginationClickable: true
  });
}

/************on scroll menu bg color************/
'use script';
var header = jQuery(".header");
jQuery(window).on("scroll", function() {  

    var scroll = jQuery(window).scrollTop();

    if (scroll >= 10) {
        header.addClass("scrolling");
    } else {
        header.removeClass("scrolling");
    }
});

/**************equal height for divs************/
'use script';
equalheight = function(container){
  var currentTallest = 0,
      currentRowStart = 0,
      rowDivs = new Array(),
      $el,
      topPosition = 0;
  $(container).each(function() {
    $el = $(this);
    $($el).height('auto')
    topPostion = $el.position().top;

    if (currentRowStart != topPostion) {
      for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
        rowDivs[currentDiv].height(currentTallest);
      }
      rowDivs.length = 0; // empty the array
      currentRowStart = topPostion;
      currentTallest = $el.height();
      rowDivs.push($el);
    } 
    else {
      rowDivs.push($el);
      currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
    }
    for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
      rowDivs[currentDiv].height(currentTallest);
    }
  });
}
$(window).on("load", function() {
  equalheight('.works div');
});
$(window).on("resize", function() {
  equalheight('.works div');
});


/*******active menu********/
'use script';
// Cache selectors
var lastId,
    topMenu = $(".menu"),
    topMenuHeight = topMenu.outerHeight()+15,
    // All list items
    menuItems = topMenu.find("a"),
    // Anchors corresponding to menu items
    scrollItems = menuItems.map(function(){
      var item = $($(this).attr("href"));
      if (item.length) { return item; }
    });

// Bind click handler to menu items
// so we can get a fancy scroll animation
menuItems.on("click", function(e) {
  var href = $(this).attr("href"),
      offsetTop = href === "#" ? 0 : $(href).offset().top-topMenuHeight+1;
  $('html, body').stop().animate({ 
      scrollTop: offsetTop
  }, 300);
  e.preventDefault();
});

// Bind to scroll
$(window).on("scroll", function() {
    // Get container scroll position
    var fromTop = $(this).scrollTop()+topMenuHeight,   
    // Get id of current scroll item
        cur = scrollItems.map(function(){
          if ($(this).offset().top < fromTop)
            return this;
        });
   // Get the id of the current element
   cur = cur[cur.length-1];
   var id = cur && cur.length ? cur[0].id : "";
   
   if (lastId !== id) {
       lastId = id;
       // Set/remove active class
       menuItems
         .parent().removeClass("active")
         .end().filter("[href='#"+id+"']").parent().addClass("active");
   }                   
});