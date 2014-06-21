function scrollToNote(noteId){
  $('html, body').animate({
        scrollTop: $("#"+noteId).offset().top - 12
  }, 1000);
}
