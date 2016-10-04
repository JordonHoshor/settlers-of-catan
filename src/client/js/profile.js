(function () {

  'use strict';

  $('#profile-update').on('submit', function(e) {
    e.preventDefault();

    const values = {};
    $.each($('#profile-update').serializeArray(), function(i, field) {
      values[field.name] = field.value;
    });

    var id = window.location.pathname.split('/')[2];
    $.ajax({
      type: 'PUT',
      url: `/profile/${id}/edit`,
      data: values
    })
    .done((data) => {
      window.location.href = document.referrer;
    })
    .fail((err) => {
    });
  });

  $(document).on('click', '#delete-profile', function(e) {
    e.preventDefault();
    const answer = confirm('Are you sure? This can\'t be undone');
    //
    if (answer) {
      var id = window.location.pathname.split('/')[2];
      $.ajax({
        type: 'DELETE',
        url: `/profile/${id}/delete`
      })
      .done((data) => {
        document.location.href = '/';
      })
      .fail((err) => {
        console.log('err =>', err);
      });
    }
  });

})();
