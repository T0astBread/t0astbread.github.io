$(document).ready(() => $("#banner").on("click", () => animatePosition($("body > section").height() * .8, undefined, "swing", snapBackIntoPlace)));