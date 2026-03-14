import { askAI } from "../services/ai";

export default async function handler(req, res) {

  if (req.method === "GET") {
    return res.status(200).json({
      status: "Chatbot API aktif"
    });
  }

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
      reply
    });

  } catch (error) {

    console.error("CHAT ERROR:", error);

    return res.status(500).json({
      error: "Internal Server Error"
    });

  }

}