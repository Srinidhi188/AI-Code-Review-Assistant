// backend/listGeminiModels.js
const axios = require("axios");
require("dotenv").config();

async function listModels() {
  try {
    console.log("🔎 Calling ListModels with your GEMINI_API_KEY...");
    const res = await axios.get(
      // try v1 first (most-common); if that returns 404 we will show the error
      "https://generativelanguage.googleapis.com/v1/models",
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    console.log("✅ /v1/models response:");
    console.log(JSON.stringify(res.data, null, 2));
    return;
  } catch (err1) {
    console.error("⚠️ /v1/models failed:", err1.response?.status, err1.response?.data || err1.message);
  }

  // fallback to v1beta if v1 failed
  try {
    console.log("🔎 Trying v1beta ListModels as fallback...");
    const res2 = await axios.get(
      "https://generativelanguage.googleapis.com/v1beta/models",
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );
    console.log("✅ /v1beta/models response:");
    console.log(JSON.stringify(res2.data, null, 2));
    return;
  } catch (err2) {
    console.error("❌ Both /v1 and /v1beta ListModels failed:");
    console.error(" /v1 error:", err2.response?.status, err2.response?.data || err2.message);
  }
}

listModels();
