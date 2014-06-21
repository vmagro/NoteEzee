function scrollToNote(noteId){
  $('html, body').animate({
        scrollTop: $("#"+noteId).offset().top - 12
  }, 1000);
}

$(function(){
  $('.lecture').on('click', function(){
    var id = $(this).attr('id');
    var url = '/lecture/view/'+id;
    window.location.href = url;
    console.log('click');
  });

  $('.play-pause-button').on('click', function(){
    var currentBg = $(this).css('background-image');
    var toPlay = false;
    if(currentBg.indexOf('Play') != -1){
      toPlay = true;
      $(this).css('background-image', 'url(/linker/images/PauseBT.png)');
    } else {
      toPlay = false;
      $(this).css('background-image', 'url(/linker/images/PlayBT.png)');
    }
    if(toPlay){
      $('audio')[0].play();
    } else {
      $('audio')[0].pause();
    }
  });

  $('audio')[0].addEventListener('durationchange', function(){
    $('.total-progress').attr('max', $('audio')[0].duration);
  });

  $('audio')[0].addEventListener('timeupdate', function(){
    $('.total-progress').attr('value', $('audio')[0].currentTime);
  });
});
