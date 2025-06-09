const buildDevices = async () => {
    console.log("building...")
    const deviceNames = Object.keys(GLOBAL_DATA.devices)
    var listHtml = ""
    for(let i=0;i<deviceNames.length;i++)
    {
        listHtml += await renderTemplate('deviceItem.ejs', {
            ip: deviceNames[i]
        })
    }
    $("#devicesList").html(listHtml)
    $(".deviceItem").elements[0].classList.add("selected")
    rebuildDeviceStar(deviceNames[0])

    $(".deviceItem").on("click", (e) => {
        $(".deviceItem").removeClass("selected")
        rebuildDeviceStar(e.currentTarget.dataset.ip)
        e.currentTarget.classList.add("selected")
    })
}

const getOtherIp = (packet, ip) => (packet.srcIP == ip? packet.dstIP : packet.srcIP) 

const rebuildDeviceStar = async (ip) => {
    $("#deviceStarCenterIp").html(ip)
    $(".deviceStarEndpoint").remove()
    $(".deviceStarEndpointLine").remove()
    var listHtml = ""
    const endpoints = [...new Set(GLOBAL_DATA.devices[ip].map(packet => getOtherIp(packet, ip)))]

    for(let i=0;i<endpoints.length;i++)
    {
        const pib = 1.57079632679 
        const angle = 0.0174533 * 360.0 / endpoints.length * i - pib
        const offsetX = 10 + (Math.cos(angle) + 1.0) / 2.0 * 80
        const offsetY = 15 + (Math.sin(angle) + 1.0) / 2.0 * 80

        listHtml += await renderTemplate(`deviceStarEndpoint${angle > 0 && angle < 2 * pib? "" : "Flip"}.ejs`, {
            ip: endpoints[i],
            id: i,
            style: `top: ${offsetY}%; left: ${offsetX}%`
        })

        const lineOffsetX = 22.5 + (Math.cos(angle) + 1.0) / 2.0 * 45
        const lineOffsetY = 35 + (Math.sin(angle) + 1.0) / 2.0 * 45

        listHtml += `<div class="deviceStarEndpointLine" style="top: ${lineOffsetY}%; left: ${lineOffsetX}%;transform: rotate(${angle}rad);"></div>`
    }
    
    $("#deviceEndpointContainer").html(listHtml)
}