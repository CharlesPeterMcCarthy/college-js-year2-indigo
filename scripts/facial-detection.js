$(document).ready(function() {

  $("#get-faces").click(function(event) {
      $("#preview-img").faceDetection({
        complete: function (faces) {
          setTimeout(function() {
            for (var i = 0; i < faces.length; i++) {
              var face = faces[i];

              var faceBox = $("<div class='face-box new'></div>");
              faceBox.css({ top: face.y - 5, left: face.x - 5, width: face.width + 10, height: face.height + 10, 'border-radius': 8 })

              $("#preview-container").append(faceBox)
            }
            $("#preview-img").loading('stop');
          }, 1000)
          console.log(faces);
        },error: function (code, message) {
          console.log(message)
        }
      }).loading('start');
  })

  $("#upload-img").click(function() {
    $("#preview-img").loading('start');
    var preview = document.querySelector('#preview-img');
    var file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();

    reader.onloadend = function () {
      setTimeout(function() {
        preview.src = reader.result;
        $("#preview-img").loading('stop').hide().fadeIn('slow')
      }, 1000)
    }

    if (file) {
       reader.readAsDataURL(file); //reads the data as a URL
    } else {
       preview.src = "";
    }
  })

  var _URL = window.URL || window.webkitURL;

  $("#img-file").change(function() {
    var file, img;
    if ((file = this.files[0])) {
      img = new Image();
    }
    if ((file = this.files[0])) {
      img = new Image();

      img.onload = function() {
        $('#preview-img').css({ width: this.width, height: this.height })
      };

      img.src = _URL.createObjectURL(file);
    }
  });

  $(function() {
    $.contextMenu({
      selector: '.face-box.new',
      trigger: 'left',
      callback: function(key, options) {
        let faceBox = $(options.$trigger.context)

        if (key === "add") {
          faceBox.attr('personName', prompt("Enter the person's name", ""))
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
    });

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
    });
  });

});
