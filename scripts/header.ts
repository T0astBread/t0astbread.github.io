$(document).ready(() =>
    $("#banner")
        .on("click", () =>
            animatePosition(
                    $("body > section").height() * .4,
                    undefined,
                    "swing",
                    snapBackIntoPlace
                )
            )
        )