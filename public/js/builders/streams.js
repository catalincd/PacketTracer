const buildStreams = async () => {
    const streamNames = Object.keys(GLOBAL_DATA.traced)

    var listHtml = ""
    for(let i=0;i<streamNames.length;i++)
    {
        listHtml += await renderStream(streamNames[i])
    }

    $("#streamsList").html(listHtml)
}


const renderStream = async (streamName) => {
    const stream = GLOBAL_DATA.traced[streamName]
    const html = await renderTemplate('streamItem.ejs', {
        ...(stream[0]),
        tag: streamName
    })

    return html
}