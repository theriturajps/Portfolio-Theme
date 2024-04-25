var mode, email;
$(document).ready(function () {
    function getParameterByName(name) {
        var res = new RegExp(
            // Parameter names always start after a ? or &.
            '[\?&]' +

            // Make sure any [ or ] are escaped in the name.
            name.replace(/\[/g, '\\\[').replace(/\]/g, '\\\]') +

            // Either match a =... or match an empty value.
            // Values can be terminated by an & a # or the end of the string ($).
            '(?:=([^&#]*))?(?:[&#]|$)'
        ).exec(window.location.search);

        return res ?
            (res[1] ? // res[1] will be undefined for a parameter without value.
                decodeURIComponent(res[1].replace(/\+/g, ' ')) : ''
            ) : null;
    }
    mode = getParameterByName('mode');
    email = getParameterByName('email');
    setTimeout(function () { display(mode); }, 500);
});

window.onload = function () {
    setTimeout(function () {
        var reloading = sessionStorage.getItem("reloading");
        if (reloading) {
            sessionStorage.removeItem("reloading");
            resend();
        }
    }, 2000);
}

function verify() {
    if ('verifyEmail' === mode) {
        $("#root").html('<div id="verify" class="container text-center border border-success shadow pb-2 mt-2 rounded-lg"><div class="d-flex flex-column"><div id="head1" class="display-4">RituRajPS</div><div class="mt-3 mx-auto d-flex flex-row"><div class="mt-1 material-icons text-success">check_circle</div><p style="margin:1.7px 0px 0px 0px;" class="font-weight-light lead text-break text-monospace"> A verification link has been sent to your email address</p></div><hr class="w-100 bg-secondary" /><div id="text1" class="text-left">Please click on the link to verify your email account.</div><div id="text1" class="mt-2 text-left text-primary">Did\'nt receive verification link?<button id="btn-resend" type="button" class="mt-n2 ml-2 text-center btn btn-success btn-sm">Resend link</button></div></div></div>');
    } else if ('resetPassword' === mode) {
        $("#root").html('<div id="verify" class="container text-center border border-primary shadow pb-2 mt-2 rounded-lg"><div class="d-flex flex-column"><div id="head1" class="display-4">RituRajPS</div><div class="mt-3 mx-auto d-flex flex-row"><div class="mt-1 material-icons text-primary">check_circle</div><p style="margin:1.7px 0px 0px 0px;" class="font-weight-light lead text-break text-monospace">A password reset link has been sent to your email address</p></div><hr class="w-100 bg-secondary" /><div id="text1" class="text-left">Please follow the link to change your password.</div><div id="text1" class="mt-2 text-left text-dark">Did\'nt receive link?<button id="btn-resend" type="button" class="mt-n2 ml-2 text-center btn btn-primary btn-sm">Resend link</button></div></div></div>');
    }
    $("#btn-resend").click(function () {
        sessionStorage.setItem("reloading", "true");
        location.reload();
    });
    setTimeout(function () { $('body').show(); }, 500);
}

function resend() {
    if ("verifyEmail" === mode) {
        var user = firebase.auth().currentUser;
        if (user.emailVerified) {
            $('body').hide();
            alert("Email verified");
        } else {
            user.sendEmailVerification().then(function () {
                // Email sent.
                alert("Verification link sent.");
            }).catch(function (error) {
                // An error happened.
                alert(error.message);
                console.log(error.message);
            });
        }
    } else if ("resetPassword" === mode) {
        firebase.auth().sendPasswordResetEmail(email).then(function () {
            // Email sent.
            alert("Password reset link sent.");
        }).catch(function (error) {
            // An error happened.
            var errorMessage = error.message;
            alert(errorMessage);
        });
    }
}

function display(mode) {
    if ("verifyEmail" === mode) {
        var user = firebase.auth().currentUser;
        if (user && !user.emailVerified) {
            verify();
        }
    } else if ("resetPassword" === mode) {
        verify();
    }
}
