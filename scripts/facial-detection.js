$(document).ready(function() {

  /* ---------------------- Set Up -------------------------- */

  let _URL = window.URL || window.webkitURL

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
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }

    $.contextMenu({
      selector: '.face-box.new',  // Attach to element (new red facebox with no name attached)
      trigger: 'left',  // Trigger menu on left mouse click
      callback: (key, options) => {
        let faceBox = $(options.$trigger.context)   // Get the current face-box element

        if (key === "add") {
          let name = prompt("Enter the person's name", "")
          if (!name) return toastr["error"]("You must enter the person's name.", "Name Missing")

          faceBox.addClass('added').removeClass('new selected').attr('face-box-name', name) // Attach name to element which is used to add to ::before via CSS
        }
        if (key === "delete") faceBox.fadeOut(500, function() { $(this).remove() }) // Delete face box
      },
      items: {
        "add": {name: "Add", icon: "add"},
        "delete": {name: "Delete", icon: "delete"},
        "separator": "---------",
        "quit": {name: "Quit", icon: "quit"}
      }, events: {
        show: (options) => $(options.$trigger.context).addClass('selected'),   // Highlight orange
        hide: (options) => $(options.$trigger.context).removeClass('selected') // Remove orange highlight
      }
    })

    $.contextMenu({
      selector: '.face-box.added',    // Attach to element (when name has been added already)
      trigger: 'left',
      callback: function(key, options) {
        let faceBox = $(options.$trigger.context)

        if (key === "edit") {
          faceBox.name = prompt("Re-enter the person's name", faceBox.attr('personName')) || faceBox.name // Keeps old name if cancelled
          faceBox.attr('face-box-name', faceBox.name)   // Update ::before text
        }
        if (key === "remove") faceBox.addClass('new').removeClass('added')    // Remove name and return to red facebox
        if (key === "delete") faceBox.remove()    // Delete facebox
      },
      items: {
        "edit": {name: "Edit", icon: "edit"},
        "remove": {name: "Remove Tag", icon: "quit"},
        "delete": {name: "Delete", icon: "delete"},
        "separator": "---------",
        "quit": {name: "Quit", icon: "quit"}
      }
    })
  })


  /* ---------------------- jQuery Events -------------------------- */


  $("#get-faces-btn").click(() => {
    $("#preview-img").faceDetection({   // Use plugin to detect faces in image
      complete: (faces) => {    // When finished, get face data
        setTimeout(() => {
          $.each(faces, (index, face) => {
            let faceBox = $("<div class='face-box new'></div>")
              // Draw box around each face
            faceBox.css({ top: face.y - 5, left: face.x - 5, width: face.width + 10, height: face.height + 10, 'border-radius': 8 })

            $("#preview-container").append(faceBox)
          })

          $("#preview-img").loading('stop') // Hide loading screen
          $("#get-faces-btn").prop('disabled', true)
        }, 1000)
      }, error: (code, message) => {
        toastr["error"](message, "Error")
      }
    }).loading('start')
  })

  $("#img-file").change(() => { // Image has been selected
    $(".face-box").remove() // Remove any faceboxes from previous image

    let file, img

    if ((file = $("#img-file").prop('files')[0])) {
      img = new Image()

      img.onload = () => {    // When image starts loading
        let imgPrev = $('#preview-img')

        imgPrev.css({ width: img.width, height: img.height }).fadeIn().loading('start')   // Set the size of the empty image and show loading screen

        let file = $('#img-file').prop('files')[0]  // Get image uploaded
        let reader = new FileReader()

        reader.onloadend = () => {  // When image has been loaded
          setTimeout(() => {
            imgPrev.attr('src', reader.result).loading('stop').hide().fadeIn('slow')  // Remove loading screen and show image
            $("#get-faces-btn").prop('disabled', false).fadeIn()
          }, 1000)
        }

        if (file) reader.readAsDataURL(file)
        else imgPrev.attr('src', "")
      }

      img.src = _URL.createObjectURL(file)
    }
  })

})
