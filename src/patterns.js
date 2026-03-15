const fs = require("fs");
const path = require("path");

const commonPasswordsPath = path.join(__dirname, "../data/commonPasswords.txt");
const dictionaryPath = path.join(__dirname, "../data/dictionary.txt");

const commonPasswords = fs.existsSync(commonPasswordsPath) 
    ? fs.readFileSync(commonPasswordsPath, "utf8").split("\n").filter(Boolean).map(p => p.trim()) 
    : [];

const dictionary = fs.existsSync(dictionaryPath) 
    ? fs.readFileSync(dictionaryPath, "utf8").split("\n").filter(Boolean).map(w => w.trim()) 
    : [];

const keyboardPatterns = [
    "qwerty",
    "asdfgh",
    "zxcvbn"
];

function detectPatterns(password) {
    const lowerPassword = password.toLowerCase();
    let sequential = false;

    const sequences = [
        "abcdefghijklmnopqrstuvwxyz",
        "0123456789"
    ];

    sequences.forEach(seq => {
        for (let i = 0; i < seq.length - 4; i++) {
            if (lowerPassword.includes(seq.substring(i, i + 5))) {
                sequential = true;
            }
        }
    });

    let keyboard = keyboardPatterns.some(p =>
        lowerPassword.includes(p)
    );

    let isCommon = commonPasswords.some(p => p.toLowerCase() === lowerPassword);
    let isDictionary = dictionary.some(w => w.toLowerCase() === lowerPassword && w.length > 3);

    return {
        sequential,
        keyboard,
        isCommon,
        isDictionary
    };
}

module.exports = { detectPatterns };