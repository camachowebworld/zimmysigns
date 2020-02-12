// Cross-site form front-end validation
(function($){
  $(document).ready(function($) {

    function AntheadDigitalFormValidation(obj){

      this.wrappingFormClass = obj.wrappingFormClass;
      this.formName = obj.formName;
      this.requiredFields = obj.requiredFields;
      this.validationResults = {};
      var formValues = {};

      this.init = function() {
        // Sets validation results to false on initialization
        var validationResults = this.validationResults;
        $.each( this.requiredFields, function( wrappingInputClass, inputType ) {
          validationResults[wrappingInputClass] = false;
        });
      };
      this.init();

      this.textValidation = function(wrappingFormClass, wrappingInputClass, validationResults){
        var inputValue = $('.'+wrappingFormClass+' .'+wrappingInputClass+' input').val();
        switch (wrappingInputClass) {
          case 'rf-company':
            // var pattern = /^((?!(19|20)\d\d)(?!\s*$|\s)[a-zA-Z0-9#&'\+\-_\.\s]{5,}.*)$/;
            // if(inputValue == '' || !pattern.test(inputValue)){
            var isnum = /^\d+$/.test(inputValue);
            if(isnum || inputValue == ''){
              $('.'+wrappingFormClass+' .'+wrappingInputClass).addClass('error');
              validationResults[wrappingInputClass] = false;
              return false;
            } else {
              formValues.company = inputValue;
            }
            break;
          default:
            if(inputValue == ''){
              $('.'+wrappingFormClass+' .'+wrappingInputClass).addClass('error');
              validationResults[wrappingInputClass] = false;
              return false;
            } else {
              if(wrappingInputClass == 'rf-first-name' || wrappingInputClass == 'rf-full-name' || wrappingInputClass == 'gf_name'){
                formValues.firstName = inputValue;
              }
              if(wrappingInputClass == 'rf-last-name'){
                formValues.lastName = inputValue;
              }
            }
            break;
        }
        $('.'+wrappingFormClass+' .'+wrappingInputClass).removeClass('error');
        validationResults[wrappingInputClass] = true;
        return true;
      };

      this.emailValidation = function(wrappingFormClass, wrappingInputClass, validationResults){
        var inputValue = $('.'+wrappingFormClass+' .'+wrappingInputClass+' input').val();
        var emailRegex = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i;
        if (!emailRegex.test(inputValue)) {
          $('.'+wrappingFormClass+' .'+wrappingInputClass).addClass('error');
          validationResults[wrappingInputClass] = false;
          return false;
        }
        formValues.email = inputValue;
        $('.'+wrappingFormClass+' .'+wrappingInputClass).removeClass('error');
        validationResults[wrappingInputClass] = true;
        return true;
      };

      this.phoneValidation = function(wrappingFormClass, wrappingInputClass, validationResults){
        setTimeout(function(){
          var inputValue = $('.'+wrappingFormClass+' .'+wrappingInputClass+' input').val();
          if(inputValue == ''){
            $('.'+wrappingFormClass+' .'+wrappingInputClass).addClass('error');
            validationResults[wrappingInputClass] = false;
            return false;
          }
          formValues.phone = inputValue;
          $('.'+wrappingFormClass+' .'+wrappingInputClass).removeClass('error');
          validationResults[wrappingInputClass] = true;
          return true;
        }, 100);
      };

      this.selectValidation = function(wrappingFormClass, wrappingInputClass, validationResults){
        var inputValue = $('.'+wrappingFormClass+' .'+wrappingInputClass+' select').val();
        if(inputValue == ''){
          $('.'+wrappingFormClass+' .'+wrappingInputClass).addClass('error');
          validationResults[wrappingInputClass] = false;
          return false;
        }
        formValues.inquireType = inputValue;
        $('.'+wrappingFormClass+' .'+wrappingInputClass).removeClass('error');
        validationResults[wrappingInputClass] = true;
        return true;
      };

      this.textareaValidation = function(wrappingFormClass, wrappingInputClass, validationResults){
        var inputValue = $('.'+wrappingFormClass+' .'+wrappingInputClass+' textarea').val();
        if(inputValue == ''){
          $('.'+wrappingFormClass+' .'+wrappingInputClass).addClass('error');
          validationResults[wrappingInputClass] = false;
          return false;
        }
        formValues.comment = inputValue;
        $('.'+wrappingFormClass+' .'+wrappingInputClass).removeClass('error');
        validationResults[wrappingInputClass] = true;
        return true;
      };

      this.radioValidation = function(wrappingFormClass, wrappingInputClass, validationResults){
        var inputValue = $('.'+wrappingFormClass+' .'+wrappingInputClass+' input[name=radioName]:checked').val();
        if(inputValue == ''){
          $('.'+wrappingFormClass+' .'+wrappingInputClass).addClass('error');
          validationResults[wrappingInputClass] = false;
          return false;
        }
        $('.'+wrappingFormClass+' .'+wrappingInputClass).removeClass('error');
        validationResults[wrappingInputClass] = true;
        return true;
      };

      this.fileuploadValidation = function(wrappingFormClass, wrappingInputClass, validationResults){
        var inputValue = $('.'+wrappingFormClass+' .'+wrappingInputClass+' input[name=file]').val();
        if(inputValue == ''){
          $('.'+wrappingFormClass+' .'+wrappingInputClass).addClass('error');
          validationResults[wrappingInputClass] = false;
          return false;
        }
        $('.'+wrappingFormClass+' .'+wrappingInputClass).removeClass('error');
        validationResults[wrappingInputClass] = true;
        return true;
      };

      this.zipcodeValidation = function(wrappingFormClass, wrappingInputClass, validationResults){
        var inputValue = $('.'+wrappingFormClass+' .'+wrappingInputClass+' input').val();
        if(inputValue.length != 5){
          $('.'+wrappingFormClass+' .'+wrappingInputClass).addClass('error');
          validationResults[wrappingInputClass] = false;
          return false;
        }
        $('.'+wrappingFormClass+' .'+wrappingInputClass).removeClass('error');
        validationResults[wrappingInputClass] = true;
        return true;
      };

      this.watchValidation = function(){

        // Get class validation methods and wrapping class property value
        var wrappingFormClass = this.wrappingFormClass,
            formName = this.formName,
            validationResults = this.validationResults,
            textValidation = this.textValidation,
            emailValidation = this.emailValidation,
            phoneValidation = this.phoneValidation,
            selectValidation = this.selectValidation,
            textareaValidation = this.textareaValidation,
            radioValidation = this.radioValidation,
            fileuploadValidation = this.fileuploadValidation,
            zipcodeValidation = this.zipcodeValidation;

        // Field validation
        $.each( this.requiredFields, function( wrappingInputClass, inputType ) {
          switch(inputType){
            case 'text':
              $('.'+wrappingFormClass+' .'+wrappingInputClass+' input').on('change keyup blur', function() {
                textValidation(wrappingFormClass, wrappingInputClass, validationResults);
              });
              break;
            case 'email':
              $('.'+wrappingFormClass+' .'+wrappingInputClass+' input').on('change keyup blur', function() {
                emailValidation(wrappingFormClass, wrappingInputClass, validationResults);
              });
              break;
            case 'phone':
              $('.'+wrappingFormClass+' .'+wrappingInputClass+' input').on('change keyup blur', function() {
                phoneValidation(wrappingFormClass, wrappingInputClass, validationResults);
              });
              break;
            case 'select':
              $('.'+wrappingFormClass+' .'+wrappingInputClass+' select').on('change blur', function() {
                selectValidation(wrappingFormClass, wrappingInputClass, validationResults);
              });
              break;
            case 'radio':
              $('.'+wrappingFormClass+' .'+wrappingInputClass+' input[type=radio]').on('change blur', function() {
                radioValidation(wrappingFormClass, wrappingInputClass, validationResults);
              });
              break;
            case 'textarea':
              $('.'+wrappingFormClass+' .'+wrappingInputClass+' textarea').on('change keyup blur', function() {
                textareaValidation(wrappingFormClass, wrappingInputClass, validationResults);
              });
              break;
            case 'fileupload':
              $('.'+wrappingFormClass+' .'+wrappingInputClass+' input[type="file"]').on('change blur', function() {
                fileuploadValidation(wrappingFormClass, wrappingInputClass, validationResults);
              });
              break;
            case 'zipcode':
              $('.'+wrappingFormClass+' .'+wrappingInputClass+' input').on('keypress', function(e) {
                if ((e.which != 46 || $(this).val().indexOf('.') != -1) && (e.which < 48 || e.which > 57) || ($(this).val().length) >= 5) {
                  e.preventDefault();
                }
              });
              $('.'+wrappingFormClass+' .'+wrappingInputClass+' input').on('keyup blur', function() {
                zipcodeValidation(wrappingFormClass, wrappingInputClass, validationResults);
              });
              break;
          }
        });

        $('.'+wrappingFormClass+' a.form-submit-link').on('click', function(e){
          e.preventDefault();
          //console.log('click');
          var valid = true;
          $.each( validationResults, function( inputField, result ) {
            if(!result){
              valid = false;
              $('.'+wrappingFormClass +' .'+inputField).addClass('error');
            }
          });
          if(!valid){
            //console.log('invalid');
            return false;
          } else {

            //console.log('valid');

            // if(typeof window.rfWistiaFormTracking != "undefined"){
            //   if(formName == 'sitewide-popup' || formName == 'sitewide-nav' || formName == 'single-post-sidebar' || formName == 'page-quote'){
            //     window.rfWistiaFormTracking.formName = formName;
            //     if(typeof window.rfWistiaLogFormConversion != "undefined"){
            //       window.rfWistiaFormTracking.company = formValues.company;
            //       window.rfWistiaFormTracking.firstName = formValues.firstName;
            //       window.rfWistiaFormTracking.lastName = formValues.lastName;
            //       window.rfWistiaFormTracking.email = formValues.email;
            //       window.rfWistiaFormTracking.phone = formValues.phone;
            //       window.rfWistiaFormTracking.inquireType = formValues.inquireType;
            //       window.rfWistiaFormTracking.comment = formValues.comment;
            //       window.rfWistiaLogFormConversion(window.rfWistiaFormTracking);
            //     }
            //   }
            // }

            // if(typeof window.pardotAlertLogClient != "undefined"){
            //   if(formName == 'sitewide-popup' || formName == 'sitewide-nav' || formName == 'single-post-sidebar' || formName == 'page-quote'){
            //     var pardotAlertObj = {
            //       firstName: $('.'+wrappingFormClass+' .rf-first-name input').val(),
            //       lastName: $('.'+wrappingFormClass+' .rf-last-name input').val(),
            //       email: $('.'+wrappingFormClass+' .rf-email input').val(),
            //       company: $('.'+wrappingFormClass+' .rf-company input').val()
            //     }
            //     window.pardotAlertLogClient(pardotAlertObj);
            //   }
            // }

            $(this).addClass('disabled');
            $(this).find('.fa').removeClass('hidden');
            $(this).css('margin-right', '20px');
            $('.'+wrappingFormClass+' input[type="submit"]').trigger('click');
          }
        });

      };

    };

    $(".ttnlf-phone input").mask("(999) 999-9999");

    var homeTSForm01 = new AntheadDigitalFormValidation({
      wrappingFormClass: 'ts-form-01',
      formName: 'ts-form-01',
      requiredFields: {
        'ttnlf-full-name': 'text',
        'ttnlf-email': 'email',
        'ttnlf-phone': 'phone',
        'ttnlf-comments': 'textarea'
      }
    });
    homeTSForm01.watchValidation();

    var footerForm01 = new AntheadDigitalFormValidation({
      wrappingFormClass: 'footer-form-01',
      formName: 'footer-form-01',
      requiredFields: {
        'ttnlf-full-name': 'text',
        'ttnlf-email': 'email',
        'ttnlf-phone': 'phone',
        'ttnlf-comments': 'textarea'
      }
    });
    footerForm01.watchValidation();


    var contactForm = new AntheadDigitalFormValidation({
      wrappingFormClass: 'contact-form-wrapper',
      formName: 'contact-form',
      requiredFields: {
        'ttnlf-full-name': 'text',
        'ttnlf-email': 'email',
        'ttnlf-phone': 'phone',
        'ttnlf-best-time': 'text',
        'ttnlf-comments': 'textarea'
      }
    });
    contactForm.watchValidation();

  });
})(jQuery);
