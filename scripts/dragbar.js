"use strict";
var mouseDown, mouseDownOffsetY;
var offsetFromBottomAtBeginning, standardOffsetFromBottom;
var currentlyBeingAnimated, mouseOverUl;
var updatePosition = function (marginBottom) {
    var oldMarginBottom = 0;
    oldMarginBottom = getOffsetFromBottom();
    $("body").css("padding-bottom", marginBottom);
    if (hasHitTop())
        updatePosition(marginBottom - 1);
    updateSecret(getOffsetFromBottom());
};
var calcOffsetFromBottom = function (y) { return $(document).height() - y; };
var getOffsetFromBottom = function () { return parseInt($("body").css("padding-bottom").replace("px", "")); };
var negligibleOffsetFromBottom = function () { return Math.abs(getOffsetFromBottom()) < 5; };
var hasHitTop = function () { return $("ul").height() <= 2; };
var updateSecret = function (offsetFromBottom) {
    var newText = offsetFromBottom > $(".secret-inner").offset().top * .5 ?
        "Yes, you found a secret!" : "Could this be a secret?";
    var secret = $(".secret-inner > div");
    if (secret.text() === newText)
        return;
    secret.text(newText);
    secret.css("opacity", "0");
    secret.animate({
        opacity: 1
    }, 1000);
};
var animatePosition = function (targetOffsetFromBottom, duration, easingFunction, onFinishCallback) {
    if (duration === void 0) { duration = 1000; }
    if (easingFunction === void 0) { easingFunction = "easeOutBounce"; }
    if (onFinishCallback === void 0) { onFinishCallback = undefined; }
    updateSecret(targetOffsetFromBottom);
    currentlyBeingAnimated = true;
    $("body").animate({
        "padding-bottom": targetOffsetFromBottom
    }, {
        duration: duration,
        easing: easingFunction
    });
    setTimeout(function () {
        currentlyBeingAnimated = false;
        if (onFinishCallback)
            onFinishCallback();
    }, 1000);
};
var snapBackIntoPlace = function (duration, easingFunction) {
    if (duration === void 0) { duration = undefined; }
    if (easingFunction === void 0) { easingFunction = undefined; }
    if (!negligibleOffsetFromBottom()) {
        animatePosition(standardOffsetFromBottom, duration, easingFunction);
    }
    else
        updatePosition(standardOffsetFromBottom);
};
var mouseLost = function () {
    if (currentlyBeingAnimated || negligibleOffsetFromBottom() || mouseOverUl)
        return;
    mouseDown = false;
    snapBackIntoPlace();
};
$(document).ready(function () {
    standardOffsetFromBottom = getOffsetFromBottom();
    $(".social-media-links").on("touchmove", function (evt) {
        updatePosition(calcOffsetFromBottom(evt.originalEvent.touches[0].pageY));
        evt.preventDefault();
    }).on("mousedown", function (evt) {
        if (currentlyBeingAnimated)
            return;
        mouseDown = true;
        mouseDownOffsetY = evt.originalEvent.offsetY;
        offsetFromBottomAtBeginning = getOffsetFromBottom();
        evt.preventDefault();
    }).on("touchend", mouseLost)
        .on("mousemove", function (evt) {
        if (!mouseDown || currentlyBeingAnimated)
            return;
        var dist = calcOffsetFromBottom(evt.originalEvent.pageY + mouseDownOffsetY);
        updatePosition(dist);
        evt.preventDefault();
    }).on("click", function (evt) {
        if (Math.abs(getOffsetFromBottom() - offsetFromBottomAtBeginning) > 10)
            evt.preventDefault();
    });
    $(document).on("mouseup", mouseLost);
    // $("h2").on("mouseenter", mouseLost);
    // $("ul").on("mouseenter", () => mouseOverUl = true).on("mouseleave", () => mouseOverUl = false);
});
