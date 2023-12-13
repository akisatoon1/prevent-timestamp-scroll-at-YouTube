"use strict";

document.addEventListener("click", (event) => {
    if (location.pathname == "/watch") {
        const videoID = location.search.slice(3);
        const re = RegExp(`t=[0-9]+s`);
        if (event.target.tagName == "A" &&
            event.target.classList.value == "yt-simple-endpoint style-scope yt-formatted-string" &&
            re.test(event.target.getAttribute("href"))
        ) {
            const time = event.target.getAttribute("href").slice(-3, -1);
            const videoEle = document.querySelector("video");
            videoEle.currentTime = time;
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
    }

}, { capture: true })
