import $ from "jquery";
import mdash from "./mdash/mdash.js";

$('#url_btn').on('click', function() {
  const url = $('#url').val();
  var player = new mdash(url, '#video', function() {
    const reps = player.getVideoRep();
    $('#quality').empty();
    reps.forEach(function(x, i) {
      let temp = $('<li>' + x.id + '</li>');
      temp.on('click', player.changeVideoQuality(i));
      $('#quality').append(temp);
    });
    $('#mute_btn').on('click', function() {
      player.toggleVolume();
    });
  });
});

// $('#url_btn2').on('click', function() {
//   const url = $('#url2').val();
//   new mdash(url, '#video');
// });
