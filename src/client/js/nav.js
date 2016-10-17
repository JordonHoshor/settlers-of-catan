'use strict';

$('#sign-out').on('click', function(e) {
  e.preventDefault();
  var answer = confirm('Are you sure you want to logout?');
  if (answer) {
    $.ajax({
      url: '/logout',
      method: 'GET'
    }).done(function (data) {
      document.location.href = '/';
    });
  }
});
