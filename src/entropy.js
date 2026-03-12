function calculateEntropy(password) {

    let charset = 0;

    if (/[a-z]/.test(password)) charset += 26;
    if (/[A-Z]/.test(password)) charset += 26;
    if (/[0-9]/.test(password)) charset += 10;
    if (/[^A-Za-z0-9]/.test(password)) charset += 32;

    const entropy = password.length * Math.log2(charset || 1);

    return entropy;
}

module.exports = { calculateEntropy };