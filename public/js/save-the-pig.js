"use strict";

(function($){
  $(document).ready(function(){

    $('body').addClass('book-fullscreen');

    var imgMode = $('.img-mode').val();
    switch(imgMode) {
      case 'animated':
        var fileType = 'gif';
        break;
      case 'still':
        var fileType = 'png';
        break;
      case 'null':

        break;
      default:

    }
    console.log(imgMode);

    window.playerStats = {
      pointsPerHit: 500,
      playerScore: 0,
      scoreStreak: 0,
      highestStreak: 0,
      strikes: 0,
      strikesInfinite: true,
      durationIncrementor: .02,
      durationIncrementorThrottle: .09,
      durationMin: 1000, // min is the fastest speed
      durationMax: 5000,
      getPlayerScore: function(){
        return window.playerStats.pointsPerHit + (window.playerStats.scoreStreak * 100);
      }
    };

    window.gameDefaults = {
      playerScore: 0,
      scoreStreak: 0,
      highestStreak: 0,
      strikes: 0,
      strikesInfinite: true,
      durationIncrementor: .02,
      durationIncrementorThrottle: .09,
      durationMin: 1000, // min is the fastest speed
      durationMax: 5000,
      soundEffectSnort: true,
      soundEffectCheers: true,
      soundEffectNumbers: true,
      soundEffectFart: true,
      soundEffectSplash: true,
      soundEffectMusic: true,
      effects: {},
      music: {}
    },

    window.gameEngine = {

      defaults: {
        $template_uri: $('.template-directory-uri-value').attr('data-template-directory-uri'),
        $letterBoxDiv: $('.letter-box div'),
        $pigBox: $('.pig-box'),
        pigNum: null,
        currentLetter: null,
        gameOverStrikesChallenge: null
      },

      init: function(){
        this.resetScoreboard();
        this.setStrikesZone();
        this.setSpeed();
        this.nextLetterBegin();
      },

      resetScoreboard: function(){
        $('.player-score .score').html(0);
        $('.player-streak .streak').html(0);
      },

      setStrikesZone: function(){
        window.playerStats.strikes = window.gamePresets.strikes;
        if(window.playerStats.strikes >= 1 && window.playerStats.strikes <= 5){
          window.playerStats.strikesInfinite = false;
          // show water barrel strike board
          $('.water-barrel-ad .ad').addClass('hidden');
          $('.water-barrel-ad .strikes').removeClass('hidden');
          var i = window.playerStats.strikes;
          while( i > 0 ){
            var strikeEl = '<span class="strike" data-strike="'+i+'">X</span>';
            $('.water-barrel-ad .strikes').append(strikeEl);
            $('.strike-popup .pig-clean-strikes').append(strikeEl);
            i--;
          }
        } else if (window.playerStats.strikes == 0) {
          window.playerStats.strikesInfinite = true;
          // show water barrel ad
          $('.water-barrel-ad .strikes').addClass('hidden');
          $('.water-barrel-ad .ad').removeClass('hidden');
        }
      },

      addStrike: function(){
        $('.water-barrel-ad .strikes span[data-strike='+window.playerStats.strikes+']').addClass('active');
        $('.strike-popup .pig-clean-strikes span[data-strike='+window.playerStats.strikes+']').addClass('active');
        window.playerStats.strikes = window.playerStats.strikes - 1;
      },

      setSpeed: function(){
        //console.log(window.gamePresets.speed);
        switch(window.gamePresets.speed){
          case '0':
            window.playerStats.durationMin = 5000;
            break;
          case '1':
            window.playerStats.durationMin = 4500;
            break;
          case '2':
            window.playerStats.durationMin = 4000;
            break;
          case '3':
            window.playerStats.durationMin = 3500;
            break;
          case '4':
            window.playerStats.durationMin = 3000;
            break;
          case '5':
            window.playerStats.durationMin = 2500;
            break;
          case '6':
            window.playerStats.durationMin = 2000;
            break;
          case '7':
            window.playerStats.durationMin = 1500;
            break;
          case '8':
            window.playerStats.durationMin = 1000;
            break;
          case '9':
            window.playerStats.durationMin = 500;
            break;
          case '10':
            window.playerStats.durationMin = 0;
            break;
        }
      },

      nextLetterBegin: function(){
        var letter = this.getLetter();
        var pig = this.getPig();
        switch(window.gamePresets.mode) {
          case 'sign':
            this.defaults.$letterBoxDiv.addClass(letter);
            break;
          case 'character':
            //console.log(letter);
            this.defaults.$letterBoxDiv.html(letter);
            break;
        }
        this.resetPigBoxPosition(this.defaults.$pigBox);
        this.bindKeyboard(letter);
        this.defaults.$pigBox.velocity('fadeIn', 'slow', function(){
          window.gameEngine.pigBoxMove(window.gameEngine.defaults.$pigBox);
        });
      },

      bindKeyboard: function(letter){
        $('body').unbind('keydown').bind('keydown', function(e){

          if(e.keyCode == 32) {
            e.preventDefault();
          }
          var letterPressed = String.fromCharCode(e.which);
          $('.keys-row span[data-key="'+letterPressed.toLowerCase()+'"]').addClass('active');

          if(letterPressed.toLowerCase() === letter.toLowerCase()){

            $('body').unbind('keydown');
            if(window.gameDefaults.soundEffectCheers){
              window.gameDefaults.effects.applause.play();
            }
            if(window.gameDefaults.soundEffectSnort){
              window.gameDefaults.effects.snort.play();
            }

            // player stats
            window.playerStats.durationIncrementor = window.playerStats.durationIncrementor + (window.playerStats.durationIncrementor * window.playerStats.durationIncrementorThrottle);
            //console.log(window.playerStats.durationIncrementor);

            if(window.playerStats.durationMin < window.playerStats.durationMax) {
              window.playerStats.durationMax = window.playerStats.durationMax - (window.playerStats.durationMax * window.playerStats.durationIncrementor);
            }
            //console.log(window.playerStats.durationMax);

            ++window.playerStats.scoreStreak;
            //console.log(window.playerStats.scoreStreak);

            window.playerStats.playerScore = window.playerStats.playerScore + window.playerStats.getPlayerScore();
            //console.log(window.playerStats.playerScore);
            $('.player-score .score').html(window.playerStats.playerScore);
            $('.player-streak .streak').html(window.playerStats.scoreStreak);

            // next block
            window.gameEngine.defaults.$pigBox.velocity('stop');
            window.gameEngine.defaults.$pigBox.velocity('fadeOut', 'slow', function(){
              switch(window.gamePresets.mode) {
                case 'sign':
                  window.gameEngine.defaults.$letterBoxDiv.removeClass(letter);
                  break;
                case 'character':
                  window.gameEngine.defaults.$letterBoxDiv.html('');
                  break;
              }
              window.gameEngine.defaults.$letterBoxDiv.removeClass();
              window.gameEngine.nextLetterBegin();
            });

          } else {
            if(window.gameDefaults.soundEffectFart){ window.gameDefaults.effects.fart.play(); }
          }

        }).bind('keyup', function(e) {
          $('.keys-row span').removeClass('active');
        });

      },

      shuffleLetterArray: function(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
      },

      getLetter: function(){
        // http://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
        var lettersArray = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
            lettersArrayShuffled = this.shuffleLetterArray(lettersArray),
            lettersArrayTemp = [],
            lettersArrayTemp = lettersArrayShuffled;
        var randomNumber = Math.floor(Math.random() * (lettersArrayTemp.length - 1)) + 0;
        var currentLetter = lettersArrayTemp[randomNumber]
        window.gameEngine.defaults.currentLetter = currentLetter;
        return currentLetter;
      },

      getPig: function(){
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
        var pigNum = Math.floor(Math.random() * (5 - 1)) + 1;
        window.gameEngine.defaults.pigNum = pigNum;
        var imageUrl = window.gameEngine.defaults.$template_uri + '/imgs/games/save-the-pig/pig-'+pigNum+'-'+imgMode+'.'+fileType;
        //console.log(imageUrl);
        $('.pig-box').css('background-image', 'url(' + imageUrl + ')');
      },

      resetPigBoxPosition: function($pigBox){
        $pigBox.hide().css({
          'left': 0
        });
      },

      pigBoxMove: function($pigBox){
        var velocityPigTrackLength;
        var windowWidth = $(window).width();
        if(windowWidth >= 1300){
          velocityPigTrackLength = '750px';
        } else {
          velocityPigTrackLength = '550px';
        }
        $pigBox.velocity({
          left: velocityPigTrackLength
        }, {
          duration: window.playerStats.durationMax,
          easing: 'linear',
          complete: function() {

            // player stats
            if(window.gameDefaults.soundEffectSplash){
              window.gameDefaults.effects.yahoo.play();
              window.gameDefaults.effects.bigWave.play();
            }
            window.playerStats.durationIncrementor = .02;
            window.playerStats.durationIncrementorThrottle = .09;
            window.playerStats.durationMax = window.playerStats.durationMax + (window.playerStats.durationMax / 2);
            window.gameEngine.setThankPopupValues();
            window.playerStats.scoreStreak = 0;
            $('.player-streak .streak').html('0');
            window.gameEngine.addStrike();
            if(window.playerStats.strikes <= 0 && window.playerStats.strikesInfinite == false){
              $('.stop-game').trigger('click');
              return false;
            }
            // next block
            window.gameEngine.defaults.$pigBox.velocity('stop');
            $('body').unbind('keydown').unbind('keyup');
            window.gameEngine.defaults.$pigBox.hide();
            switch(window.gamePresets.mode) {
              case 'sign':
                window.gameEngine.defaults.$letterBoxDiv.removeClass();
                break;
              case 'character':
                window.gameEngine.defaults.$letterBoxDiv.html('');
                break;
            }
            var pigCleanImage = window.gameEngine.defaults.$template_uri+'/imgs/games/save-the-pig/pig-clean-'+window.gameEngine.defaults.pigNum+'-'+imgMode+'.'+fileType;
            $('.pig-clean-image').css({
              'background-image': 'url(' + pigCleanImage + ')'
            });
            $('.pig-clean-show-answer .sign-letter div').removeClass();
            $('.pig-clean-show-answer .character-letter').html('');
            $('.pig-clean-show-answer .sign-letter div').addClass(window.gameEngine.defaults.currentLetter);
            $('.pig-clean-show-answer .character-letter').html(window.gameEngine.defaults.currentLetter);
            $('.strike-popup-open').trigger('click');
            setTimeout(function(){
              $('.strike-popup .mfp-close').trigger('click');
            }, 5000);
          }
        });
      },

      gameStop: function(){
        var $pigBox = this.defaults.$pigBox;
        $pigBox.velocity("stop");
        window.gameEngine.setThankPopupValues();
        $pigBox.velocity('fadeOut', 'slow', function(){
          $('.water-barrel-ad .strikes span').remove();
          $('.strike-popup .pig-clean-strikes span').remove();
          $('.water-barrel-ad .strikes').addClass('hidden');
          $('.water-barrel-ad .ad').removeClass('hidden');
          window.gameEngine.resetGameDefaults();
          switch(window.gamePresets.mode) {
            case 'sign':
              window.gameEngine.defaults.$letterBoxDiv.removeClass();
              break;
            case 'character':
              window.gameEngine.defaults.$letterBoxDiv.html('');
              break;
          }
        });
        $('body').unbind('keydown');
        $('.game-finished-popup-open').trigger('click');
      },

      setThankPopupValues: function(){
        if(window.playerStats.highestStreak < window.playerStats.scoreStreak){
          window.playerStats.highestStreak = window.playerStats.scoreStreak;
        }
        $('.game-finished-popup-left-score span').html(window.playerStats.playerScore);
        $('.game-finished-popup-left-streak span').html(window.playerStats.highestStreak);

        $('.game-finished-popup .challenge-settings .challenge-settings-speed').html('');
        $('.game-finished-popup .challenge-settings .challenge-settings-strikes').html('');

        $('.game-finished-popup .challenge-settings .challenge-settings-speed, .game-finished-popup .challenge-settings .challenge-settings-strikes').css('background-image', 'url(' + window.gameDefaults.effects.spinningNumbers + ')');

        if(window.gameDefaults.soundEffectNumbers){
          window.gameDefaults.effects.spinningNumbersSound.play();
        }

        setTimeout(function(){
          //window.gameDefaults.effects.spinningNumbersSound.pause();
          $('.game-finished-popup .challenge-settings .challenge-settings-speed, .game-finished-popup .challenge-settings .challenge-settings-strikes').css('background-image', 'none');
          if(window.gamePresets.speed < 10) {
            var speedIncrease = parseInt(window.gamePresets.speed) + 1;
            $('.game-finished-popup .challenge-settings .challenge-settings-speed').html(speedIncrease);
          } else {
            $('.game-finished-popup .challenge-settings .challenge-settings-speed').html('10');
          }
          var randomeNum5 = Math.floor(Math.random() * 5) + 1;
          window.gameEngine.gameOverStrikesChallenge = randomeNum5;
          $('.game-finished-popup .challenge-settings .challenge-settings-strikes').html(randomeNum5);
        }, 2000);

        //http://www.facebook.com/sharer/sharer.php?u=http://www.reliantfunding.com/blog/the-holy-grail-of-success-lies-in-a-great-sales-team
      },

      resetGameDefaults: function(){
        window.playerStats.playerScore = window.gameDefaults.playerScore;
        window.playerStats.scoreStreak = window.gameDefaults.scoreStreak;
        window.playerStats.highestStreak = window.gameDefaults.highestStreak;
        window.playerStats.strikes = window.gameDefaults.strikes;
        window.playerStats.strikesInfinite = window.gameDefaults.strikesInfinite;
        window.playerStats.durationIncrementor = window.gameDefaults.durationIncrementor;
        window.playerStats.durationIncrementorThrottle = window.gameDefaults.durationIncrementorThrottle;
        window.playerStats.durationMin = window.gameDefaults.durationMin;
        window.playerStats.durationMax = window.gameDefaults.durationMax;
      }

    };

    window.gamePresets = {
      mode: 'sign',
      speed: 5,
      strikes: 0
    };

    $('.mode a').unbind('click').bind('click', function(e){
      e.preventDefault();
      $('.mode a').removeClass('active');
      $(this).addClass('active');
      window.gamePresets.mode = $(this).attr('data-mode');
      switch (window.gamePresets.mode) {
        case 'sign':
          $('.letter-box').removeClass('character');
          $('.letter-box').addClass('sign');
          break;
        case 'character':
          $('.letter-box').removeClass('sign');
          $('.letter-box').addClass('character');
          break;
      }
    });

    $('.speed').unbind('change').bind('change', function(){
      var $this = $(this);
      var inputVal = Math.floor($this.val());
      //console.log(inputVal);
      $this.val(inputVal);
      //console.log($this.val().length);
      if($this.val().length == 0){
        $this.val(0);
      }
      if (inputVal < 0 || inputVal > 10){
        if ($this.val() < 0) {
          $this.val(0);
        }
        if ($this.val() > 10) {
          $this.val(10);
        }
      }
      var speed = $(this).val();
      window.gamePresets.speed = speed;
      //console.log(window.gamePresets.speed);
    });

    $('.strikes').unbind('change').bind('change', function(){
      var $this = $(this);
      var inputVal = Math.floor($this.val());
      $this.val(inputVal);
      if($this.val().length == 0){
        $this.val(0);
      }
      if (inputVal < 0 || inputVal > 5){
        if ($this.val() < 0) {
          $this.val(0);
        }
        if ($this.val() > 5) {
          $this.val(5);
        }
      }
      var strikes = $(this).val();
      window.gamePresets.strikes = strikes;
    });

    window.gameControlsDisable = function(){
      $('.mode a').addClass('disable-links');
      $('.speed, .strikes').prop('disabled', true);
    }

    window.gameControlsEnable = function(){
      $('.mode a').removeClass('disable-links');
      $('.speed, .strikes').prop('disabled', false);
    }
    window.gameControlsEnable();

    $('.sound-control-toggle').on('click', function(e){
      e.preventDefault();
      $('.sound-control-panel').show();
    });
    $('.sound-control-panel-close').on('click', function(e){
      e.preventDefault();
      $('.sound-control-panel').hide();
    });
    $('.sound-music-effect').on('click', function(e){
      e.preventDefault();
      var $this = $(this);
      var soundMusic = $this.attr('data-sound-music');
      var volume = $this.attr('data-volume');
      var soundEffectObj = 'soundEffect'+soundMusic;
      switch(volume){
        case 'on':
          $this.removeClass('volume-on');
          $this.addClass('volume-off');
          $this.attr('data-volume', 'off');
          $this.find('i').removeClass('fa-volume-up');
          $this.find('i').addClass('fa-volume-down');
          window.gameDefaults[soundEffectObj] = false;
          if(soundMusic == 'Music'){
            window.gameDefaults.music.song01.pause();
          }
          break;
        case 'off':
          $this.removeClass('volume-off');
          $this.addClass('volume-on');
          $this.attr('data-volume', 'on');
          $this.find('i').removeClass('fa-volume-down');
          $this.find('i').addClass('fa-volume-up');
          window.gameDefaults[soundEffectObj] = true;
          if(soundMusic == 'Music'){
            window.gameDefaults.music.song01.play();
          }
          break;
      }
    });

    $('.start-game').on('click', function(e){
      e.preventDefault();
      window.gameControlsDisable();
      $('.controls button').removeClass('active');
      $(this).addClass('active');
      window.gameEngine.init();
    });

    $('.stop-game').on('click', function(e){
      e.preventDefault();
      window.gameControlsEnable();
      if(!$(this).hasClass('active')){
        $('.controls button').removeClass('active');
        $(this).addClass('active');
        window.gameEngine.gameStop();
      }
    });

    $('.strike-popup-open').magnificPopup({
      type: 'inline',
      preloader: false,
      closeOnBgClick: false,
      showCloseBtn: false
    });
    $('.strike-popup-open').magnificPopup({
      callbacks: {
        close: function() {
          window.gameEngine.nextLetterBegin();
        }
      }
    });
    // $(document).on('click', '.mfp-close', function (e) {
    //   e.preventDefault();
    //   $.magnificPopup.close();
    // });
    $('.game-finished-popup-open').magnificPopup({
      type: 'inline',
      preloader: false,
      closeOnBgClick: false,
      showCloseBtn: false
    });
    $(document).on('click', '.game-finished-popup .play-again', function (e) {
      e.preventDefault();
      $.magnificPopup.close();
    });
    $(document).on('click', '.game-finished-popup .challenge-accept', function (e) {
      e.preventDefault();
      var challengeSpeed = parseInt($('.challenge-settings-speed').html());
      var challengeStrikes = parseInt($('.challenge-settings-strikes').html());
      window.gamePresets.speed = challengeSpeed;
      window.gamePresets.strikes = challengeStrikes;
      $('.game-control-board .inputs .speed').val(challengeSpeed);
      $('.game-control-board .inputs .strikes').val(challengeStrikes);
      $.magnificPopup.close();
    });

    if(imgMode){

      console.log('imgMode ', imgMode);

      $('.mode-select').hide();
      if(imgMode == 'still'){
        $('.stage-preload img').hide();
      }

      var manifest;
      var preload;
      var progressText;
      var templateDirectoryURI = $('.template-directory-uri-value').attr('data-template-directory-uri');

      function setupManifest() {
        manifest = [
          {
            src:  templateDirectoryURI + "/imgs/games/save-the-pig/bigboard.png",
            id: "bigboard"
          },
          {
            src:  templateDirectoryURI + "/imgs/games/save-the-pig/ice-table.png",
            id: "ice-table"
          },
          {
            src:  templateDirectoryURI + "/imgs/games/save-the-pig/keyboard-backboard.png",
            id: "keyboard-backboard"
          },
          {
            src:  templateDirectoryURI + "/imgs/games/save-the-pig/kid-dog-announcer-"+imgMode+"."+fileType,
            id: "kid-dog-announcer"
          },
          {
            src:  templateDirectoryURI + "/imgs/games/save-the-pig/mode-characters.jpg",
            id: "mode-characters"
          },
          {
            src:  templateDirectoryURI + "/imgs/games/save-the-pig/mode-signs.jpg",
            id: "mode-signs"
          },
          {
            src:  templateDirectoryURI + "/imgs/games/save-the-pig/pig-1-"+imgMode+"."+fileType,
            id: "pig-1"
          },
          {
            src:  templateDirectoryURI + "/imgs/games/save-the-pig/pig-2-"+imgMode+"."+fileType,
            id: "pig-2"
          },
          {
            src:  templateDirectoryURI + "/imgs/games/save-the-pig/pig-3-"+imgMode+"."+fileType,
            id: "pig-3"
          },
          {
            src:  templateDirectoryURI + "/imgs/games/save-the-pig/pig-4-"+imgMode+"."+fileType,
            id: "pig-4"
          },
          {
            src:  templateDirectoryURI + "/imgs/games/save-the-pig/pig-clean-1-"+imgMode+"."+fileType,
            id: "pig-clean-1"
          },
          {
            src:  templateDirectoryURI + "/imgs/games/save-the-pig/pig-clean-2-"+imgMode+"."+fileType,
            id: "pig-clean-2"
          },
          {
            src:  templateDirectoryURI + "/imgs/games/save-the-pig/pig-clean-3-"+imgMode+"."+fileType,
            id: "pig-clean-3"
          },
          {
            src:  templateDirectoryURI + "/imgs/games/save-the-pig/pig-clean-4-"+imgMode+"."+fileType,
            id: "pig-clean-4"
          },
          {
            src:  templateDirectoryURI + "/imgs/games/save-the-pig/rat-skunk-"+imgMode+"."+fileType,
            id: "rat-skunk"
          },
          {
            src:  templateDirectoryURI + "/imgs/games/save-the-pig/spinning-numbers-"+imgMode+"."+fileType,
            id: "spinning-numbers"
          },
          {
            src:  templateDirectoryURI + "/imgs/games/save-the-pig/save-the-pig-sign-"+imgMode+"."+fileType,
            id: "save-the-pig-sign"
          },
          {
            src:  templateDirectoryURI + "/imgs/games/save-the-pig/background-"+imgMode+"."+fileType,
            id: "background"
          },
          {
            src:  templateDirectoryURI + "/imgs/games/save-the-pig/signs.png",
            id: "signs"
          },
          {
            src:  templateDirectoryURI + "/imgs/games/save-the-pig/zimmy-barrel-ad.png",
            id: "zimmy-barrel-ad"
          },
          {
            src:  templateDirectoryURI + "/imgs/games/save-the-pig/zimmy-barrel-"+imgMode+"."+fileType,
            id: "zimmy-barrel-animated"
          },
          {
            src:  templateDirectoryURI + "/audio/effects/save-the-pig/big-wave.mp3",
            id: "big-wave"
          },
          {
            src:  templateDirectoryURI + "/audio/effects/save-the-pig/fart.mp3",
            id: "fart"
          },
          {
            src:  templateDirectoryURI + "/audio/effects/save-the-pig/snort.mp3",
            id: "snort"
          },
          {
            src:  templateDirectoryURI + "/audio/effects/save-the-pig/yahoo.mp3",
            id: "yahoo"
          },
          {
            src:  templateDirectoryURI + "/audio/effects/save-the-pig/applause.mp3",
            id: "applause"
          },
          {
            src:  templateDirectoryURI + "/audio/music/save-the-pig/1.mp3",
            id: "music"
          },
          {
            src:  templateDirectoryURI + "/audio/effects/save-the-pig/spinning-numbers.mp3",
            id: "spinning-numbers-sound"
          }
        ];
      }

      function startPreload() {
        preload = new createjs.LoadQueue(true);
        preload.installPlugin(createjs.Sound);
        preload.on("fileload", handleFileLoad);
        preload.on("progress", handleFileProgress);
        preload.on("complete", loadComplete);
        preload.on("error", loadError);
        preload.loadManifest(manifest);
      }

      function handleFileLoad(event) {
        switch(event.item.id){
          case 'background':
            $('.stage').css('background-image', 'url(' + event.item.src + ')');
            break;
          case 'bigboard':
            $('.game-head-board').css('background-image', 'url(' + event.item.src + ')');
            break;
          case 'save-the-pig-sign':
            $('.game-logo-sign').css('background-image', 'url(' + event.item.src + ')');
            break;
          case 'ice-table':
            $('.hidden-track').css('background-image', 'url(' + event.item.src + ')');
            break;
          case 'mode-characters':
            $('.mode .character').css('background-image', 'url(' + event.item.src + ')');
            break;
          case 'mode-signs':
            $('.mode .sign').css('background-image', 'url(' + event.item.src + ')');
            break;
          case 'kid-dog-announcer':
            $('.kid-dog-announcer').css('background-image', 'url(' + event.item.src + ')');
            break;
          case 'signs':
            $('.letter-box.sign div').css('background-image', 'url(' + event.item.src + ')');
            $('.pig-clean-show-answer .sign-letter div').css('background-image', 'url(' + event.item.src + ')');
            break;
          case 'keyboard-backboard':
            $('.keyboard-wrapper').css('background-image', 'url(' + event.item.src + ')');
            break;
          case 'rat-skunk':
            $('.rat-skunk').css('background-image', 'url(' + event.item.src + ')');
            break;
          case 'spinning-numbers':
            window.gameDefaults.effects.spinningNumbers = event.item.src;
            break;
          case 'zimmy-barrel-ad':
            $('.water-barrel-ad').css('background-image', 'url(' + event.item.src + ')');
            break;
          case 'zimmy-barrel-animated':
            $('.water-barrel-wrapper').css('background-image', 'url(' + event.item.src + ')');
            break;
          case 'big-wave':
            window.gameDefaults.effects.bigWave = new Audio(event.item.src);
            break;
          case 'fart':
            window.gameDefaults.effects.fart = new Audio(event.item.src);
            break;
          case 'snort':
            window.gameDefaults.effects.snort = new Audio(event.item.src);
            break;
          case 'music':
            window.gameDefaults.music.song01 = new Audio(event.item.src);
            break;
          case 'applause':
            window.gameDefaults.effects.applause = new Audio(event.item.src);
            break;
          case 'yahoo':
            window.gameDefaults.effects.yahoo = new Audio(event.item.src);
            break;
          case 'spinning-numbers-sound':
            window.gameDefaults.effects.spinningNumbersSound = new Audio(event.item.src);
            break;
        }
      }

      function loadError(evt) {
        console.log("Error!", evt.text);
      }

      function handleFileProgress(event) {
        progressText = (preload.progress*100|0) + '%';
        $('.stage-preload span').html(progressText);
      }

      function loadComplete(event) {
        var windowWidth = $(window).width(),
            stageHeight;
        if(windowWidth >= 1024){
          stageHeight = '471px';
        }
        if(windowWidth >= 1300){
          stageHeight = '600px';
        }
        $('.stage-preload').hide();
        $('.stage').css({
          opacity: 1,
          height: stageHeight
        });
        if(window.gameDefaults.soundEffectMusic){
          window.gameDefaults.music.song01.loop = true;
          window.gameDefaults.music.song01.play();
        }
        if(window.gameDefaults.soundEffectCheers){ window.gameDefaults.effects.applause.play(); }
      }

      setupManifest();
      startPreload();

    } else {
      $('.stage-preload').hide();
      $('.mode-select').show();
    }

  });
})(jQuery);
