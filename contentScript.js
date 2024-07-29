"use strict";

document.addEventListener("click", (event) => {
    if (location.pathname === "/watch") {
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


// timestamp format is "(0(0):)0(0):00"
// () is or
function isTimestamp(ele) {
    let str = ele.textContent;

    let ctColon = 0
    let ctNumBtwColon = 0
    for (let i = 0; i < str.length; i++) {
        if (str[i] === ":")
            if (ctNumBtwColon === 1 || ctNumBtwColon === 2) {
                ctNumBtwColon = 0;
                ctColon++;
            }
            else return false

        else if ("0" <= str[i] && str[i] <= "9") ctNumBtwColon++
        else return false;
    }
    if (ctNumBtwColon === 2 && (ctColon === 1 || ctColon === 2)) return true;
    else return false;
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