$("#form").submit(function (event) {
  event.preventDefault();
  forgetPassword();
});

function forgetPassword() {
  $("#btn-continue,input").prop("disabled", true);
  $("#btn-continue").html('<span class="spinner-grow spinner-grow-sm align-middle mr-2"></span><span class="spinner-grow spinner-grow-sm align-middle mr-2"></span><span class="mr-2">Loading</span><span class="spinner-grow spinner-grow-sm align-middle mr-2"></span><span class="spinner-grow spinner-grow-sm align-middle"></span>');
  var email = $("#email").val();
  firebase.auth().sendPasswordResetEmail(email).then(function () {
    location.replace(`verification.html?mode=resetPassword&email=${email}`);
  }).catch(function (error) {
    // An error happened.
    var errorMessage = error.message;
    $("#btn-login,input").prop("disabled", false);
    $("#btn-login").html('Loading');
    alert(errorMessage);
  });
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    location.replace("main.html");
  } else {
    // User is signed out.
    // ...
  }
});