// This gets all the member from Twtter lists if the list is opened with the members shown

var myarray = []
let previousLastArtist = ""
let stopRunningCounter = 0

let myInterval = setInterval(() => {

    let curList = document.querySelectorAll("div[data-testid='cellInnerDiv']")

    for (let i = 0; i < curList.length; i++) {
        var outerElement = curList[i]

        var curElem = outerElement?.firstChild?.firstChild?.firstChild?.firstChild?.children[1]?.firstChild?.firstChild?.firstChild?.children[1]?.firstChild?.firstChild?.firstChild?.firstChild.firstChild.firstChild.textContent
        
        // filter out null and undefined
        if (curElem) {
            console.log(curElem)
            myarray.push(curElem)
        }
    }

    document.getElementsByClassName('css-1dbjc4n r-1pp923h r-1moyyf3 r-16y2uox r-1wbh5a2 r-1dqxon3')[0].scrollBy(0, +650)

    // end condition for setInterval
    if (myarray.at(-1) == previousLastArtist) {
        console.log(stopRunningCounter)
        // if the result is 10 times the same, assume it's end of the list
        if (stopRunningCounter > 10) {
            clearInterval(myInterval)
            // deduplicates the elements
            // outputs the whole list one item per line
            console.log([...new Set(myarray)].join('\n'))
        }
        stopRunningCounter++
    } else {
        previousLastArtist = myarray.at(-1)
        stopRunningCounter = 0
    }

}, 200);