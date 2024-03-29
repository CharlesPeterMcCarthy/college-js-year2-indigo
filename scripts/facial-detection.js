$(document).ready(function() {

  /* ---------------------- Set Up -------------------------- */

  let _URL = window.URL || window.webkitURL   // Used for image upload
  let curImgWidth
  let curImgBoxWidth

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
        "cancel": {name: "Cancel", icon: "quit"}
      }, events: {
        show: (options) => $(options.$trigger.context).addClass('selected'),   // Highlight orange
        hide: (options) => $(options.$trigger.context).removeClass('selected') // Remove orange highlight
      }
    })

    $.contextMenu({
      selector: '.face-box.added',    // Attach to element (when name has been added already)
      trigger: 'left',
      callback: (key, options) => {
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
        "cancel": {name: "Cancel", icon: "quit"}
      }
    })
  })


  /* ---------------------- jQuery Events -------------------------- */


  $("#get-faces-btn").click(() => {
    $("#get-faces-btn").html('Getting Faces..').prop('disabled', true)

    $("#preview-img").faceDetection({   // Use plugin to detect faces in image
      complete: (faces) => {    // When finished, get face data
        let ratio = 1
        if (curImgWidth / curImgBoxWidth > 1) ratio = curImgWidth / curImgBoxWidth

        $.each(faces, (index, face) => {
          let faceBox = $("<div class='face-box new'></div>")
          // Draw box around each face
          faceBox.css({   // Create face box relative to the person's face size
            'top': (face.y / ratio) - 5,
            'left': (face.x / ratio) - 5,
            'width': (face.width / ratio) + 10,
            'height': (face.height / ratio) + ((face.height / ratio) * 0.2),  // Add extra 20% height because plugin tends to cut off chin / mouth
            'border-radius': 8
          })

          $("#preview-container").append(faceBox)
        })

        $("#get-faces-btn").fadeOut()
      }, error: (code, message) => {
        toastr["error"](message, "Error")
      }
    })
  })

  $("#img-file").change(() => { // Image has been selected
    $(".face-box").remove() // Remove any faceboxes from previous image

    let file, img

    if ((file = $("#img-file").prop('files')[0])) {
      let allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i
      if (!allowedExtensions.exec(file.name)) return toastr["error"]("You can only upload images in .jpg, .jpeg and .png formats.", "Invalid File")

      img = new Image()

      img.onload = () => {    // When image starts loading
        let imgPrev = $('#preview-img')

        imgPrev.css({ width: img.width, height: img.height }).fadeIn().loading({ message: 'Uploading Image...' })   // Set the size of the empty image and show loading screen

        let file = $('#img-file').prop('files')[0]  // Get image uploaded
        let reader = new FileReader()

        reader.onloadend = () => {  // When image has been loaded
          setTimeout(() => {
            // Remove loading screen and show image
            imgPrev.attr('src', reader.result).css({ width: 'auto', height: 'auto' }).loading('stop').hide().fadeIn('slow', function() {
              $("#get-faces-btn").prop('disabled', false).html('Get Faces').fadeIn()

              curImgWidth = img.width
              curImgBoxWidth = imgPrev[0].width
            })
          }, 1000)
        }

        if (file) reader.readAsDataURL(file)
        else imgPrev.attr('src', "")
      }

      img.src = _URL.createObjectURL(file)
    }
  })

})
