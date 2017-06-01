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
};
var calcOffsetFromBottom = function (y) { return $(document).height() - y; };
var getOffsetFromBottom = function () { return parseInt($("body").css("padding-bottom").replace("px", "")); };
var negligibleOffsetFromBottom = function () { return Math.abs(getOffsetFromBottom()) < 5; };
var hasHitTop = function () { return $("ul").height() <= 2; };
var snapBackIntoPlace = function () {
    if (!negligibleOffsetFromBottom()) {
        currentlyBeingAnimated = true;
        $("body").animate({
            "padding-bottom": standardOffsetFromBottom
        }, 1000);
        setTimeout(function () { return currentlyBeingAnimated = false; }, 1000);
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
