import OpenAI from "openai";

export default async function handler(req, res) {

  // TEST API VIA BROWSER
  if (req.method === "GET") {
    return res.status(200).json({
      status: "Chatbot API aktif",
      message: "Gunakan POST untuk mengirim chat"
    });
  }

  // Hanya menerima POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method Not Allowed"
    });
  }

  try {

    const { userId, message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "message required"
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Kamu adalah customer service yang ramah untuk bisnis cleaning service Pintech."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({
      reply
    });

  } catch (error) {

    console.error("ERROR CHAT:", error);

    res.status(500).json({
      error: "Internal Server Error"
    });

  }
}