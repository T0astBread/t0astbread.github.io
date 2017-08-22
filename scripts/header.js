"use strict";
$(document).ready(function () { return $("#banner").on("click", function () { return animatePosition($("body > section").height() * .8, undefined, "swing", snapBackIntoPlace); }); });
