$(document).ready(function() {

  /* ---------------------- Set Up -------------------------- */

  var _URL = window.URL || window.webkitURL

  $(function() {
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

    $.contextMenu({
      selector: '.face-box.new',
      trigger: 'left',
      callback: function(key, options) {
        let faceBox = $(options.$trigger.context)

        if (key === "add") {
          let name = prompt("Enter the person's name", "")
          if (!name) return toastr["error"]("You must enter the person's name.", "Name Missing")

          faceBox.attr('personName', name)
          faceBox.addClass('added').removeClass('new selected').attr('face-box-name', faceBox.attr('personName'))
        }
        if (key === "delete") faceBox.remove()
      },
      items: {
        "add": {name: "Add", icon: "add"},
        "delete": {name: "Delete", icon: "delete"},
        "sep1": "---------",
        "quit": {name: "Quit", icon: "quit"}
      }, events: {
        show: function(options) {
          $(options.$trigger.context).addClass('selected')
        },
        hide: function(options) {
          $(options.$trigger.context).removeClass('selected')
        }
      }
    })

    $.contextMenu({
      selector: '.face-box.added',
      trigger: 'left',
      callback: function(key, options) {
        let faceBox = $(options.$trigger.context)

        if (key === "edit") {
          faceBox.name = prompt("Re-enter the person's name", faceBox.attr('personName')) || faceBox.name // Keeps old name if cancelled
          faceBox.attr('face-box-name', faceBox.name)
        }
        if (key === "remove") faceBox.addClass('new').removeClass('added')
        if (key === "delete") faceBox.remove()
      },
      items: {
        "edit": {name: "Edit", icon: "edit"},
        "remove": {name: "Remove", icon: "quit"},
        "delete": {name: "Delete", icon: "delete"},
        "sep1": "---------",
        "quit": {name: "Quit", icon: "quit"}
      }
    })
  })


  /* ---------------------- jQuery Events -------------------------- */


  $("#get-faces-btn").click(function(event) {
    $("#preview-img").faceDetection({
      complete: function (faces) {
        setTimeout(function() {
          for (var i = 0; i < faces.length; i++) {
            var face = faces[i];

            var faceBox = $("<div class='face-box new'></div>");
            faceBox.css({ top: face.y - 5, left: face.x - 5, width: face.width + 10, height: face.height + 10, 'border-radius': 8 })

            $("#preview-container").append(faceBox)
          }

          $("#preview-img").loading('stop')
          $("#get-faces-btn").prop('disabled', true)
        }, 1000)
        console.log(faces);
      },error: function (code, message) {
        console.log(message)
      }
    }).loading('start')
  })

  $("#img-file").change(function() {
    $(".face-box").remove() // Remove any faceboxes from previous image

    var file, img

    if ((file = $("#img-file").prop('files')[0])) {
      img = new Image()

      img.onload = function() {
        let imgPrev = $('#preview-img')

        imgPrev.css({ width: this.width, height: this.height }).fadeIn().loading('start')

        var file = $('#img-file').prop('files')[0]
        var reader = new FileReader()

        reader.onloadend = function () {
          setTimeout(function() {
            imgPrev.attr('src', reader.result).loading('stop').hide().fadeIn('slow')
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
