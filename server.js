require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Read company information from file
const companyInfo = fs.readFileSync("company-info.txt", "utf-8");

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/gpt-4", // You can change the model as needed
        messages: [
          {
            role: "system",
            content: `You are a helpful chatbot that only answers questions based on the following company information:\n\n${companyInfo}`,
          },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ response: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Error fetching response" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
