$("#btn-signout").click(function () { signOut(); });

function signOut() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user && user.emailVerified) {
        // User is signed in.
        $("body").show();
    } else {
        // User is signed out.
        location.replace("/");
    }
});
