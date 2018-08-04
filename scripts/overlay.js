"use strict";
$(document).ready(function () {
    $(".overlay").each(function (index, element) {
        $(element).find("button.close-button").click(function () { return element.classList.add("closed"); });
    });
});
