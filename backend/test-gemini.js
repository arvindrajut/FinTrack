const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI("AIzaSyCVfTp6W8e_Tm7qvhSXA7W63YGHorA2lPM");

async function testGeminiAI() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Explain how AI works";

        const result = await model.generateContent(prompt);
        console.log("AI Response:", result.response.text());
    } catch (error) {
        console.error("Error testing Gemini AI:", error.message);
    }
}

testGeminiAI();
