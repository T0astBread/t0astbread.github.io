let mouseDown: boolean, mouseDownOffsetY: number;
let offsetFromBottomAtBeginning: number, standardOffsetFromBottom: number;
let currentlyBeingAnimated: boolean, mouseOverUl: boolean;

let updatePosition = (marginBottom: number) =>
{
    $("body").css("padding-bottom", marginBottom);
};

let calcOffsetFromBottom = (y: number) =>
{
    return $(document).height() - y;
};

let getOffsetFromBottom = () =>
{
    return parseInt($("body").css("padding-bottom").replace("px", ""));
};

let negligibleOffsetFromBottom = ():boolean =>
{
    return Math.abs(getOffsetFromBottom()) < 5;
}

let snapBackIntoPlace = () =>
{
    if(!negligibleOffsetFromBottom())
    {
        currentlyBeingAnimated = true;
        $("body").animate({"padding-bottom": standardOffsetFromBottom}, 1000);
        setTimeout(() => currentlyBeingAnimated = false, 1000);
    }
    else updatePosition(standardOffsetFromBottom);
};

$(document).ready(() =>
{
    standardOffsetFromBottom = getOffsetFromBottom();

    let mouseLost = () =>
    {
        if(currentlyBeingAnimated || negligibleOffsetFromBottom() || mouseOverUl) return;
        mouseDown = false;
        snapBackIntoPlace();
    };

    $(".social-media-links").on("touchmove", evt =>
    {
        updatePosition(calcOffsetFromBottom((evt.originalEvent as TouchEvent).touches[0].pageY));
        evt.preventDefault();
    }).on("mousedown", evt =>
    {
        if(currentlyBeingAnimated) return;
        mouseDown = true;
        mouseDownOffsetY = (evt.originalEvent as MouseEvent).offsetY;
        offsetFromBottomAtBeginning = getOffsetFromBottom();
        evt.preventDefault();
    }).on("mouseup mouseleave touchend", mouseLost)
    .on("mousemove", evt =>
    {
        if(!mouseDown || currentlyBeingAnimated) return;
        let dist = calcOffsetFromBottom((evt.originalEvent as MouseEvent).pageY + mouseDownOffsetY);
        updatePosition(dist);
        evt.preventDefault();
    }).on("click", evt =>
    {
        if(Math.abs(getOffsetFromBottom() - offsetFromBottomAtBeginning) > 10) evt.preventDefault();
    });

    $("h2").on("mouseenter", mouseLost);
    // $("ul").on("mouseenter", () => mouseOverUl = true).on("mouseleave", () => mouseOverUl = false);
});