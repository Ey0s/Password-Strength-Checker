function generatePassword(length = 16, options = {}) {

    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let charset = "";

    if (options.uppercase) charset += upper;
    if (options.lowercase) charset += lower;
    if (options.numbers) charset += numbers;
    if (options.special) charset += special;

    let password = "";

    for (let i = 0; i < length; i++) {

        const random = Math.floor(Math.random() * charset.length);

        password += charset[random];
    }

    return password;
}

module.exports = { generatePassword };