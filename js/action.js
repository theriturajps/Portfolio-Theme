var actionCode, accountEmail;
document.addEventListener('DOMContentLoaded', function () {
    // TODO: Implement getParameterByName()
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
    // Get the action to complete.
    var mode = getParameterByName('mode');
    // Get the one-time code from the query parameter.
    actionCode = getParameterByName('oobCode');
    // (Optional) Get the continue URL from the query parameter if available.
    var continueUrl = getParameterByName('continueUrl');
    // (Optional) Get the language code if available.
    var lang = getParameterByName('lang') || 'en';
    var auth = firebase.auth();
    // Handle the user management action.
    switch (mode) {
        case 'resetPassword':
            // Display reset password handler and UI.
            handleResetPassword(auth, actionCode, continueUrl, lang);
            break;
        case 'recoverEmail':
            // Display email recovery handler and UI.
            handleRecoverEmail(auth, actionCode, lang);
            break;
        case 'verifyEmail':
            // Display email verification handler and UI.
            handleVerifyEmail(auth, actionCode, continueUrl, lang);
            break;
        default:
        // Error: invalid mode.
    }
}, false);

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

function handleVerifyEmail(auth, actionCode, continueUrl, lang) {
    // Localize the UI to the selected language as determined by the lang
    // parameter.
    // Try to apply the email verification code.
    auth.applyActionCode(actionCode).then(function (resp) {
        // Email address has been verified.
        // TODO: Display a confirmation message to the user.
        // You could also provide the user with a link back to the app.
        document.title = "Verified";
        $("#root").html('<div id="verify" class="container text-center border border-success shadow pb-2 mt-2 rounded-lg"><div class="d-flex flex-column"><div id="head1" class="display-4">RusHour</div><div class="mt-3 mx-auto d-flex flex-row"><div class="mt-1 material-icons text-success">verified</div><p style="margin:1.7px 0px 0px 0px;" class="font-weight-light lead text-break text-monospace">Your email address has been verified.</p></div><hr class="w-100 bg-secondary" /><div id="text1" class="text-left">Please click on continue to proceed.</div><button id="btn-continue" type="button" class="mt-1 text-center btn btn-success text-monospace">Continue</button></div></div>');
        $("#btn-continue").click(function () { location.replace("https://riturajps-firebase.netlify.app/email-authentication/main"); });
        // TODO: If a continue URL is available, display a button which on
        // click redirects the user back to the app via continueUrl with
        // additional state determined from that URL's parameters.
    }).catch(function (error) {
        // Code is invalid or expired. Ask the user to verify their email address
        // again.
        alert(error.message);
    });
}

function handleResetPassword(auth, actionCode, continueUrl, lang) {
    // Localize the UI to the selected language as determined by the lang
    // parameter.
    // Verify the password reset code is valid.
    auth.verifyPasswordResetCode(actionCode).then(function (email) {
        // TODO: Show the reset screen with the user's email and ask the user for
        // the new password.
        // Save the new password.
        document.title = "Reset Password";
        accountEmail = email;
        $("#root").html('<div id="reset" class="mx-auto shadow-lg bg-white m-5 p-3 border border-info rounded-lg"><div class="d-flex flex-column"><h1 id="head1" class="text-center">RusHour</h1><div class="text-center text-monospace mt-2 mb-2">Reset password for email address <span id="email" class="font-weight-bold text-dark"></span></div><form id="form"><div class="form-group pt-2"><input id="password" type="password" class="form-control" placeholder="New Password" required></div><div id="password-validity" class="d-none flex-row mt-n2 text-danger"><div id="password-icon" class="material-icons">error_outline</div><div style="margin: -1.6px 0px 0px 2px;" class="small">Password must be at least 6 characters.</div></div><div class="form-group pt-2"><input id="confirm-password" type="password" class="form-control" placeholder="Confirm New Password" required></div><div id="confirm-password-validity" class="d-none flex-row mt-n2 text-danger"><div id="password-icon" class="material-icons">error_outline</div><div style="margin: -1.6px 0px 6px 2px;" class="small">Passwords do not match.</div></div><button id="btn-reset" type="submit" class="text-monospace mt-1 btn btn-primary btn-block">Reset Password</button></form></div></div>');
        $("#email").html(email);
        $("#password,#confirm-password").on('input', function () { passwordCheck(event.currentTarget); });
        $("#root").show();
        $("#form").submit(function (event) {
            event.preventDefault();
            if (!$("#password-validity,#confirm-password-validity").hasClass("d-flex")) {
                resetPassword(actionCode);
            }
        });
    }).catch(function (error) {
        // Invalid or expired action code. Ask user to try to reset the password
        // again.
        alert(error.message);
    });
}

function resetPassword(code) {
    $("input").prop("disabled", true);
    $("#btn-reset").html('<span class="spinner-grow spinner-grow-sm align-middle mr-2"></span><span class="spinner-grow spinner-grow-sm align-middle mr-2"></span><span class="spinner-grow spinner-grow-sm align-middle mr-2"></span><span class="mr-2">Please Wait</span><span class="spinner-grow spinner-grow-sm align-middle mr-2"></span><span class="spinner-grow spinner-grow-sm align-middle mr-2"></span><span class="spinner-grow spinner-grow-sm align-middle"></span>');
    var newPassword = $("#password").val();
    firebase.auth().confirmPasswordReset(code, newPassword).then(function (resp) {
        // Password reset has been confirmed and new password updated.
        // TODO: Display a link back to the app, or sign-in the user directly
        // if the page belongs to the same domain as the app:
        $("#root").html('<div id="updated" class="container text-center border border-success shadow pb-2 mt-2 rounded-lg"><div class="d-flex flex-column"><div id="head1" class="display-4">RusHour</div><div class="mt-3 mx-auto d-flex flex-row"><div class="mt-1 material-icons text-success">verified</div><p style="margin:1.7px 0px 2px 1px;" class="font-weight-light lead text-break text-monospace">Your password has been updated.</p></div></div>');
        setTimeout(() => {
            firebase.auth().signInWithEmailAndPassword(accountEmail, newPassword).catch(function (error) {
                // Handle Errors here.
                var errorMessage = error.message;
                alert(errorMessage);
            });
        }, 500);
        // TODO: If a continue URL is available, display a button which on
        // click redirects the user back to the app via continueUrl with
        // additional state determined from that URL's parameters.
    }).catch(function (error) {
        // Error occurred during confirmation. The code might have expired or the
        // password is too weak.
        alert(error.message);
    });
}