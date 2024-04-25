$("#form").submit(function (event) {
  event.preventDefault();
  signup();
});
$("#email").change(function () { inputChange(event.currentTarget); });
$("#password,#confirm-password").on('input', function () { passwordCheck(event.currentTarget); });

function inputChange(e) {
  switch (e.id) {
    case 'email': if (e.validity.valid === false) {
      $("#email-validity").addClass("d-flex");
    } else {
      $("#email-validity").removeClass("d-flex");
    }
      break;
  }
}

function passwordCheck(e) {
  switch (e.id) {
    case 'password': if (e.value.length < 6) {
      $("#password-validity").addClass("d-flex");
    } else {
      $("#password-validity").removeClass("d-flex");
    }
      if (e.value.length < 6 && $("#confirm-password").val().length != 0) {
        $("#confirm-password-validity").addClass("d-flex");
      } else {
        $("#confirm-password-validity").removeClass("d-flex");
      }
      if (e.value.localeCompare($("#confirm-password").val()) && $("#confirm-password").val().length != 0) {
        $("#confirm-password-validity").addClass("d-flex");
      } else {
        $("#confirm-password-validity").removeClass("d-flex");
      }
      break;
    case 'confirm-password': if (e.value.localeCompare($("#password").val())) {
      $("#confirm-password-validity").addClass("d-flex");
    } else {
      $("#confirm-password-validity").removeClass("d-flex");
    }
      break;
  }
}

function signup() {
  $("#btn-signup,input").prop("disabled", true);
  $("#btn-signup").html('<span class="spinner-grow spinner-grow-sm align-middle mr-2"></span><span class="spinner-grow spinner-grow-sm align-middle mr-2"></span><span class="spinner-grow spinner-grow-sm align-middle mr-2"></span><span class="mr-2">Please Wait</span><span class="spinner-grow spinner-grow-sm align-middle mr-2"></span><span class="spinner-grow spinner-grow-sm align-middle mr-2"></span><span class="spinner-grow spinner-grow-sm align-middle"></span>');
  var name = $("#fname").val() + " " + $("#lname").val();
  var gender = $("input[name='gender']:checked").val();
  var email = $("#email").val();
  var password = $("#password").val();
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
    verifyEmail(name);
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    $("#btn-signup,input").prop("disabled", false);
    $("#btn-signup").html('Sign up');
    alert(errorMessage);
  });
}

function verifyEmail(name) {
  var user = firebase.auth().currentUser;
  user.updateProfile({
    displayName: name
  }).then(function () {
    // Update successful.
    user.sendEmailVerification().then(function () {
      // Email sent.
      location.replace("/verification?mode=verifyEmail");
    }).catch(function (error) {
      // An error happened.
      alert(error.message);
    });
  }).catch(function (error) {
    // An error happened.
    alert(error.message);
  });
}
