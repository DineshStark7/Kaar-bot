const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Proxy endpoint
app.post("/chat", async (req, res) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: req.body.messages,
      },
      {
        headers: {
          Authorization: `Bearer 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`, // Replace with your API key
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
