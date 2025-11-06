const cors = require("cors");
const express = require("express");
const axios = require("axios");
require("dotenv").config();

console.log("🟢 Starting backend...");

const app = express();

// ✅ Allow both localhost (for testing) and Vercel (for production)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://ai-code-review-assistant-three.vercel.app"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Gemini REST API backend is running successfully!");
});

app.post("/analyze", async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "No code provided" });

  try {
    const prompt = `
You are a senior software engineer.
Please review this code and provide:
1. Bugs or syntax issues
2. Security or logical problems
3. Suggestions for improvement

Code:
${code}
    `;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    const aiResponse =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response text from Gemini.";

    res.json({ review: aiResponse });
  } catch (error) {
    console.error(
      "❌ Gemini REST API Error:",
      error.response?.status,
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Gemini request failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));






// const express = require("express");
// const cors = require("cors");
// const axios = require("axios");
// require("dotenv").config();

// console.log("🟢 Starting backend...");

// const app = express();

// // ✅ Fixed CORS Setup
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:3001",
//       "https://ai-code-review-assistant.vercel.app",
//       "https://ai-code-review-backend-6u1r.onrender.com",
//     ],
//     methods: ["GET", "POST", "OPTIONS"],
//     allowedHeaders: ["Content-Type"],
//     credentials: true,
//   })
// );

// app.use(express.json());


// app.get("/", (req, res) => {
//   res.send("🚀 Gemini REST API backend is running successfully!");
// });

// app.post("/analyze", async (req, res) => {
//   const { code } = req.body;
//   if (!code) return res.status(400).json({ error: "No code provided" });

//   try {
//     const prompt = `
// You are a senior software engineer.
// Please review this code and provide:
// 1. Bugs or syntax issues
// 2. Security or logical problems
// 3. Suggestions for improvement

// Code:
// ${code}
//     `;

//     // ✅ Use the working model for your key
//     const response = await axios.post(
//       "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
//       {
//         contents: [{ parts: [{ text: prompt }] }],
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "x-goog-api-key": process.env.GEMINI_API_KEY,
//         },
//       }
//     );

//     const aiResponse =
//       response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "No response text from Gemini.";

//     res.json({ review: aiResponse });
//   } catch (error) {
//     console.error(
//       "❌ Gemini REST API Error:",
//       error.response?.status,
//       error.response?.data || error.message
//     );
//     res.status(500).json({ error: "Gemini request failed" });
//   }
// });

// console.log("🚀 About to start Express server...");
// const PORT = 5000;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
