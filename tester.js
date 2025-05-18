const pcap = require("./src/io/pcap-parser.js")

const onMain = async () => {
    const packets = await pcap.LoadPacketsFromFile("./samples/sample2.pcap")

    console.log(`Loaded ${packets.length} packets`)
    console.log('Packet data:')
    console.log(packets[1])
    console.log('')

    const parsed = pcap.ParseTCPPackets(packets)
    console.log(`Parsed ${parsed.length} packets`)
    console.log('Packet data:')
    console.log(parsed[1])
    console.log('')

    const traced = pcap.FilterTracesFromPacketArray(parsed)
    const streamNames = Object.keys(traced)
    console.log(`Traced ${streamNames.length} streams`)
    console.log('Stream data:')
    console.log(traced[streamNames[1]][1])
    console.log('')

}


onMain()