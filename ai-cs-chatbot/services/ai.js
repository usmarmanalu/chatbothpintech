import OpenAI from "openai";
import { getServices } from "./sheet.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function askAI(message, history) {

  const services = await getServices();

  const serviceList = services
    .map(s => `${s[0]} : Rp ${s[1]}`)
    .join("\n");

  const completion = await openai.chat.completions.create({

    model: "gpt-4o-mini",

    messages: [

      {
        role: "system",
        content:
`Anda adalah customer service perusahaan cleaning service.

Daftar layanan:

${serviceList}

Jika pelanggan bertanya harga layanan, jawab dari daftar tersebut.
Jawab dengan ramah.`
      },

      ...history,

      {
        role: "user",
        content: message
      }
    ]
  });

  return completion.choices[0].message.content;
}