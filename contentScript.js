"use strict";

// クリックした時
document.addEventListener("click", (event) => {

    // 動画再生ページかどうか
    if (location.pathname == "/watch") {

        const re = RegExp(`t=[0-9]+s`);

        let target_ele = event.target;

        // web翻訳している場合のため
        if (target_ele.tagName == "FONT" &&

            target_ele.getAttribute("style") == "vertical-align: inherit;" &&

            target_ele.parentElement &&

            target_ele.parentElement.tagName == "FONT" &&

            target_ele.parentElement.getAttribute("style") == "vertical-align: inherit;" &&

            target_ele.parentElement.parentElement
        ) {
            target_ele = target_ele.parentElement.parentElement;
        }

        // クリックしたリンクがタイムスタンプかどうか
        if (target_ele.tagName == "A" &&

            (target_ele.classList.value == "yt-simple-endpoint style-scope yt-formatted-string" ||
                target_ele.classList.value == "yt-core-attributed-string__link yt-core-attributed-string__link--display-type yt-core-attributed-string__link--call-to-action-color"
            ) &&

            re.test(target_ele.getAttribute("href"))
        ) {
            const time = target_ele.getAttribute("href").match(re)[0].slice(2, -1);

            const videoEle = document.querySelector("video");

            videoEle.currentTime = parseInt(time);

            event.preventDefault();

            event.stopPropagation();

            event.stopImmediatePropagation();

            // debug用
            console.log(`time: ${time}`);
            console.log("prevent scroll!");
        }
    }

}, { capture: true })
