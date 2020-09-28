$(document).ready(init);

const HOST = 'localhost';

function init () {
  const amenityObj = {};
  $('.amenities .popover input').change(function () {
    if ($(this).is(':checked')) {
      amenityObj[$(this).attr('data-name')] = $(this).attr('data-id');
    } else if ($(this).is(':not(:checked)')) {
      delete amenityObj[$(this).attr('data-name')];
    }
    const names = Object.keys(amenityObj);
    $('.amenities h4').text(names.sort().join(', '));
  });

  apiStatus();
  fetchPlaces();
}

function apiStatus () {
  $.get(`http://${HOST}:5001/api/v1/status/`, (data, textStatus) => {
    console.log(data);
    if (textStatus === 'success' && data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
}

function fetchPlaces () {
  const users = {};
  $.getJSON(`http://${HOST}:5001/api/v1/users`, function (data) {
    for (const user of data) {
      users[user.id] = user.first_name + ' ' + user.last_name;
    }
  });
  $.ajax({
    url: `http://${HOST}:5001/api/v1/places_search/`,
    type: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({}),
    success: function (data) {
      for (const place of Object.values(data)) {
        $('section.places').append(
          '<article><div class="title_box"><h2>' +
            place.name +
            '</h2><div class="price_by_night">' +
            '$' +
            place.price_by_night +
            '</div></div><div class="information">' +
            '<div class="max_guest">' +
            place.max_guest +
            ' Guest(s)</div>' +
            '<div class="number_rooms">' +
            place.number_rooms +
            ' Bedroom(s)</div>' +
            '<div class="number_bathrooms">' +
            place.number_bathrooms +
            'Bathroom(s)</div>' +
            '</div><div class="user"><b>Owner: ' +
            `${users[place.user_id]}</b></div>` +
            '<div class="description">' +
            place.description +
            '</div></article>'
        );
      }
    }
  });
}
