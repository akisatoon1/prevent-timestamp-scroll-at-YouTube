"use strict";

document.addEventListener("click", (event) => {
    const videoID = location.search.slice(3, 14);

    const targetEle = event.target;

    // if timestamp, handle timestamp
    if (isTimestamp(targetEle)) {
        const linkEle = toOriginal(targetEle);
        if (isOnThisVideo(videoID, linkEle)) {
            const time = getTime(linkEle);
            changeVideoTime(time);
            preventScrolling(event);
            log(time);
            return;
        }
    }

    // chapter
    const endpoint = getEndpoint(videoID, toOriginal(targetEle));
    if (endpoint) {
        const time = getTime(endpoint);
        changeVideoTime(time);
        preventScrolling(event);
        log(time);
        return;
    }
}, { capture: true })

//
// endpointとはvideoのタイム付きのリンク
// chapterをクリックするとき、endpointの子要素のどれかをクリックすることになる。
// 最大3回まで親要素をたどって、endpointが見つける。
//

// chapterのendpointか判定
function isEndpoint(videoId, ele) {
    return (ele &&
        ele.tagName === "A" &&
        ele.getAttribute("id") === "endpoint" &&
        getParam(ele.getAttribute("href"), "v") === videoId &&
        getParam(ele.getAttribute("href"), "t") !== null
    );
}

// chapterのendpointを返す
function getEndpoint(videoId, ele) {
    for (let i = 0; i < 4; i++) {
        if (!ele) break;
        if (isEndpoint(videoId, ele)) {
            return ele;
        }
        ele = ele.parentElement;
    }
    return null;
}

//
// "00:00" or "00:00:00" format is timestamp
//

function isTimestamp(ele) {
    const shortFmt = "00:00";
    const longFmt = "00:00:00";

    const text = ele.textContent;
    switch (text.length) {
        case shortFmt.length:
            return isTimestampFmt(text);
        case longFmt.length:
            return isTimestampFmt(text);
        default:
            return false;
    }
}

// format "00:00:00: ..."
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

// 別動画へのタイムスタンプもあるため
// timestamp link's 'href' field value must have param as 'v=[videoId]'
function isOnThisVideo(videoId, ele) {
    const url = ele.getAttribute("href");
    if (url === null) return false;

    if (getParam(url, "v") === videoId) return true;
    else return false;
}

// if web translation
function toOriginal(ele) {
    if (ele.tagName === "FONT") return ele.parentElement.parentElement;
    else return ele;
}

function getParam(url, key) {
    try {
        return new URL(url, "https://www.youtube.com/watch").searchParams.get(key);
    } catch (err) {
        if (err === TypeError) return null;
        else handleUnexpectedErr(err);
    }
}

// get time seconds from link url
function getTime(ele) {
    const time = getParam(ele.getAttribute("href"), "t");
    if (time === null) return "0";
    else return time;
}

function changeVideoTime(time) {
    document.querySelector("video").currentTime = parseInt(time);
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

function handleUnexpectedErr(err) {
    console.log(err);
}