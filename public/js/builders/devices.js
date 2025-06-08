const buildDevices = async (data) => {
    console.log("building...")
    const deviceNames = Object.keys(data.devices)
    var listHtml = ""
    for(let i=0;i<deviceNames.length;i++)
    {
        listHtml += await renderTemplate('deviceItem.ejs', {
            message: deviceNames[i]
        })
    }
    $("#devicesList").html(listHtml)
}