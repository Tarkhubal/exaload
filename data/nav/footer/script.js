$(document).ready(function($) {

  $(window).on('scroll', function() {

    //ADD .TIGHT
    if ($(window).scrollTop() + $(window).height() > $('.wrapperfooter').outerHeight()) {
      $('body').addClass('tight');
      $('.arrow').hide();
    } else {
      $('body').removeClass('tight');
      $('.arrow').show();
    }
  });

  //BACK TO PRESENTATION MODE
  $("html").on("click", "body.tight .wrapperfooter", function() {
    $('html, body').animate({
      scrollTop: $('.wrapperfooter').outerHeight() - $(window).height()
    }, 500);
  });

});

$('.arrow').click(function(){
   $("html").animate({ scrollTop: $('html').prop("scrollHeight")}, 1200);
});