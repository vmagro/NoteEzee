function scrollToNote(noteId){
  console.log('scrolling to ' + noteId);
  $('html, body').animate({
        scrollTop: $("#"+noteId).offset().top - 200
  }, 1000);
}

var lastScrolledTo = '';

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
    toPlay = currentBg.indexOf('Play') != -1;
    if(toPlay){
      $('audio')[0].play();
    } else {
      $('audio')[0].pause();
    }
  });

  $('audio')[0].addEventListener('durationchange', function(){
    $('.total-progress').attr('max', $('audio')[0].duration);
  });

  $('audio')[0].addEventListener('play', function(){
    $('.play-pause-button').css('background-image', 'url(/linker/images/PauseBT.png)');
  });

  $('audio')[0].addEventListener('pause', function(){
    $('.play-pause-button').css('background-image', 'url(/linker/images/PlayBT.png)');
  });

  $('audio')[0].addEventListener('timeupdate', function(){
    var time = $('audio')[0].currentTime;
    $('.total-progress').attr('value', time);

    var notes = $('.note');
    notes.sort(function(a, b){
      return $(a).attr('timestamp') < $(b).attr('timestamp') ? 1 : -1;
    });
    for(var i=1; i<notes.length; i++){
      if($(notes[i]).attr('timestamp') < time){
        var id = $(notes[i]).attr('id');
        if(id !== lastScrolledTo){
          scrollToNote(id);

          $(notes[i]).addClass('active');
          $('#'+lastScrolledTo).removeClass('active');
          lastScrolledTo = id;
        }
        return;
      }
    }
  });

  $('.note-play').on('click', function(){
    var timestamp = $(this).attr('timestamp');
    $('audio')[0].currentTime = timestamp;
    $('audio')[0].play();
  });
});
