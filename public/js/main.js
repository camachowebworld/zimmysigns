"use strict";

var templateDirectoryURI = $('.template-directory-uri-value').attr('data-template-directory-uri');

/***********************************************************************************
 * Sitewide functionality
 ***********************************************************************************/
 (function($) {
  $('document').ready(function(){
    $('.header-hamburger-toggle').on('click', function(e){
      e.preventDefault();
      $('.header-menu-wrapper').slideToggle('slow');
    });
  });
 })(jQuery);

(function($) {
  $('document').ready(function(){
    $(window).scroll(function() {
      if ($(this).scrollTop()) {
        $('.back-to-top').fadeIn();
      } else {
        $('.back-to-top').fadeOut();
      }
    });
    $('.back-to-top a').on('click', function(e){
      e.preventDefault();
      $('body').velocity('scroll', {
        duration: 2000,
        easing: 'easeInBack'
      });
    });
  });
})(jQuery);

(function($) {
  $('.fullscreen-nav-btn').on('click', function(e){
    e.preventDefault();
    var dataMenuOption = $(this).attr('data-menu-option');
    $('.'+dataMenuOption).show();
    $('.'+dataMenuOption+' .close').on('click', function(e){
      e.preventDefault();
      $('.'+dataMenuOption).hide();
    });
  });
})(jQuery);
