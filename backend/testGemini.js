const axios = require("axios");
require("dotenv").config();

const test = async () => {
  try {
    const res = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
      {
        contents: [{ parts: [{ text: "Say Hello World" }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );
    console.log("✅ Gemini working:", res.data.candidates[0].content.parts[0].text);
  } catch (err) {
    console.error("❌ Gemini test failed:", err.response?.data || err.message);
  }
};

test();
