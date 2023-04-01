// This gets all the member from Twtter lists if the list is opened with the members shown
// for the devconsole have to remove the let and vars bc of redeclaration

var myarray = []

setInterval(() => {

    var curList = document.querySelectorAll("div[data-testid='cellInnerDiv']")

    for (let i = 0; i < curList.length; i++) {
        var outerElement = curList[i]

        var curElem = outerElement?.firstChild?.firstChild?.firstChild?.firstChild?.children[1]?.firstChild?.firstChild?.firstChild?.children[1]?.firstChild?.firstChild?.firstChild?.firstChild.firstChild.firstChild.textContent

        console.log(curElem)
        myarray.push(curElem)
    }

    document.getElementsByClassName('css-1dbjc4n r-1pp923h r-1moyyf3 r-16y2uox r-1wbh5a2 r-1dqxon3')[0].scrollBy(0, +650)
    console.log(myarray.length)

}, 500);


// give out unique elements
[...new Set(myarray)]



// remove all setTimeouts
var highestTimeoutId = setTimeout(";");
for (var i = 0; i < highestTimeoutId; i++) {
    clearTimeout(i);
}
