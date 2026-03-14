import { askAI } from "../services/ai.js";
import { getHistory, saveMessage } from "../services/memory.js";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { userId, message } = req.body;

  const history = getHistory(userId);

  const reply = await askAI(message, history);

  saveMessage(userId, "user", message);
  saveMessage(userId, "assistant", reply);

  res.status(200).json({
    reply
  });
}