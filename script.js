// ==UserScript==
// @name         Tweetdeck tweaks
// @namespace    http://tampermonkey.net/
// @description  Customizes my own Tweetdeck experience. It's unlikely someone else will enjoy this.
// @copyright    WTFPL
// @source       https://github.com/B1773rm4n/Tweetdeck_Greasemonkey
// @version      1.5.1
// @author       B1773rm4n
// @match        https://*.twitter.com/*
// @connect      githubusercontent.com
// @icon         https://icons.duckduckgo.com/ip2/twitter.com.ico
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// ==/UserScript==

let arrayListNames

(async function start() {

    arrayListNames = await returnNamesFromArrayList()

    // wait until the page is sufficiently loaded
    let waitThreeSecs = new Promise((resolve) => setTimeout(resolve, 3000))
    await waitThreeSecs

    if (document.URL.indexOf('https://twitter.com/') > -1) {

        await showInListTwitter()

        // watch for changes
        watchDomChangesObserver()

    } else if (document.URL.indexOf('https://tweetdeck.twitter.com/' > -1)) {
        // check if a new element is loaded and do something
        observeTimelineForNewPosts()

        // general css changes
        addStyles()

        // observer for the fullscreen picture improvements
        fullScreenModal()

        doTweetdeckActions()
    } else {
        console.log('cant find domain')
    }

})();

function watchDomChangesObserver() {

    let currentLocation = document.location.href

    const domTreeElementToObserve = document.getElementsByTagName('main')[0]
    const config = { attributes: false, childList: true, subtree: true };

    const observer = new MutationObserver((mutationList) => {
        if (currentLocation !== document.location.href) {
            // location changed!
            currentLocation = document.location.href;

            console.log('location changed!');
            showInListTwitter()
        }
    });

    observer.observe(domTreeElementToObserve, config);

}

function observeTimelineForNewPosts() {

    const [targetNodeLeft, targetNodeRight] = document.getElementsByClassName("js-column");
    const config = { attributes: false, childList: true, subtree: true };

    const callback = () => {
        doTweetdeckActions()
    }

    const observer = new MutationObserver(callback);

    observer.observe(targetNodeLeft, config);
    observer.observe(targetNodeRight, config);

}

async function showInListTwitter() {

    if (document.URL.indexOf('https://twitter.com/') > -1) {
        if (window.location.href.indexOf('status') > 0) {
            let nameElementTemp = await runWhenReady("div[data-testid='User-Name']")
            var nameElement = nameElementTemp.children[1]?.firstChild?.firstChild?.firstChild?.firstChild?.firstChild
        } else {
            let nameElementTemp = await runWhenReady("div[data-testid='UserName']")
            var nameElement = nameElementTemp?.firstChild?.firstChild?.children[1]?.firstChild?.firstChild?.firstChild?.firstChild
        }

        let currentlyDisplayedElementName = nameElement.textContent
        let inNameInList = arrayListNames.includes(currentlyDisplayedElementName)

        if (inNameInList) {
            nameElement.style.color = "green"
        } else {
            nameElement.style.color = "red"
        }
    }
}

function doTweetdeckActions() {
    styleNameOfPost()
    removeShowThisthreadTweetdeck()
    removeRetweetedTweetdeck()
}

function styleNameOfPost() {
    let usernameArray = document.getElementsByClassName('username')

    for (let index = 1; index < usernameArray.length; index++) {
        let element = usernameArray[index];

        // cut the name field so the name_id can be seen always
        let nameField = element.previousSibling.previousSibling
        nameField.style.display = 'inherit'
        nameField.style.width = '120px'
        nameField.style.overflow = 'clip'

        // color the name_id field if already in list or not
        let currentlyDisplayedElementName = element.innerHTML
        let inNameInList = arrayListNames.includes(currentlyDisplayedElementName)
        if (inNameInList) {
            element.style.color = "green"
        } else {
            element.style.color = "red"
        }
    }
}

function removeShowThisthreadTweetdeck() {
    let list = document.getElementsByClassName('js-show-this-thread')

    for (let index = 1; index < list.length; index++) {
        let element = list[index];
        element.remove()
    }
}

function removeRetweetedTweetdeck() {
    let retweeted = document.getElementsByClassName('nbfc')

    for (let index = 1; index < retweeted.length; index++) {
        let element = retweeted[index];

        // ignore gif wrapper
        // "js-media-gif-container", "media-item", "nbfc", "media-size-large"
        if (element.classList.length == 4) {
            continue
        }

        // remove retweeted word
        element?.childNodes[2]?.remove()

        // remove self retweet mention
        let accountName = element?.parentNode?.nextElementSibling?.firstElementChild?.children[1]?.firstElementChild?.firstElementChild?.innerText

        if (accountName == element?.innerText) {
            element.remove()
        }
    }
}


function returnNamesFromArrayList() {

    return new Promise((resolve, reject) => GM_xmlhttpRequest({
        method: "GET",
        url: "https://raw.githubusercontent.com/B1773rm4n/Tweetdeck_Greasemonkey/main/list.array",
        headers: {
            "Content-Type": "application/json"
        },
        onload: function (response) {
            let arr = response.responseText.split('\n');
            resolve(arr);
        },
        onerror: reject
    }));
}

function fullScreenModal() {
    const targetNode = document.getElementById('open-modal');

    const config = { attributes: true, childList: false, subtree: false, attributeFilter: ['style'] };

    const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes') {
                // Check if an image is opened
                if (document.getElementsByClassName('med-tray js-mediaembed').length > 0 && document.getElementsByClassName('med-tray js-mediaembed')[0].hasChildNodes()) {
                    // make the whole image area as clickable as you would click on the small x
                    document.getElementsByClassName('js-modal-panel mdl s-full med-fullpanel')[0].onclick = function () { document.getElementsByClassName('mdl-dismiss')[0].click() }

                    // remove unecessary elements
                    // view original under the picture modal 
                    document.getElementsByClassName('med-origlink')[0].remove()
                    // view flag media under the picture modal
                    document.getElementsByClassName('med-flaglink')[0].remove()
                }
            }
        }
    };

    const observer = new MutationObserver(callback);

    observer.observe(targetNode, config);

}

async function runWhenReady(readySelector) {
    return new Promise((resolve, reject) => {
        var numAttempts = 0;
        var tryNow = function () {
            var elem = document.querySelector(readySelector);
            if (elem) {
                resolve(elem)
            } else {
                numAttempts++;
                if (numAttempts >= 20) {
                    let message = 'Giving up after 20 attempts. Could not find: ' + readySelector
                    console.warn(message);
                    reject(message)
                } else {
                    setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
                }
            }
        };
        tryNow();
    })
}

function addStyles() {
    'use strict';

    GM_addStyle(`
    .med-fullpanel {
    background-color: transparent !important;
    box-shadow: 0 !important;
        }
` );

    GM_addStyle(`
    html.dark .mdl {
    background-color: transparent !important;
    box-shadow: none !important;
    border-radius: 0 !important;
        }
` );


    GM_addStyle(`
    html.dark .is-condensed .app-content {
    left: 0px
        }
` );

    GM_addStyle(`
    .overlay, .ovl {
    background: transparent !important;
        }
` );


    GM_addStyle(`
    .mdl-dismiss {
    visibility: hidden !important;
        }
` );

    GM_addStyle(`
    .med-tweet {
    background-color: rgb(21, 32, 43) !important;
        }
` );

}