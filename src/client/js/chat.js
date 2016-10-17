$(document).ready(function() {
  //setup start
  disableCanvas();

  var socket = io(); // jshint ignore:line
  var bool = $('#myData').data('first');

  //first player can place cities
  // if (bool) {
  //   enableCanvas();
  //   $('#next-place').prop('disable', 'false');
  // }

  // send new user's name and sessionID
  $(document).ready(function() {
    var name = $('#myData').data('name');
    var sessionID = $('#myData').data('id');
    $('#username').val(name);
    socket.emit('join chat', name, sessionID);
  });

  //*** Buttons ***//
  //ask for a dice roll and then enables the rest of the buttons and the canvas
  $('#roll-dice-form').on('submit', function(e) {
    e.preventDefault();
    var socketId = $('#myData').data('id');
    socket.emit('dice-roll', socketId);
    $('#roll-dice').prop('disabled', true);
    enableButtons();
    enableCanvas();
  });

  //next turn, disable buttons and canvas
  $('#next-turn-form').on('submit', function(e) {
    e.preventDefault();
    var socketId = $('#myData').data('id');
    disableButtons();
    disableCanvas();
    socket.emit('next-turn', socketId);
  });

  $('#next-place-form').on('submit', function(e) {
    e.preventDefault();
    var socketId = $('#myData').data('id');
    $('#next-place').prop('disabled', 'true');
    disableCanvas();
    socket.emit('next-place-phase', socketId);
  });

  //emit chat message to server
  $('#chatForm').submit(function(e) {
    e.preventDefault();
    var msg = $('#m').val();
    socket.emit('chat message', msg);
    // reset form value to nothing
    $('#m').val('');
  });

  // set listener for chat form when enter/return key released
  $('#chatForm').on('keyup', function(e) {
    if (e.keyCode !== 13) {
      // display to all users who is currently typing
      socket.emit('typing', $('#myData').data('name'));
    }
  });

  // add message to chat window
  socket.on('chat message', function(msg) {
    $('#messages').append($('<li>').text(msg));
    $('#typing').text('');
    scrollChat(); // jshint ignore:line
  });

  // display name of current typing user
  socket.on('typing', function(msg) {
    $('#typing').text(msg + ' is typing...');
    setTimeout(function () {
      $('#typing').text('');
    }, 3000);
  });

  // display name of user that has joined room
  socket.on('join chat', function(msg) {
    $('#messages').append($('<li class="room-change">').text(msg + ' has just joined the chat!'));
  });

  // display name of user when their socket closes
  socket.on('leave chat', function(name) {
    $('#users li').each(function() {
      var $el = $(this);
      if ($el.text() === name) {
        $('#messages').append($('<li class="room-change">').text(name + ' has just left the chat. :('));
        $el.remove();
        $('#typing').text('');
        return;
      }
    });
  });
  //enable roll on your turn.
  socket.on('your-turn', function() {
    $('#roll-dice').prop('disabled', false);
  });

  //adds username of persons turn it is to play
  socket.on('next-turn', function(name) {
    $('#messages').append($('<li class="room-change">').text(`It is now ${name}'s turn.`));
    scrollChat(); // jshint ignore:line
  });

  //display dice roll in chat with the name of the person who requested it
  socket.on('dice-roll', function(diceArray, name) {
    $('#messages').append($('<li>').text(`${name} just rolled a ${diceArray[0]} and ${diceArray[1]} for a total of ${diceArray[2]}`));
    scrollChat(); // jshint ignore:line
  });

  //listens for your place phase and asks server for player information
  socket.on('your-phase', function() {
    var pathname = window.location.pathname.split('/');
    var game_id = pathname[2];
    $.ajax({
      url: `/play/${game_id}/player`,
      method: 'GET',
      data: {game_id: game_id}
    }).done(function(playerInfo) {
      enableCanvas();
      $('#next-place').prop('disabled', false);
    });
  });

  //adds username of persons turn it is to place
  socket.on('next-place-phase', function(name) {
    $('#messages').append($('<li class="room-change">').text(`It is now ${name}'s turn to place.`));
    scrollChat(); // jshint ignore:line
  });
});
//enable all buttons
function enableButtons() {
  $('#next-turn').prop('disabled', false);
  $('#trade-bank').prop('disabled', false);
  $('#trade-players').prop('disabled', false);
  $('#play-dev-card-form').prop('disabled', false);
  $('#buy-developement-card-form').prop('disabled', false);
}
//disable all buttons
function disableButtons() {
  $('#roll-dice').prop('disabled', true);
  $('#next-turn').prop('disabled', true);
  $('#trade-bank').prop('disabled', true);
  $('#trade-players').prop('disabled', true);
  $('#play-dev-card-form').prop('disabled', true);
  $('#buy-developement-card-form').prop('disabled', true);
}

function disableCanvas() {
  $('#hexmap').css('pointer-events', 'none');
  $('#hexmap2').css('pointer-events', 'none');
  $('#hexmap3').css('pointer-events', 'none');
}

function enableCanvas() {
  $('#hexmap').css('pointer-events', 'auto');
  $('#hexmap2').css('pointer-events', 'auto');
  $('#hexmap3').css('pointer-events', 'auto');
}
