/**
 * Client side script that initializes the game. This should be the only script
 * that depends on JQuery.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

$(document).ready(function() {
  var socket = io();
  var game = Game.create(socket, document.getElementById('canvas'));

  Input.applyEventHandlers(document.getElementById('canvas'));
  Input.addMouseTracker(document.getElementById('canvas'));

  $('.loader').hide();
  $('.name-form').submit(function() {
    $('.loader').show();
    var name = $('.name-input').val().trim();
    if (name && name.length < 20) {
      socket.emit('new-player', {
        name: name
      }, function() {
        $('.name-prompt-container').fadeOut(500);
        $('#canvas').focus();
        game.animate();
      });
    } else {
      alert('Your name cannot be blank or over 20 characters.');
    }
    return false;
  });
});
