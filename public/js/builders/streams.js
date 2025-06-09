const buildStreams = async () => {
    const streamNames = Object.keys(GLOBAL_DATA.traced)

    var listHtml = ""
    for (let i = 0; i < streamNames.length; i++) {
        listHtml += await renderStreamItem(streamNames[i])
    }

    $("#streamsList").html(listHtml)

    $(".streamItem").elements[0].classList.add("selected")
    selectStream(streamNames[0])

    $(".streamItem").on("click", (e) => {
        $(".streamItem").removeClass("selected")

        selectStream(e.currentTarget.dataset.tag)
        e.currentTarget.classList.add("selected")
    })
}


const renderStreamItem = async (streamName) => {
    const stream = GLOBAL_DATA.traced[streamName]
    const html = await renderTemplate('streamItem.ejs', {
        ...(stream[0]),
        tag: streamName
    })

    return html
}

const selectStream = async (streamName) => {
    const stream = GLOBAL_DATA.traced[streamName]
    const srcIP = stream[0].srcIP
    $("#srcIpTimeline").html(stream[0].srcIP)
    $("#dstIpTimeline").html(stream[0].dstIP)

    $(".streamPacket").remove()

    var listHtml = ""
    for (let i = 0; i < stream.length; i++) {
        listHtml += await renderTemplate('streamPacket.ejs', {
            ...(stream[i]),
            arrow: (stream[i].srcIP == srcIP? "arrow_right_alt" : "arrow_left_alt"),
            method: stream[i].http.method || (stream[i].flags == 16? "ACK" : ""),
            emptyMethod: (stream[i].http.method == undefined || stream[i].http.method == null || stream[i].http.method == "ACK")? "empty":""
        })
    }

    $("#streamsTimelineContainer").html(listHtml)
    
    $(".streamPacket").on("click", (e) => {
        $(".packetItem").removeClass("selected")

        const selectedElement = document.querySelector(`.packetItem[data-tag="${e.currentTarget.dataset.id}"]`);
        
        console.log(selectedElement.offsetTop)

        selectedElement.classList.add("selected")
        

        
        console.log( document.getElementById("packetsList"))
        document.getElementById("packetsList").scrollTo(0, 3000)
        selectPacket(e.currentTarget.dataset.id)
        selectTab("packets")
    })
}