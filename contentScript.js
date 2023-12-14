"use strict";

// クリックした時
document.addEventListener("click", (event) => {

    // 動画再生ページかどうか
    if (location.pathname == "/watch") {

        const videoID = location.search.slice(3);

        const re = RegExp(`t=[0-9]+s`);

        // クリックしたリンクがタイムスタンプかどうか
        if (event.target.tagName == "A" &&

            event.target.classList.value == "yt-simple-endpoint style-scope yt-formatted-string" &&

            re.test(event.target.getAttribute("href"))
        ) {
            const time = event.target.getAttribute("href").match(re)[0].slice(2, -1);

            const videoEle = document.querySelector("video");

            console.log(time);

            videoEle.currentTime = parseInt(time);

            event.preventDefault();

            event.stopPropagation();

            event.stopImmediatePropagation();
        }
    }

}, { capture: true })
