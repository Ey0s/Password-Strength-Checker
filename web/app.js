const input = document.getElementById("password");
const bar = document.getElementById("strength-bar");
const scoreText = document.getElementById("score");
const entropyValue = document.getElementById("entropy-value");
const crackValue = document.getElementById("crack-value");
const feedbackList = document.getElementById("feedback");

function calculateEntropy(password) {
    if (!password) return 0;
    
    let charsetSize = 0;
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/[0-9]/.test(password)) charsetSize += 10;
    if (/[^A-Za-z0-9]/.test(password)) charsetSize += 32;

    if (charsetSize === 0) return 0;
    return Math.log2(Math.pow(charsetSize, password.length));
}

function getCrackTime(entropy) {
    if (entropy === 0) return "Instant";
    
    // Estimates based on 10 billion guesses per second (high-end GPU)
    const guessesPerSecond = 10_000_000_000;
    const seconds = Math.pow(2, entropy) / guessesPerSecond;

    if (seconds < 1) return "Instant";
    if (seconds < 60) return Math.floor(seconds) + " seconds";
    if (seconds < 3600) return Math.floor(seconds / 60) + " minutes";
    if (seconds < 86400) return Math.floor(seconds / 3600) + " hours";
    if (seconds < 2592000) return Math.floor(seconds / 86400) + " days";
    if (seconds < 31536000) return Math.floor(seconds / 2592000) + " months";
    if (seconds < 31536000000) return Math.floor(seconds / 31536000) + " years";
    return "Centuries";
}

input.addEventListener("input", () => {
    const password = input.value;
    let score = 0;
    let feedback = [];

    if (password.length === 0) {
        score = 0;
    } else {
        if (password.length < 8) {
            feedback.push("Password is too short");
        } else if (password.length >= 12) {
            score += 30;
        } else {
            score += 15;
        }

        if (/[A-Z]/.test(password)) score += 20; else feedback.push("Add uppercase letters");
        if (/[a-z]/.test(password)) score += 20; else feedback.push("Add lowercase letters");
        if (/[0-9]/.test(password)) score += 15; else feedback.push("Add numbers");
        if (/[^A-Za-z0-9]/.test(password)) score += 15; else feedback.push("Add special characters");
    }

    // Cap score at 100
    score = Math.min(100, score);
    
    bar.style.width = score + "%";
    
    if (score < 40) bar.style.background = "#ef4444";
    else if (score < 75) bar.style.background = "#f59e0b";
    else bar.style.background = "#22c55e";

    scoreText.innerText = `Score: ${score}/100`;
    
    const entropy = calculateEntropy(password);
    entropyValue.innerText = `${entropy.toFixed(1)} bits`;
    crackValue.innerText = getCrackTime(entropy);

    feedbackList.innerHTML = "";
    feedback.forEach(f => {
        const li = document.createElement("li");
        li.innerText = f;
        feedbackList.appendChild(li);
    });
});