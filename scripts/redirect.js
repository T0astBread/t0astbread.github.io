"use strict";
var INITIAL_REDIRECT_TIMOUT = 5;
var REDIRECT_URL = "https://t0ast.cc";
var remainingTimeUntilRedirect = INITIAL_REDIRECT_TIMOUT;
$(document).ready(function () {
    if (location.hash.indexOf("no-redirect") !== -1) {
        $(".redirect-overlay").hide();
        return;
    }
    var redirectClocks = $(".redirect-clock");
    var redirectTimerInterval = setInterval(function () {
        if (remainingTimeUntilRedirect <= 0)
            redirect();
        else
            redirectClocks.text(--remainingTimeUntilRedirect);
    }, 1000);
    $(".redirect-abort-button").click(function () { return clearInterval(redirectTimerInterval); });
});
var redirect = function () { return window.location.assign(REDIRECT_URL); };
