(function($) {
  $('document').ready(function(){

    window.bookFullpage = {};

    $('body').addClass('book-fullscreen');

    /* ---------------------------------------------------------------------- */
    // Slider functionality
    /* ---------------------------------------------------------------------- */

    function sliderFunctionality(){

      function signBoxResize(){
        var pageImgWidth = $('.swiper-slide').width();
        window.sliderWidth = pageImgWidth;
        var signLinkWidth = Math.ceil(pageImgWidth / 5);
        $('.sign-link').width(signLinkWidth);
        var signLinkPosition = Math.ceil(signLinkWidth / 10);
        $('.sign-link').css({ top: signLinkPosition, right: signLinkPosition});
      }

      window.bookFullpage.swiperSizeAdjustment = function(){

        var browserHeight = $(window).height();
        $('.wrapper').height(browserHeight);
        if(((browserHeight * 1.5) - ((browserHeight * 1.5) * .1)) > $(window).width()){
          var magicNum = .3;
        } else {
          var magicNum = .1;
        }

        $('.swiper-container').width((browserHeight * 1.5) - ((browserHeight * 1.5) * magicNum));
        $('.swiper-slide').width((browserHeight * 1.5) - ((browserHeight * 1.5) * magicNum));

        var sliderHeight = $('.swiper-slide .page-img').height();
        $('.swiper-container').height(sliderHeight);

        var sliderMarginTop = (browserHeight - sliderHeight) / 2;
        $('.book-section').css({'padding-top': sliderMarginTop});

        setTimeout(function(){
          signBoxResize();
        }, 1000);

      }
      window.bookFullpage.swiperSizeAdjustment();

      window.bookFullpage.swiperInit = function(){
        var mySwiperTemp = null;
        mySwiperTemp = new Swiper ('.swiper-container', {
          loop: true,
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev'
        });
        return mySwiperTemp;
      }
      window.bookFullpage.mySwiper = window.bookFullpage.swiperInit();

    }

    /* ---------------------------------------------------------------------- */
    // Sign pop-up functionality
    /* ---------------------------------------------------------------------- */

    function popUpFunctionality(){

      // init magnific popup
      $('.sign-link').magnificPopup({
        type:'inline',
        closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="fa fa-times" aria-hidden="true"></i></button>',
        callbacks: {
          open: function() {
            var popWidth = window.sliderWidth * .7;
            $('.white-popup-block').width(popWidth);
          }
        }
      });
      $(document).on('click', '.mfp-close', function (e) {
        e.preventDefault();
        $.magnificPopup.close();
      });

    }

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    if(windowHeight > windowWidth){
      $('.full-page-please-rotate').show();
      $('.book-section').hide();
    } else {
      $('.full-page-please-rotate').hide();
      $('.book-section').show();
    }
    $(window).on('resize', function(){
      if($(this).width() != windowWidth){
        windowWidth = $(this).width();
        windowHeight = $(this).height();
        if(windowHeight > windowWidth){
          $('.full-page-please-rotate').show();
          $('.book-section').hide();
        } else {
          $('.full-page-please-rotate').hide();
          $('.book-section').show();
          window.bookFullpage.swiperSizeAdjustment();
          window.bookFullpage.mySwiper.update();
        }
      }
    });

    /* ---------------------------------------------------------------------- */
    // Preloader
    /* ---------------------------------------------------------------------- */

    var preload;
    var progressText;
    var templateDirectoryURI = $('.template-directory-uri-value').attr('data-template-directory-uri');
    var bookName = $('.book-page').attr('data-book');
    var manifest = window.bookPreload.setupManifest(templateDirectoryURI, bookName);

    function startPreload() {
      preload = new createjs.LoadQueue(true);
      preload.on("fileload", handleFileLoad);
      preload.on("progress", handleFileProgress);
      preload.on("complete", loadComplete);
      preload.on("error", loadError);
      preload.loadManifest(manifest);
    }

    function handleFileLoad(event) {
      var html;
      var idArray = event.item.id.split('-');
      switch(idArray[1]){
        case 'page':
          if(idArray[0] == 'intro'){
            html = '<img src="'+templateDirectoryURI+'/imgs/books/intro.jpg" class="page-img img-responsive" />';
          } else {
            html = '<img src="'+templateDirectoryURI+'/imgs/books/'+bookName+'/'+idArray[0]+'.jpg" class="page-img img-responsive" />';
          }
          break;
        case 'sign':
          html = '<div id="'+idArray[0]+'-sign" class="mfp-hide white-popup-block"><img src="'+templateDirectoryURI+'/imgs/signs/'+idArray[0]+'.jpg" class="img-responsive" /></div>';
          break;

        case 'signbox':
          html = '<a href="#'+idArray[0]+'-sign" class="sign-link"><img src="'+templateDirectoryURI+'/imgs/books/sign-boxes/'+idArray[0]+'.jpg" class="img-responsive" /></a>';
          break;
      }
      $('.swiper-slide'+'.'+idArray[0]).append(html);
    }

    function loadError(evt) {
      // console.log("Error!", evt.text);
    }

    function handleFileProgress(event) {
      progressText = (preload.progress*100|0) + '%';
      // console.log(progressText);
      $('.book-section-loader span').html(progressText);
    }

    function loadComplete(event) {
      // console.log('load conplete');
      sliderFunctionality();
      popUpFunctionality();
      $('.book-section-loader').hide();
      $('.book-section .wrapper').removeClass('height-zero');
      $('.book-section .wrapper').css({
        'opacity': 1
      });
    }
    startPreload();

  });
})(jQuery);
