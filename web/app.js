document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("password");
    const bar = document.getElementById("strength-bar");
    const scoreText = document.getElementById("score");
    const entropyValue = document.getElementById("entropy-value");
    const crackValue = document.getElementById("crack-value");
    const feedbackList = document.getElementById("feedback");
    const toggleBtn = document.getElementById("toggle-password");
    const generateBtn = document.getElementById("generate-btn");
    const lengthSlider = document.getElementById("length-slider");
    const lengthVal = document.getElementById("length-val");

    let commonPasswords = [];
    let dictionary = [];

    fetch('data/commonPasswords.txt')
        .then(response => response.ok ? response.text() : "")
        .then(text => commonPasswords = text.split('\n').filter(Boolean).map(p => p.trim().toLowerCase()))
        .catch(err => console.error("Failed to load common passwords", err));

    fetch('data/dictionary.txt')
        .then(response => response.ok ? response.text() : "")
        .then(text => dictionary = text.split('\n').filter(Boolean).map(w => w.trim().toLowerCase()))
        .catch(err => console.error("Failed to load dictionary", err));

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

    const updateAnalysis = () => {
        const password = input.value;
        const lowerPassword = password.toLowerCase();
        let score = 0;
        let feedback = [];

        if (password.length === 0) {
            score = 0;
        } else {
            if (password.length < 8) {
                feedback.push("Password is too short");
                score += 5;
            } else if (password.length >= 12) {
                score += 30;
            } else {
                score += 15;
            }

            if (/[A-Z]/.test(password)) score += 20; else feedback.push("Add uppercase letters");
            if (/[a-z]/.test(password)) score += 20; else feedback.push("Add lowercase letters");
            if (/[0-9]/.test(password)) score += 15; else feedback.push("Add numbers");
            if (/[^A-Za-z0-9]/.test(password)) score += 15; else feedback.push("Add special characters");

            if (commonPasswords.includes(lowerPassword)) {
                score -= 50;
                feedback.push("Very common password!");
            }

            if (dictionary.includes(lowerPassword) && lowerPassword.length > 3) {
                score -= 20;
                feedback.push("Avoid using common words");
            }

            const keyboardPatterns = ["qwerty", "asdfgh", "zxcvbn"];
            if (keyboardPatterns.some(p => lowerPassword.includes(p))) {
                score -= 10;
                feedback.push("Avoid keyboard patterns");
            }
        }

        score = Math.max(0, Math.min(100, score));
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
    };

    input.addEventListener("input", updateAnalysis);

    // Toggle Password Visibility
    toggleBtn.addEventListener("click", () => {
        const type = input.getAttribute("type") === "password" ? "text" : "password";
        input.setAttribute("type", type);
        toggleBtn.innerHTML = type === "password" ? 
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-icon"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>' :
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-icon"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
    });

    // Password Generator
    lengthSlider.addEventListener("input", () => {
        lengthVal.innerText = lengthSlider.value;
    });

    generateBtn.addEventListener("click", () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let password = "";
        const length = parseInt(lengthSlider.value);
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);
        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length];
        }
        input.value = password;
        updateAnalysis();
    });
});

