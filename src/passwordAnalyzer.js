const { calculateEntropy } = require("./entropy");
const { detectPatterns } = require("./patterns");
const { estimateCrackTime } = require("./crackTime");

function analyzePassword(password) {

    let score = 0;
    let feedback = [];

    const checks = {
        length: password.length >= 12,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
        repeated: /(.)\1{2,}/.test(password)
    };

    if (checks.length) score += 25;
    else feedback.push("Password should be at least 12 characters");

    if (checks.uppercase) score += 10;
    else feedback.push("Add uppercase letters");

    if (checks.lowercase) score += 10;
    else feedback.push("Add lowercase letters");

    if (checks.number) score += 10;
    else feedback.push("Add numbers");

    if (checks.special) score += 15;
    else feedback.push("Add special characters");

    if (!checks.repeated) score += 10;
    else feedback.push("Avoid repeated characters");

    const patternResults = detectPatterns(password);

    if (patternResults.sequential)
        feedback.push("Avoid sequential patterns (abc, 123)");

    if (patternResults.keyboard)
        feedback.push("Avoid keyboard patterns (qwerty)");

    if (patternResults.isCommon) {
        score -= 50;
        feedback.push("This is a very common password");
    }

    if (patternResults.isDictionary) {
        score -= 20;
        feedback.push("Avoid using common dictionary words");
    }

    const entropy = calculateEntropy(password);
    score += Math.min(20, Math.floor(entropy / 4));

    // Ensure score stays within 0-100
    score = Math.max(0, Math.min(100, score));

    const crackTime = estimateCrackTime(entropy);

    return {
        password,
        score,
        entropy,
        crackTime,
        feedback
    };
}

module.exports = { analyzePassword };