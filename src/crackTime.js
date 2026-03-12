function estimateCrackTime(entropy) {

    const guesses = Math.pow(2, entropy);

    const offlineRate = 1e10;
    const onlineRate = 1000;

    const offlineSeconds = guesses / offlineRate;
    const onlineSeconds = guesses / onlineRate;

    function formatTime(seconds) {

        if (seconds < 60) return seconds.toFixed(2) + " seconds";
        if (seconds < 3600) return (seconds / 60).toFixed(2) + " minutes";
        if (seconds < 86400) return (seconds / 3600).toFixed(2) + " hours";

        return (seconds / (86400 * 365)).toFixed(2) + " years";
    }

    return {
        offline: formatTime(offlineSeconds),
        online: formatTime(onlineSeconds)
    };
}

module.exports = { estimateCrackTime };