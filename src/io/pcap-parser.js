const fs = require('fs');
const pcapParser = require('pcap-parser');
const ethernet = require('ethernet');
const path = require('path');
const bparser = require('./buffer-parser');
const tcpPacket = require('tcp-packet');

const LoadTracesFromFile = async (filePath) => {
    const packets = await pcap.LoadPacketsFromFile(filePath)
    const parsed = pcap.ParseTCPPackets(packets)
    const traced = pcap.FilterTracesFromPacketArray(parsed)
    return traced;
}

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

const ParseDevicesFromPackets = (packets) => {
    //TO DO: add ref id's not entire objects
    var devices = {}

    packets.forEach(packet => {
        const src = packet.srcIP
        if(!(Object.hasOwn(devices, src)))
            devices[src] = []

        devices[src].push(packet)

        const dst = packet.dstIP
        if(!(Object.hasOwn(devices, dst)))
            devices[dst] = []

        devices[dst].push(packet)
    });
    return devices
}

const FullParser = async (filePath) => {
    console.log("FULL PARSER RUNNING")
    const file  = path.basename(filePath);
    const packets = await LoadPacketsFromFile(filePath)
    const parsed = ParseTCPPackets(packets)
    const devices = ParseDevicesFromPackets(parsed)
    const traced = FilterTracesFromPacketArray(parsed)
    console.log("DONE")

    return {
        file,
        devices,
        packets,
        parsed,
        traced
    }
}

module.exports = {
    LoadPacketsFromFile,
    ParseTCPPackets,
    FilterTracesFromPacketArray,
    LoadTracesFromFile,
    FullParser
}