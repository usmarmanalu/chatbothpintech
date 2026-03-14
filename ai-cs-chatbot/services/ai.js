import OpenAI from "openai";
import { getSheetsData } from "./sheet.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function askAI(message, history = []) {

  try {

    let context = "";

    // =========================
    // AMBIL DATA GOOGLE SHEET
    // =========================
    try {

      const sheetsData = await getSheetsData();

      if (Array.isArray(sheetsData)) {

        context = sheetsData.map(sheet => {

          const rows = (sheet.rows || [])
            .map(row => Object.values(row).join(" | "))
            .join("\n");

          return `Sheet: ${sheet.name}\n${rows}`;

        }).join("\n\n");

      }

    } catch (sheetError) {

      console.log("Sheet error (diabaikan):", sheetError.message);

    }

    // =========================
    // PANGGIL OPENAI
    // =========================

    const completion = await openai.chat.completions.create({

      model: "gpt-4o-mini",

      messages: [

        {
          role: "system",
          content: `
Anda adalah customer service cleaning service Pintech.

Gunakan data berikut jika ada:

${context}

Jawab dengan ramah dan singkat.
`
        },

        ...history,

        {
          role: "user",
          content: message
        }

      ]

    });

    const reply = completion?.choices?.[0]?.message?.content;

    return reply || "Maaf saya belum bisa menjawab.";

  } catch (error) {

    console.error("OPENAI ERROR FULL:", error);

    return "Maaf sistem sedang mengalami gangguan.";

  }

}