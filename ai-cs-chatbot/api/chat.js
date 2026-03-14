import { askAI } from "../services/ai.js";
import { getMemory, saveMemory } from "../services/memory.js";

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

    const { userId = "guest", message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "message required"
      });
    }

    const history = getMemory(userId) || [];

    const reply = await askAI(message, history);

    saveMemory(userId, message, reply);

    res.status(200).json({
      userId,
      message,
      reply
    });

  } catch (error) {

    console.error("CHAT API ERROR:", error);

    res.status(500).json({
      error: "Internal Server Error"
    });

  }

}