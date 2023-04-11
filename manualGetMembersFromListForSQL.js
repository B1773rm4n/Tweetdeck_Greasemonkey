// This gets all the member from Twtter lists if the list is opened with the members shown
// this version creates an output for mySQL with 3 fields: name_clear, name_id and description

var myarray = []
let previousLastArtist = ""

let myInterval = setInterval(() => {

    let curList = document.querySelector("div[aria-label='Timeline: List members']").firstChild.children

    for (let i = 0; i < curList.length; i++) {
        try {
            var element = curList[i]
            let artistField = element.firstChild.firstChild.firstChild.firstChild.children[1]
            let myJson = {}

            myJson.name_clear = artistField.firstChild.firstChild.firstChild.firstChild.innerText.trim()
            myJson.name_id = artistField.firstChild.firstChild.firstChild.children[1].innerText.trim()
            myJson.description = artistField?.children[1]?.innerText.replace((/  |\r\n|\n|\r/gm), "").trim()
            // change to what list is scraping
            myJson.type = '3D'


            let isAlreadyInserted = myarray.some((element) => {
                return element.name_id == myJson.name_id
            })

            if (isAlreadyInserted) {
                // noop
                console.warn('Already inserted')
            } else {
                //insert into array
                myarray.push(myJson)
            }

        } catch (error) {
            console.error(`i: ${i}`)
            console.error(element.innerText)
            console.error(error)
        }
    }

    document.getElementsByClassName('css-1dbjc4n r-1pp923h r-1moyyf3 r-16y2uox r-1wbh5a2 r-1dqxon3')[0].scrollBy(0, +650)

    // end condition for setInterval
    if (myarray.at(-1).name_id == previousLastArtist) {
        console.log("stopRunningCounter:" + stopRunningCounter)
        // if the result is 10 times the same, assume it's end of the list
        if (stopRunningCounter > 10) {
            clearInterval(myInterval)
            // deduplicates the elements
            // outputs the whole list one item per line
            console.log(JSON.stringify(myarray,null,4))
        }
        stopRunningCounter++
    } else {
        previousLastArtist = myarray.at(-1).name_id
        stopRunningCounter = 0
    }

}, 200);