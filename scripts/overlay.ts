$(document).ready(() => {
	$(".overlay").each((index, element) => {
		$(element).find("button.close-button").click(() => element.classList.add("closed"))
	})
})