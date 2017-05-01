import $ from "jquery";
import mdash from "./mdash/mdash.js";

$('#url_btn').on('click', function() {
  const url = $('#url').val();
  var player = new mdash(url, '#video');
  $('#mute_btn').on('click', function() {
    player.toggleVolume();
  });
});

// $('#url_btn2').on('click', function() {
//   const url = $('#url2').val();
//   new mdash(url, '#video');
// });
