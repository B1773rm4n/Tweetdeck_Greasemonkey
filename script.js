// ==UserScript==
// @name         Tweetdeck tweaks
// @namespace    http://tampermonkey.net/
// @description  Customizes my own Tweetdeck experience. It's unlikely someone else will enjoy this.
// @copyright    WTFPL
// @source       https://github.com/B1773rm4n/Tweetdeck_Greasemonkey
// @version      1.0
// @author       B1773rm4n
// @match        https://tweetdeck.twitter.com/
// @connect      githubusercontent.com
// @icon         https://icons.duckduckgo.com/ip2/twitter.com.ico
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

(async function () {

    const arrayListNames = await returnNamesFromArrayList()

    addStyles()

    setTimeout(function () {

        fullScreenModal()

        showInList(arrayListNames)

    }, 5000);

})();

function showInList(arrayListNames) {


    let usernameArray = document.getElementsByClassName('username')

    for (let index = 1; index < usernameArray.length; index++) {
        const element = usernameArray[index];
        let currentlyDisplayedElementName = element.innerHTML

        console.log(arrayListNames)
        console.log(JSON.stringify(arrayListNames))

        let inNameInList = arrayListNames.includes(currentlyDisplayedElementName)

        if (inNameInList) {
            element.style.color = "green"
        } else {
            element.style.color = "red"
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
                if (document.getElementsByClassName('js-modal open-modal ovl scroll-v scroll-styled-v')[0].hasChildNodes()) {
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