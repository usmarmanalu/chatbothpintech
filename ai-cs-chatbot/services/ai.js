import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function askAI(message) {

  try {

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Kamu adalah customer service cleaning service yang ramah."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    return completion.choices[0].message.content;

  } catch (error) {

    console.log("OPENAI ERROR:", error);

    return "Maaf sistem sedang mengalami gangguan.";

  }

}