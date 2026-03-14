import OpenAI from "openai";
import { getSheetsData } from "../services/sheet.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function askAI(message, history = []) {

  try {

    let sheetsData = [];

    try {
      sheetsData = await getSheetsData();
    } catch (e) {
      console.log("Sheet tidak terbaca, lanjut tanpa data");
    }

    const context = (sheetsData || [])
      .map(sheet => {

        const rows = (sheet.rows || [])
          .map(row => Object.values(row).join(" | "))
          .join("\n");

        return `Sheet: ${sheet.name}\n${rows}`;

      })
      .join("\n\n");

    const completion = await openai.chat.completions.create({

      model: "gpt-4o-mini",

      messages: [
        {
          role: "system",
          content: `
Anda adalah customer service perusahaan cleaning service Pintech.

Gunakan data berikut jika tersedia:

${context}

Jawab ramah seperti customer service.
`
        },

        ...history,

        {
          role: "user",
          content: message
        }
      ]

    });

    return completion?.choices?.[0]?.message?.content || "Maaf saya tidak mengerti.";

  } catch (error) {

    console.error("AI ERROR:", error);

    return "Maaf sistem sedang mengalami gangguan.";

  }

}