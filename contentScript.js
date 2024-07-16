"use strict";

//
// chapterをクリックするとき、endpointの子要素のどれかをクリックすることになる。
// 最大3回まで親要素をたどって、endpointが見つける。
//

// chapterのendpointか判定
function is_endpoint(ele, re) {
    return (ele &&
        ele.tagName == "A" &&
        ele.getAttribute("id") == "endpoint" &&
        ele.classList.value == "yt-simple-endpoint style-scope ytd-macro-markers-list-item-renderer" &&
        re.test(ele.getAttribute("href"))
    );
}

// chapterのendpointを返す
function return_endpoint(ele, re) {
    for (let i = 0; i < 4; i++) {
        if (!ele) break;
        if (is_endpoint(ele, re)) {
            return ele;
        }
        ele = ele.parentElement;
    }
    return null;
}

function getTime(re, ele) {
    const time = ele.getAttribute("href").match(re)[0].slice(16, -1);
    if (time === "") return 0;
    else return time;
}

function changeVideoTime(time) {
    document.querySelector("video").currentTime = parseInt(time);
}

// クリックした時
document.addEventListener("click", (event) => {
    const videoID = location.search.slice(3, 14);

    const regexpTimestampUrl = RegExp(`v=${videoID}(&t=[0-9]+s)?`);

    let target_ele = event.target;

    /*
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
    */

    // if only comment
    if (isTimestamp(target_ele)) {
        //web翻訳処理 toTimestamp();
        if (isTimestampOnThisVideo(regexpTimestampUrl, target_ele)) {
            const time = getTime(regexpTimestampUrl, target_ele);
            changeVideoTime(time);
            preventScrolling(event);
            log(time);
        }
    }

    // chapter
    const endpoint = return_endpoint(target_ele, regexpTimestampUrl);
    if (endpoint) {
        const time = getTime(endpoint, regexpTimestampUrl);

        const videoEle = document.querySelector("video");

        videoEle.currentTime = parseInt(time);

        preventScrolling(event);

        log(time);
        return;
    }
}, { capture: true })

//
// "00:00" or "00:00:00" format is timestamp
//

function isTimestamp(ele) {
    const shortFmt = "00:00";
    const longFmt = "00:00:00";

    const str = ele.textContent;
    switch (str.length) {
        case shortFmt.length:
            return isTimestampFmt(str);
        case longFmt.length:
            return isTimestampFmt(str);
        default:
            return false;
    }
}

function isTimestampFmt(str) {
    for (let i = 0; i < str.length; i++) {
        if (i % 3 == 2) {
            if (str[i] !== ":") return false;
        } else {
            if (str[i] < "0" || "9" < str[i]) return false;
        }
    }
    return true;
}

function isTimestampOnThisVideo(re, ele) {
    const url = ele.getAttribute("href");
    if (url === null) return false;
    return re.test(url);
}

function preventScrolling(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
}

// if successful
function log(time) {
    console.log(`time: ${time}`);
    console.log("prevent scrolling!");
}