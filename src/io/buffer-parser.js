const ipv4decode = (buffer) => {
    const versionAndHeaderLength = buffer[0];
    const version = versionAndHeaderLength >> 4;
    const ihl = versionAndHeaderLength & 0x0f;
    const totalLength = buffer.readUInt16BE(2);
    const protocol = buffer[9];
    const srcIP = buffer.slice(12, 16).join('.');
    const dstIP = buffer.slice(16, 20).join('.');
    const payload = buffer.slice(ihl * 4, totalLength);

    return {
        version,
        ihl,
        totalLength,
        protocol,
        srcIP,
        dstIP,
        payload
    };
}

const ethparse = (buffer) => {
    if (buffer.length < 14) {
        throw new Error('Buffer too short to be a valid Ethernet frame');
    }

    const destMAC = buffer.slice(0, 6).toString('hex').match(/.{2}/g).join(':');
    const srcMAC = buffer.slice(6, 12).toString('hex').match(/.{2}/g).join(':');
    const etherType = buffer.readUInt16BE(12);
    const payload = buffer.slice(14);

    return {
        dest: destMAC,
        src: srcMAC,
        etherType,
        payload
    };
}

module.exports = { ipv4decode, ethparse }