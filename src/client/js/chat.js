$(document).ready(function() {
  //setup start

  var socket = io(); // jshint ignore:line
  const bool = $('#myData').data('first');

  if (bool) {
    enableButtons();
  }

  // send new user's name and sessionID
  $(document).ready(function() {
    var name = $('#myData').data('name');
    var sessionID = $('#myData').data('id');
    $('#username').val(name);
    socket.emit('join chat', name, sessionID);
  });

  //*** Buttons ***//
  //ask for a dice roll
  $('#roll-dice-form').on('submit', (e) => {
    e.preventDefault();
    const socketId = $('#myData').data('id');
    socket.emit('dice-roll', socketId);
    $('#roll-dice').prop('disabled', true);
  });

  //next turn
  $('#next-turn-form').on('submit', (e) => {
    e.preventDefault();
    const socketId = $('#myData').data('id');
    disableButtons();
    socket.emit('next-turn', socketId);
  });

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

  socket.on('your-turn', () => {
    enableButtons();
  });

  socket.on('next-turn', (name) => {
    $('#messages').append($('<li class="room-change">').text(`It is now ${name}'s turn.'`));
    scrollChat(); // jshint ignore:line
  });

  //display dice roll in chat with the name of the person who requested it
  socket.on('dice-roll', (diceArray, name) => {
    $('#messages').append($('<li>').text(`${name} just rolled a ${diceArray[0]} and ${diceArray[1]} for a total of ${diceArray[2]}`));
    scrollChat(); // jshint ignore:line
  });
});

function enableButtons() {
  $('#roll-dice').prop('disabled', false);
  $('#next-turn').prop('disabled', false);
  $('#trade-bank').prop('disabled', false);
  $('#trade-players').prop('disabled', false);
  $('#play-dev-card-form').prop('disabled', false);
  $('#buy-developement-card-form').prop('disabled', false);
}

function disableButtons() {
  $('#roll-dice').prop('disabled', true);
  $('#next-turn').prop('disabled', true);
  $('#trade-bank').prop('disabled', true);
  $('#trade-players').prop('disabled', true);
  $('#play-dev-card-form').prop('disabled', true);
  $('#buy-developement-card-form').prop('disabled', true);
}
