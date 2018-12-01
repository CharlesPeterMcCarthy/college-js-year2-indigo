$(document).ready(function() {

  toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }

  function GetSpotifyAccessToken(callback) {
    $.ajax({
      type: "POST",
      url: "https://yourtakeout.ie/spotify-api/get-access-token.php",
      data: JSON.stringify({
        clientID: "88914c854e7f4c2687f971155584dabf"
      }),
      dataType: 'json',
      success: function(response) {
        if (response.token) callback(response.token)
        else if (response.error) toastr["error"](response.error, "An Error Occurred")
        else toastr["error"]("An unknown error has occurred", "Unknown Error")
      },
      error : function(response) {
        toastr["error"](response, "An Error Occurred")
      }
    });
  }

  $("#spotify-btn").click(function() {
    $(this).prop('disabled', true)
    GetArtists($(this))
  });

  function GetArtists(btn) {
    let searchText = $("#spotify-search").val()
    if (!searchText) return toastr["warning"]("You have not entered anything into the search input field", "No Search Term")

    GetSpotifyAccessToken(function(accessToken) {
      $.ajax({
        type: 'GET',
        url: `https://api.spotify.com/v1/search?q=${searchText}&type=artist&limit=10`,
        headers: {
           'Authorization': 'Bearer ' + accessToken
        },
        dataType : 'json',
        success: function(response){
          console.log(response)

          if (response.artists) DisplaySpotifySearchResults(response.artists)
          else if (response.error) toastr["error"](response.error, "An Error Occurred")

          btn.prop('disabled', false)
        },
        error : function(response) {
          console.log(response)
        }
      })
    })
  }

  function DisplaySpotifySearchResults(artists) {
    $.each(artists.items, (index, artist) => {
      $(CreateSpotifyArtistItem(artist)).appendTo("#spotify-results").hide().slideDown()
    })
  }

  function CreateSpotifyArtistItem(artist) {
    return (
      `<li class='spotify-artist'>
        <div class='row'>
          <div class='col-sm-8'>
            <a class='artist-name' href='${artist.external_urls.spotify}' target='_blank'>${artist.name}</a>
            <p><strong>Followers</strong>: ${artist.followers.total}</p>
            <p><strong>Genres</strong>: ${artist.genres.length && artist.genres.join(", ") || "N/A"}</p>
            <p><strong>Popularity</strong>: ${artist.popularity} / 100</p>
          </div>
          <div class='col-sm-4 text-right'>
            <img src='${artist.images.length && artist.images[1].url || "images/noimage.gif"}' class='artist-img'>
          </div>
        </div>
      </li>`
    )
  }

})
