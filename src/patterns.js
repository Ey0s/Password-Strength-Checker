const keyboardPatterns = [
    "qwerty",
    "asdfgh",
    "zxcvbn"
];

function detectPatterns(password) {

    let sequential = false;

    const sequences = [
        "abcdefghijklmnopqrstuvwxyz",
        "0123456789"
    ];

    sequences.forEach(seq => {
        for (let i = 0; i < seq.length - 4; i++) {
            if (password.includes(seq.substring(i, i + 5))) {
                sequential = true;
            }
        }
    });

    let keyboard = keyboardPatterns.some(p =>
        password.toLowerCase().includes(p)
    );

    return {
        sequential,
        keyboard
    };
}

module.exports = { detectPatterns };