$(document).ready(function() {

  /* ----------------------- Setup ----------------------------- */


  $(() => {
    toastr.options = {    // Set the settings / options for toaster messages
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
      "showMethod": "slideDown",
      "hideMethod": "slideUp"
    }

    UpdateScrollbar() // Set scrollbar width on page load
  })


  /* ----------------------- jQuery Events and Methods ----------------------------- */


  $("#spotify-search-btn").click(function() {
    SearchSpotify()
  })

  $(document).keypress(function(e) {
    if ((e.keyCode || e.which) == 13) SearchSpotify()
  })

  $(document).on('click', '.view-artist-albums', function() {   // Use on('click') because button is added dynamically
    GetArtistAlbums($(this).attr('artist-id'))
  })

  $(".main-title").mouseleave(function() { // Rotate main title of the page 360 degrees on every mouseleave - Can give a spinning effect
    $(this).data('rotated', parseInt($(this).data('rotated') || 0) + 360).css({ // Store current rotated value in element data
      transform: `rotate(${parseInt($(this).data('rotated')) + 360}deg)`
    })
  })

  $("#learn-more-btn").click(function() {
    let btn = $(this)
    btn.addClass('red-btn')

    setTimeout(() => btn.removeClass('red-btn'), 1000)   // Remove class after 1 second
  })

  $("#message").on('change keyup paste', () => {
      // Change the width of the 2 input fields to a random width every time the text changes in the message textarea
    let width = Math.ceil(Math.random() * (10 - 1) + 1)

    $("#contact-name-container").attr('class', `col-md-${width} form-group`)
    $("#contact-email-container").attr('class', `col-md-${12 - width} form-group`)
  })

  $("#name").focus(() => {    // The name input field has focus
    $("#submit-btn-container").addClass("text-right")
  })

  $("#email").dblclick(() => {  // The email input field has focus
    $("#submit-btn-container").removeClass("text-right")
  })

  $("#submit-btn").click(() => {  // Slide up and hide elements - One at a time
    $("#message").slideUp(() => {
      $("#email").slideUp(() => {
        $("#name").slideUp(() => {
          $("#contact-section").slideUp()
        })
      })
    })
  })

  $(".nav li a[href='javascript:void(0)']").click(() => { // Play a sound everytime a nav link is clicked
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

      // Swap the navigation links with the home-nav link until it returns to the normal order
    $.each($("ul.nav > li"), (index, navItem) => { // Must use '>' symbol (children) to avoid using the li within the nested ul
      setTimeout(() => movements[index](), index * 1000)
    })
  })

  $(".read-more").click(function() {
    let btn = $(this)
    let container = btn.parent().parent() // Get the outer div (2 levels above)

    container.toggleClass('col-md-4 col-md-12') // Alternate between the two classes on every click

    btn.text(btn.text().toLowerCase() === 'read more' ? 'Read less' : 'Read more')

    setTimeout(() => {
      $('html, body').animate({
        scrollTop: $(container).offset().top - 20   // Scroll to 20 pixels off the top of the div
      }, 'slow')
    }, 400)
  })

  $("#contact-nav").click(() => {
    $('html, body').animate({
      scrollTop: $("#contact-section").offset().top   // Scroll to the top of the contact section
    }, 'slow')
  })

  $(".section.hero h3").mouseover(function() {
        // Using jQueryUI, make the text shake up and down by 9 pixels 5 times over the space of 2 seconds
    $(this).effect("shake", {
      direction: "up",
      times: 5,
      distance: 8
    }, 2000)
  })

  $(document).keypress((event) => {   // Whenever any key is pressed at any time
    if ($("input").is(':focus') || $("textarea").is(':focus')) return   // Don't continue if typing into input or textarea
    $("#message").val($("#message").val() + event.key)    // Append what has been typed to the message textarea

    toastr["info"]("You pressed a key on the keyboard. It has been appended to the message textbox.", "Key Pressed")  // Alert user
  })

  $(window).scroll(function() {   // Fires anytime the user scrolls
    UpdateScrollbar()
  })

  $(".service-block").mouseover(function() {
    $(".service-block").not($(this)).addClass('blur')   // Blur service-block divs that are not the one currently hovered over
  }).mouseleave(() => {
    $(".service-block").removeClass('blur')   // Remove blur class
  })

  $(".entry-media > a").click(function() {
    let classes = ['greyscale', 'sepia', 'blur', 'invert', 'contrast']

    $(this).removeClass().addClass(classes[Math.floor(Math.random() * 5)])    // Add one of 5 random classes to alter the image filter
  })

  $(".section:first-of-type").click(function() {  // When the user clicks the first .section class
    const randomPadding = Math.ceil(Math.random() * (200 - 100) + 100)  // Generate a random number between 100 and 200

    $(this).css({ 'padding-top': randomPadding, 'padding-bottom': randomPadding })
  })

  $(".service-block:eq(2) > h3").click(function() { // Click the h3 which is a direct child of the third service-block div
    $(this).toggleClass('invert-text')    // Add or remove class depending on whether the element already has that class
  })

  $("#recent-posts-title").mouseover(() => {  // On mouseover, 'transform' 1-3 .entry-media divs by moving them up and to the left
    $(".entry-media:lt(" + Math.ceil(Math.random() * 3) + ")").css({ transform: 'translate(-20px,-20px)'})
  }).mouseleave(() => {
    $(".entry-media").css({ transform: '' })
  })

  $("footer h3 + address").mouseover(function() { // Increase address font size and surround by box
    $(this).animate({
      'font-size': '24px',
      'background-color': '#555',
      'border-radius': '8px',
      'padding': '10px'
    })
  }).mouseleave(function() {  // Return to normal
    $(this).animate({
      'font-size': '14px',
      'background-color': '#2c3e50',
      'border-radius': '0',
      'padding': '0'
    })
  })

  $(".navbar-brand-block").click(function() {
    $(this).slideUp(1000, function() { // Slide up and hide text
      $(".navbar-brand").css({ 'text-transform': 'uppercase' }) // Change to uppercase
      $(this).slideDown(1000) // Slide down to reveal text
    })
  })


  /* ----------------------- jQuery Animation ----------------------------- */

  $.fn.flyRocket = function() {
    $(this).css({ 'text-align': 'left' })
    $(this).animate({ // Move rocket to the bottom left and create a larger box
      'width': '200px',
      'height': '200px',
      'padding-top': '185px',
      'border-radius': '4px',
      'line-height': 0,
      'background-color': '#94bcfc'
    }, 1000).animate({  // Rocket launches and flies to the top right as the background (sky) gets darker
      'padding-top': '15px',
      'padding-left': '170px',
      'background-color': 'black',
      'border-bottom-left-radius': '100px'
    }, {
      duration: 3000,
      specialEasing: {  // Starts flying at a slow speed, speeds up, then slows down towards the end
        'padding-left': "easeOutBounce"
      },
      complete: function() {
        $(this).addClass('hidden-icon')   // Hide the rocket
      }
    }).animate({  // Turn box into a large circle
      'border-bottom-right-radius': '100px',
      'border-top-left-radius': '100px',
      'border-top-right-radius': '100px'
    }, 1000).animate({  // Return circle to original size and colour
      'width': '80px',
      'height': '80px',
      'border-radius': '40px',
      'padding': 0,
      'background-color': 'white',
      'line-height': '80px'
    }, {
      duration: 1500,
      complete: function() {
        $(this).css({ 'text-align': 'center' }).removeClass('hidden-icon')  // Show rocket again
      }
    }).animate({    // Green box that extends horizontally
      'background-color': '#00d137',
      'border-radius': '4px',
      'width': '200px'
    }, 400).animate({ // Returns to normal
      'background-color': 'white',
      'border-radius': '40px',
      'width': '80px'
    }, 400).animate({ // Green box that extends vertically
      'background-color': '#00d137',
      'border-radius': '4px',
      'padding-top': '65px',
      'height': '200px'
    }, 400).animate({ // Return to normal
      'background-color': 'white',
      'border-radius': '40px',
      'padding': 0,
      'height': '80px'
    }, 400)
  }

  $(".fa-rocket").click(function() {    // When any of the rocket icons in the "our services" section is clicked
    $(this).flyRocket()
  })


  /* ----------------------- Named Functions & AJAX / API ----------------------------- */

  function UpdateScrollbar() {
    let height = $(document).height() - $(window).height()
    let scrollPercent = Math.ceil((100 / height) * $(document).scrollTop())   // Percentage over the screen the user has scrolled

    $(".progress-bar").css({ width: scrollPercent + '%' })  // Update the progress bar
  }

  function GetSpotifyAccessToken(callback) {
    /*
      In order to interact with the Spotify API, you must have an access token.
      You must supply your Spotify developer's account Client ID and Client Secret ID
      in order to get an access token from Spotify.
      This cannot be done from the client - It must be done via the server.
      Since we are not hosting our assignment websites on any server, I created an API to take care of this problem.
      I created the API in PHP, which uses a third-party library (https://github.com/jwilsson/spotify-web-api-php)
      to interact with Spotify.
      The API is hosted on the Google Cloud platform. It checks for the supplied Client ID.
      If the Client ID matches the one for my account, the Client ID and Client Secret ID are
      sent to Spotify, requesting an access token. When this is received, it is sent back
      here to the client.
      When it is received here, the callback method that has been supplied to this method is called.
      Every interaction with the Spotify API in this web page requests an access token via
      this method and the API.
    */
    $.ajax({
      type: "POST",
      url: "https://indigoassignment.appspot.com/get-token",
      data: JSON.stringify({
        clientID: "88914c854e7f4c2687f971155584dabf"    // Spotify developer account Client ID
      }),
      dataType: 'json',
      success: (response) => {
        if (response.token) callback(response.token)
        else if (response.error) toastr["error"](response.error, "Error")
        else toastr["error"]("An unknown error has occurred", "Unknown Error")
      },
      error : (response) => {
        toastr["error"]("An Error has occurred.", "Error")
      }
    })
  }

  function SearchSpotify() {
    let btn = $("#spotify-search-btn")
    let searchText = $("#spotify-search").val()
    let type = $('#spotify-search-type').val()

    if (!searchText) {    // Do not search for empty value
      return toastr["warning"]("You have not entered anything into the search input field", "No Search Term")
    }

    btn.prop('disabled', true) // Disable search button until data has been returned from the Spotify API

    $("#spotify-results").empty()   // Reset the results displayed
    $("#spotify-loader").show()     // Show loading spinner

    GetSpotifyAccessToken((accessToken) => {  // Get Spotify access token from my own API
      $.ajax({
        type: 'GET',
        url: `https://api.spotify.com/v1/search?q=${searchText}&type=${type}&limit=10`,
        headers: {
           'Authorization': 'Bearer ' + accessToken   // Supply access token
        },
        dataType : 'json',
        success: (response) => {
          $("#spotify-loader").hide()   // Hide loading spinner

          if (type === "artist" && response.artists) {
            DisplaySpotifyArtists(response.artists.items)

            if (response.artists.limit && response.artists.total !== undefined) DisplaySearchResultsCount(response.artists.limit, response.artists.total, "artists")
          } else if (type === "album" && response.albums) {
            DisplaySpotifyAlbums(response.albums.items)

            if (response.albums.limit && response.albums.total !== undefined) DisplaySearchResultsCount(response.albums.limit, response.albums.total, "albums and singles")
          }
          else if (response.error) toastr["error"](response.error, "An Error Occurred")


          btn.prop('disabled', false)   // Re-enable search button
        },
        error : (response) => {
          toastr["error"](response.responseJSON.error.message, "Error")
        }
      })
    })
  }

  function DisplaySpotifyArtists(artists) {
    $.each(artists, (index, artist) => {
      $(CreateSpotifyArtistItem(artist)).appendTo("#spotify-results")   // Append Spotify artist list item to results
    })

    $("#spotify-results").hide().slideDown()
    setTimeout(() => $(".artist-img").fadeIn(), 500)
  }

  function DisplaySpotifyAlbums(albums) {
    $.each(albums, (index, album) => {
      $(CreateSpotifyAlbumItem(album)).appendTo("#spotify-results")   // Append Spotify album list item to results
    })

    $("#spotify-results").hide().slideDown()
    setTimeout(() => $(".album-img").fadeIn(), 500)
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
            <img src='${artist.images.length && artist.images[1].url || "images/noimage.gif"}' class='artist-img' hidden>
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
            <img src='${album.images.length && album.images[1].url || "images/noimage.gif"}' class='album-img' hidden>
          </div>
        </div>
      </li>`
    )
  }

  function GetTimeSince(date) { // Use MomentJS to get the time since the date in easy to understand English
    return moment(new Date(date)).fromNow()
  }

  function DisplaySearchResultsCount(limit, total, type) {    // Display the result count of the Spotify search results
    $('#spotify-search-count').html(
      total > 0 ?
      `Showing 1-${total > limit ? limit : total } of ${total} ${type}.` :
      `There are 0 matching ${type}.`
    ).hide().fadeIn()
  }

  function GetArtistAlbums(artistID) {
    $("#spotify-results").empty()   // Reset the Spotify results list
    $("#spotify-loader").show()     // Show the loading spinner

    GetSpotifyAccessToken((accessToken) => {    // Get a Spotify access token from my API
      $.ajax({
        type: 'GET',
        url: `https://api.spotify.com/v1/artists/${artistID}/albums?limit=10`,
        headers: {
           'Authorization': 'Bearer ' + accessToken   // Supply access token
        },
        dataType : 'json',
        success: (response) => {
          $("#spotify-loader").hide()   // Hide the loading spinner

          if (response.items) {
            DisplaySpotifyAlbums(response.items)

            if (response.limit && response.total) DisplaySearchResultsCount(response.limit, response.total, 'albums & singles')
          }
          else if (response.error) toastr["error"](response.error, "An Error Occurred")
        },
        error : (response) => {
          toastr["error"](response.responseJSON.error.message, "Error")
        }
      })
    })
  }

})
