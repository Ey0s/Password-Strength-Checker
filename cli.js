const readline = require("readline");
const { analyzePassword } = require("./src/passwordAnalyzer");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter password: ", (password) => {

    const result = analyzePassword(password);

    console.log("\nPassword Score:", result.score + "/100");
    console.log("Entropy:", result.entropy.toFixed(2));
    console.log("Offline Crack Time:", result.crackTime.offline);
    console.log("Online Crack Time:", result.crackTime.online);

    console.log("\nSuggestions:");

    result.feedback.forEach(f => console.log("-", f));

    rl.close();
});