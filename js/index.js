$("#form").submit(function (event) {
  event.preventDefault();
  login();
});

function login() {
  $("#btn-login,input").prop("disabled", true);
  $("#btn-login").html('<span class="spinner-grow spinner-grow-sm align-middle mr-2"></span><span class="spinner-grow spinner-grow-sm align-middle mr-2"></span><span class="mr-2">Loading</span><span class="spinner-grow spinner-grow-sm align-middle mr-2"></span><span class="spinner-grow spinner-grow-sm align-middle"></span>');
  var email = $("#email").val();
  var password = $("#password").val();
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    $("#btn-login,input").prop("disabled", false);
    $("#btn-login").html('Loading');
    alert(errorMessage);
  });
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user && !user.emailVerified) {
    // User is signed in.
    user.sendEmailVerification().then(function () {
      // Email sent.
      location.replace("/verification?mode=verifyEmail");
    }).catch(function (error) {
      // An error happened.
      alert(error.message);
    });
  } else if (user) {
    location.replace("main.html");
  } else {
    // User is signed out.
    // ...
  }
});
