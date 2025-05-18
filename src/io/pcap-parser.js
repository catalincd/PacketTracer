const fs = require('fs');
const pcapParser = require('pcap-parser');
const ethernet = require('ethernet');
const bparser = require('./buffer-parser');
const tcpPacket = require('tcp-packet');
const { start } = require('repl');


const GetStreamId = (packet) => {
    const firstIP = (packet.srcIP < packet.dstIP ? packet.srcIP : packet.dstIP)
    const secondIP = (packet.srcIP > packet.dstIP ? packet.srcIP : packet.dstIP)
    const firstPort = (firstIP == packet.srcIP)? packet.sourcePort : packet.destinationPort
    const secondPort = (firstIP == packet.dstIP)? packet.sourcePort : packet.destinationPort

    return `${firstIP}:${firstPort}-${secondIP}:${secondPort}`
}

const FilterTracesFromPacketArray = (packets) => {
    const streams = {}

    packets.forEach(packet => {
        const id = GetStreamId(packet)
        if(!(Object.hasOwn(streams, id)))
            streams[id] = []

        streams[id].push(packet)
    });

    return streams
}

const ParseTCPPackets = (packets) => {
    return packets.map((packet) => {
        const rawData = packet.data;
        const eth = bparser.ethparse(rawData);

        if (eth.etherType == 0x0800) {
            const ip = bparser.ipv4decode(eth.payload);
            if (ip.protocol == 6) {
                const tcp = tcpPacket.decode(ip.payload);
                const struct = { ...eth, ...ip, ...tcp }
                delete struct.payload
                return struct
            }
        }
        return null;
    }).filter(packet => (packet != null))
}



const LoadPacketsFromFile = async (filePath) => {
    return new Promise((resolve, reject) => {
        const packets = [];
        const stream = fs.createReadStream(filePath);
        const parser = pcapParser.parse(stream);

        parser.on('packet', (packet) => {
            packets.push({
                timestamp: packet.header.tv_sec,
                length: packet.header.orig_len,
                data: packet.data,
            });
        });

        parser.on('end', () => {
            resolve(packets);
        });

        parser.on('error', (err) => {
            reject(err);
        });

        stream.on('error', (err) => {
            reject(err);
        });
    });
}

module.exports = {
    LoadPacketsFromFile,
    ParseTCPPackets,
    FilterTracesFromPacketArray
}