const buildPackets = async () => {

    var listHtml = ""
    for (let i = 0; i < Math.min(5000, GLOBAL_DATA.parsed.length); i++) {
        listHtml += await renderTemplate('packetItem.ejs', {
            num: i + 1,
            ...GLOBAL_DATA.parsed[i]
        })
    }
    $("#packetsList").html(listHtml)
    $(".packetItem").elements[0].classList.add("selected")
    selectPacket(GLOBAL_DATA.parsed[0].sequenceNumber)

    $(".packetItem").on("click", (e) => {
        $(".packetItem").removeClass("selected")
        selectPacket(e.currentTarget.dataset.tag)
        e.currentTarget.classList.add("selected")
    })
}

const getRawFromBuffer = (buffer) => buffer.toString().match(/.{1,2}/g).map(str => `<span>${str}</span>`).join(' ')
const getAsciiFromBuffer = (buffer) => buffer.toString().match(/.{1,2}/g).map(str => `<span>${hexToAscii(str)}</span>`).join(' ')



const hexToAscii = (hex) => {
    let ascii = '';
    for (let i = 0; i < hex.length; i += 2) {
        const hexByte = hex.substr(i, 2);
        const charCode = parseInt(hexByte, 16);
        ascii += String.fromCharCode(charCode);
    }
    return ascii;
}



const selectPacket = (_sequenceNumber) => {
    console.log(_sequenceNumber)
    const packet = GLOBAL_DATA.parsed.find(pkt => pkt.sequenceNumber == _sequenceNumber)
    console.log(packet)
    const raw = getRawFromBuffer(packet.raw);
    const ascii = getAsciiFromBuffer(packet.raw);
    $("#packetRaw").html(raw)
    $("#packetChar").html(ascii)
}