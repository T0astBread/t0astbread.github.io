let mouseDown: boolean, mouseDownOffsetY: number
let offsetFromBottomAtBeginning: number, standardOffsetFromBottom: number
let currentlyBeingAnimated: boolean, mouseOverUl: boolean

const updatePosition = (marginBottom: number) => {
    let oldMarginBottom = 0
    oldMarginBottom = getOffsetFromBottom()
    $("body").css("padding-bottom", marginBottom)
    if (hasHitTop()) updatePosition(marginBottom - 1)
}

const calcOffsetFromBottom = (y: number) => $(document).height() - y
const getOffsetFromBottom = () => parseInt($("body").css("padding-bottom").replace("px", ""))
const negligibleOffsetFromBottom = () => Math.abs(getOffsetFromBottom()) < 5
const hasHitTop = () => $("ul#repos-list").height() <= 2

const animatePosition = (targetOffsetFromBottom: number, duration: number = 1000, easingFunction: string = "easeOutBounce", onFinishCallback: (() => void)|undefined = undefined) => {
    currentlyBeingAnimated = true
    $("body").animate({"padding-bottom": targetOffsetFromBottom}, {
        duration: duration,
        easing: easingFunction
    })
    setTimeout(() => {
        currentlyBeingAnimated = false
        if(onFinishCallback) onFinishCallback()
    }, 1000)
}

const snapBackIntoPlace = (duration: number|undefined = undefined, easingFunction: string|undefined = undefined) => {
    if (!negligibleOffsetFromBottom()) animatePosition(standardOffsetFromBottom, duration, easingFunction)
    else updatePosition(standardOffsetFromBottom)
}

const mouseMove = (evt: JQueryEventObject) => {
    if (!mouseDown || currentlyBeingAnimated) return
    let dist = calcOffsetFromBottom((evt.originalEvent as MouseEvent).pageY + mouseDownOffsetY)
    updatePosition(dist)
    evt.preventDefault()
}

const mouseLost = () => {
    if (currentlyBeingAnimated || negligibleOffsetFromBottom() || mouseOverUl) return
    mouseDown = false
    snapBackIntoPlace()
}

$(document).ready(() => {
    standardOffsetFromBottom = getOffsetFromBottom()

    $(".social-media-links")
        .on("touchmove", evt => {
            updatePosition(calcOffsetFromBottom((evt.originalEvent as TouchEvent).touches[0].pageY))
            evt.preventDefault()
        })
        .on("mousedown", evt => {
            if (currentlyBeingAnimated) return
            mouseDown = true
            mouseDownOffsetY = (evt.originalEvent as MouseEvent).offsetY
            offsetFromBottomAtBeginning = getOffsetFromBottom()
            evt.preventDefault()
        })
        .on("touchend", mouseLost)
        .on("click", evt => {
            if (Math.abs(getOffsetFromBottom() - offsetFromBottomAtBeginning) > 10) evt.preventDefault()
        })

    $(document)
        .on("mouseup", mouseLost)
        .on("mousemove", mouseMove)
})
