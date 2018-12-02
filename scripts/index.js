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
    SearchSpotify($(this), $('#spotify-search-type').val())
  })

  function SearchSpotify(btn, type) {
    let searchText = $("#spotify-search").val()
    if (!searchText) return toastr["warning"]("You have not entered anything into the search input field", "No Search Term")

    $("#spotify-results").empty()
    $("#spotify-loader").show()

    GetSpotifyAccessToken(function(accessToken) {
      $.ajax({
        type: 'GET',
        url: `https://api.spotify.com/v1/search?q=${searchText}&type=${type}&limit=10`,
        headers: {
           'Authorization': 'Bearer ' + accessToken
        },
        dataType : 'json',
        success: function(response){
          console.log(response)

          $("#spotify-loader").hide()

          if (type === "artist" && response.artists) {
            DisplaySpotifyArtists(response.artists.items)

            if (response.artists.limit && response.artists.total) DisplaySearchResultsCount(response.artists.limit, response.artists.total, "artists")
          } else if (type === "album" && response.albums) {
            DisplaySpotifyAlbums(response.albums.items)

            if (response.albums.limit && response.albums.total) DisplaySearchResultsCount(response.albums.limit, response.albums.total, "albums and singles")
          }
          else if (response.error) toastr["error"](response.error, "An Error Occurred")


          btn.prop('disabled', false)
        },
        error : function(response) {
          console.log(response)
        }
      })
    })
  }

  function DisplaySpotifyArtists(artists) {
    $.each(artists, (index, artist) => {
      $(CreateSpotifyArtistItem(artist)).appendTo("#spotify-results")
    })
    $("#spotify-results").slideDown()
  }

  function DisplaySpotifyAlbums(albums) {
    $.each(albums, (index, album) => {
      $(CreateSpotifyAlbumItem(album)).appendTo("#spotify-results")
    })
    $("#spotify-results").slideDown()
  }

  function CreateSpotifyArtistItem(artist) {
    return (
      `<li class='spotify-item'>
        <div class='row'>
          <div class='col-sm-8'>
            <p class='artist-name'>${artist.name}</p>
            <p><strong>Followers</strong>: ${artist.followers.total}</p>
            <p><strong>Genres</strong>: ${artist.genres.length && artist.genres.join(", ") || "N/A"}</p>
            <p><strong>Popularity</strong>: ${artist.popularity} / 100</p>
            <div class='spotify-item-btns'>
              <a class='btn btn-sm btn-spotify' href='${artist.external_urls.spotify}' target='_blank'>View On Spotify</a>
              <button class='btn btn-sm btn-spotify view-artist-albums' artist-id='${artist.id}'>View Albums</button>
            </div>
          </div>
          <div class='col-sm-4 text-right'>
            <img src='${artist.images.length && artist.images[1].url || "images/noimage.gif"}' class='artist-img'>
          </div>
        </div>
      </li>`
    )
  }

  function CreateSpotifyAlbumItem(album) {
    return (
      `<li class='spotify-item'>
        <div class='row'>
          <div class='col-sm-8'>
            <p class='album-name'>${album.name}</p>
            <p><strong>Artist</strong>: ${album.artists[0].name || "N/A"}</p>
            <p><strong>Total Tracks</strong>: ${album.total_tracks}</p>
            <p><strong>Released</strong>: ${GetTimeSince(album.release_date)}</p>
            <div class='spotify-item-btns'>
              <a class='btn btn-sm btn-spotify' href='${album.external_urls.spotify}' target='_blank'>View On Spotify</a>
            </div>
          </div>
          <div class='col-sm-4 text-right'>
            <img src='${album.images.length && album.images[1].url || "images/noimage.gif"}' class='album-img'>
          </div>
        </div>
      </li>`
    )
  }

  function GetTimeSince(date) {
    return moment(new Date(date)).fromNow()
  }

  function DisplaySearchResultsCount(limit, total, type) {
    $('#spotify-search-count').html(`Showing 1-${total > limit ? limit : total } of ${total} ${type}.`).hide().fadeIn()
  }

  $(document).on('click', '.view-artist-albums', function() {
    GetArtistAlbums($(this).attr('artist-id'))
  })

  function GetArtistAlbums(artistID) {
    $("#spotify-results").empty();
    $("#spotify-loader").show();

    GetSpotifyAccessToken(function(accessToken) {
      $.ajax({
        type: 'GET',
        url: `https://api.spotify.com/v1/artists/${artistID}/albums?limit=10`,
        headers: {
           'Authorization': 'Bearer ' + accessToken
        },
        dataType : 'json',
        success: function(response){
          console.log(response)

          $("#spotify-loader").hide()

          if (response.items) {
            DisplaySpotifyAlbums(response.items)

            if (response.limit && response.total) DisplaySearchResultsCount(response.limit, response.total, 'albums & singles')
          }
          else if (response.error) toastr["error"](response.error, "An Error Occurred")
        },
        error : function(response) {
          console.log(response)
        }
      })
    })
  }

})
