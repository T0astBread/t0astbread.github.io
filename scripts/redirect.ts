const INITIAL_REDIRECT_TIMOUT = 5;
const REDIRECT_URL = "https://t0ast.cc";

let remainingTimeUntilRedirect = INITIAL_REDIRECT_TIMOUT;

$(document).ready(() => {
	if(location.hash.indexOf("no-redirect") !== -1) {
		$(".redirect-overlay").hide();
		return
	}

	const redirectClocks = $(".redirect-clock");

	const redirectTimerInterval = setInterval(() => {
		if(remainingTimeUntilRedirect <= 0) redirect();
		else redirectClocks.text(--remainingTimeUntilRedirect);
	}, 1000);

	$(".redirect-abort-button").click(() => clearInterval(redirectTimerInterval));
})

const redirect = () => window.location.assign(REDIRECT_URL);
