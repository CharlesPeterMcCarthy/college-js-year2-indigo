$(document).ready(function() {

  toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-bottom-right",
    "preventDuplicates": true,
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
      url: "https://indigoassignment.appspot.com/get-token",
      data: JSON.stringify({
        clientID: "88914c854e7f4c2687f971155584dabf"
      }),
      dataType: 'json',
      success: (response) => {
        console.log(response)

        if (response.token) callback(response.token)
        else if (response.error) toastr["error"](response.error, "An Error Occurred")
        else toastr["error"]("An unknown error has occurred", "Unknown Error")
      },
      error : (response) => {
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
    if (!searchText) {
      btn.prop('disabled', false)
      return toastr["warning"]("You have not entered anything into the search input field", "No Search Term")
    }

    $("#spotify-results").empty()
    $("#spotify-loader").show()

    GetSpotifyAccessToken((accessToken) => {
      $.ajax({
        type: 'GET',
        url: `https://api.spotify.com/v1/search?q=${searchText}&type=${type}&limit=10`,
        headers: {
           'Authorization': 'Bearer ' + accessToken
        },
        dataType : 'json',
        success: (response) => {
          console.log(response)

          $("#spotify-loader").hide()

          if (type === "artist" && response.artists) {
            DisplaySpotifyArtists(response.artists.items)

            if (response.artists.limit && response.artists.total !== undefined) DisplaySearchResultsCount(response.artists.limit, response.artists.total, "artists")
          } else if (type === "album" && response.albums) {
            DisplaySpotifyAlbums(response.albums.items)

            if (response.albums.limit && response.albums.total !== undefined) DisplaySearchResultsCount(response.albums.limit, response.albums.total, "albums and singles")
          }
          else if (response.error) toastr["error"](response.error, "An Error Occurred")


          btn.prop('disabled', false)
        },
        error : (response) => {
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
    $('#spotify-search-count').html(
      total > 0 ?
      `Showing 1-${total > limit ? limit : total } of ${total} ${type}.` :
      `There are 0 matching ${type}.`
    ).hide().fadeIn()
  }

  $(document).on('click', '.view-artist-albums', function() {
    GetArtistAlbums($(this).attr('artist-id'))
  })

  function GetArtistAlbums(artistID) {
    $("#spotify-results").empty();
    $("#spotify-loader").show();

    GetSpotifyAccessToken((accessToken) => {
      $.ajax({
        type: 'GET',
        url: `https://api.spotify.com/v1/artists/${artistID}/albums?limit=10`,
        headers: {
           'Authorization': 'Bearer ' + accessToken
        },
        dataType : 'json',
        success: (response) => {
          console.log(response)

          $("#spotify-loader").hide()

          if (response.items) {
            DisplaySpotifyAlbums(response.items)

            if (response.limit && response.total) DisplaySearchResultsCount(response.limit, response.total, 'albums & singles')
          }
          else if (response.error) toastr["error"](response.error, "An Error Occurred")
        },
        error : (response) => {
          console.log(response)
        }
      })
    })
  }

  /* ------------------- General Requirements --------------------- */

  $(".main-title").mouseleave(function() { // Rotate main title of the page 360 degrees on every hover - Can give a spinning effect
    $(this).data('rotated', parseInt($(this).data('rotated') || 0) + 360).css({
      transform: `rotate(${parseInt($(this).data('rotated')) + 360}deg)`
    })
  })

  $("#learn-more-btn").click(function() {
    let btn = $(this)
    btn.addClass('red-btn')

    setTimeout(() => {
      btn.removeClass('red-btn')
    }, 1000)
  })

  $("#message").on('change keyup paste', () => {
    let width = Math.ceil(Math.random() * (10 - 1) + 1)

    $("#contact-name-container").attr('class', `col-md-${width} form-group`)
    $("#contact-email-container").attr('class', `col-md-${12 - width} form-group`)
  })

  $("#name").focus(() => {
    $("#submit-btn-container").addClass("text-right")
  })

  $("#email").dblclick(() => {
    $("#submit-btn-container").removeClass("text-right")
  })

  $("#submit-btn").click(() => {
    $("#message").slideUp(() => {
      $("#email").slideUp(() => {
        $("#name").slideUp(() => {
          $("#contact-section").slideUp()
        })
      })
    })
  })

  $(".nav li a[href='javascript:void(0)']").click(() => {
    new Audio('sounds/ding.mp3').play()
  })

  $("[role='navigation']").dblclick(() => {
    let movements = {
      '0' : () => $("#home-nav").insertAfter($("#about-nav")).hide().show('slow'),
      '1' : () => $("#home-nav").insertAfter($("#blog-nav")).hide().show('slow'),
      '2' : () => $("#home-nav").insertAfter($("#services-nav")).hide().show('slow'),
      '3' : () => $("#home-nav").insertAfter($("#contact-nav")).hide().show('slow'),
      '4' : () => $("#home-nav").insertBefore($("#about-nav")).hide().show('slow')
    }

    $.each($("ul.nav").children(), (index, navItem) => { // Must use children to avoid using the li within the nested ul
      setTimeout(() => {
        movements[index]()
      }, index * 1000)
    })
  })

})
