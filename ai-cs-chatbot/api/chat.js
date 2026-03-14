import { askAI } from "../services/ai.js";

export default async function handler(req, res) {

  // TEST API VIA BROWSER
  if (req.method === "GET") {
    return res.status(200).json({
      status: "Chatbot API aktif",
      message: "Gunakan POST untuk mengirim chat"
    });
  }

  // hanya menerima POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method Not Allowed"
    });
  }

  try {

    const { userId, message, history } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "message required"
      });
    }

    const reply = await askAI(message, history || []);

    return res.status(200).json({
      userId,
      message,
      reply
    });

  } catch (error) {

    console.error("CHAT API ERROR:", error);

    return res.status(500).json({
      error: "Internal Server Error"
    });

  }
}