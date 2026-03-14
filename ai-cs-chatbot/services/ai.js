import OpenAI from "openai";
import { getSheetsData } from "./sheet.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function askAI(message, history = []) {

  try {

    let context = "";

    try {

      const sheets = await getSheetsData();

      context = sheets.map(sheet => {

        const rows = sheet.rows
          .map(r => Object.values(r).join(" | "))
          .join("\n");

        return `Sheet: ${sheet.name}\n${rows}`;

      }).join("\n\n");

    } catch (e) {

      console.log("Sheet tidak terbaca:", e.message);

    }

    const completion = await openai.chat.completions.create({

      model: "gpt-4o-mini",

      messages: [

        {
          role: "system",
          content: `
Anda adalah customer service perusahaan cleaning service Pintech.

Gunakan data berikut jika diperlukan:

${context}

Aturan:
- jawab ramah
- jawab singkat
- jika data tidak ada, beri tahu dengan sopan
`
        },

        ...history,

        {
          role: "user",
          content: message
        }

      ]

    });

    return completion.choices[0].message.content;

  } catch (error) {

    console.error("AI ERROR:", error);

    return "Maaf sistem sedang mengalami gangguan.";

  }

}