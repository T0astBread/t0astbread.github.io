let mouseDown: boolean, mouseDownOffsetY: number;
let offsetFromBottomAtBeginning: number, standardOffsetFromBottom: number;
let currentlyBeingAnimated: boolean, mouseOverUl: boolean;

let updatePosition = (marginBottom: number) =>
{
    let oldMarginBottom = 0;
    oldMarginBottom = getOffsetFromBottom();
    $("body").css("padding-bottom", marginBottom);
    if(hasHitTop()) updatePosition(marginBottom - 1);
};

let calcOffsetFromBottom = (y: number) => $(document).height() - y;
let getOffsetFromBottom = () => parseInt($("body").css("padding-bottom").replace("px", ""));
let negligibleOffsetFromBottom = () => Math.abs(getOffsetFromBottom()) < 5;
let hasHitTop = () => $("ul").height() <= 2;

let snapBackIntoPlace = () =>
{
    if (!negligibleOffsetFromBottom())
    {
        currentlyBeingAnimated = true;
        $("body").animate(
        {
            "padding-bottom": standardOffsetFromBottom
        }, 1000);
        setTimeout(() => currentlyBeingAnimated = false, 1000);
    }
    else updatePosition(standardOffsetFromBottom);
};

let mouseLost = () =>
{
    if (currentlyBeingAnimated || negligibleOffsetFromBottom() || mouseOverUl) return;
    mouseDown = false;
    snapBackIntoPlace();
};

$(document).ready(() =>
{
    standardOffsetFromBottom = getOffsetFromBottom();

    $(".social-media-links").on("touchmove", evt =>
        {
            updatePosition(calcOffsetFromBottom((evt.originalEvent as TouchEvent).touches[0].pageY));
            evt.preventDefault();
        }).on("mousedown", evt =>
        {
            if (currentlyBeingAnimated) return;
            mouseDown = true;
            mouseDownOffsetY = (evt.originalEvent as MouseEvent).offsetY;
            offsetFromBottomAtBeginning = getOffsetFromBottom();
            evt.preventDefault();
        }).on("touchend", mouseLost)
        .on("mousemove", evt =>
        {
            if (!mouseDown || currentlyBeingAnimated) return;
            let dist = calcOffsetFromBottom((evt.originalEvent as MouseEvent).pageY + mouseDownOffsetY);
            updatePosition(dist);
            evt.preventDefault();
        }).on("click", evt =>
        {
            if (Math.abs(getOffsetFromBottom() - offsetFromBottomAtBeginning) > 10) evt.preventDefault();
        });

        $(document).on("mouseup", mouseLost);

    // $("h2").on("mouseenter", mouseLost);
    // $("ul").on("mouseenter", () => mouseOverUl = true).on("mouseleave", () => mouseOverUl = false);
});
