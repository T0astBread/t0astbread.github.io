"use strict";
$(document).ready(function () { return $("#banner").on("click", function () { return animatePosition($("body > section").height() * .4, undefined, "swing", snapBackIntoPlace); }); });
