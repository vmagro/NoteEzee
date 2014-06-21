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
});
