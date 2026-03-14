import OpenAI from "openai";
import { getSheetsData } from "./sheet.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function askAI(message, history = []) {

  try {

    const sheetsData = await getSheetsData();

    // ubah semua sheet menjadi text knowledge
    const context = sheetsData
      .map(sheet => {

        const rows = sheet.rows
          .map(r => Object.values(r).join(" | "))
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
Anda adalah customer service perusahaan cleaning service.

Gunakan data berikut untuk menjawab pelanggan:

${context}

Jika pelanggan bertanya harga atau layanan,
jawab berdasarkan data spreadsheet di atas.
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

    return completion.choices?.[0]?.message?.content || "Maaf saya tidak mengerti.";

  } catch (error) {

    console.error("AI ERROR:", error);

    return "Maaf sistem sedang mengalami gangguan.";

  }

}