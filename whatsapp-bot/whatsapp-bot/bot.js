const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: false,
    args: ["--no-sandbox"]
  }
});

client.on("qr", (qr) => {
  console.log("Scan QR:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ WhatsApp bot siap");
});

client.on("message", async (msg) => {
  try {

    if (msg.from === "status@broadcast") return;
    if (msg.from.includes("@g.us")) return;

    const text = msg.body;

    console.log("📩 Pesan:", text);

    const res = await axios.post(
      "https://chatbothpintech.vercel.app/api/chat",
      {
        userId: msg.from,
        message: text
      }
    );

    const reply = res.data.reply || "Maaf saya tidak mengerti.";

    await msg.reply(reply);

  } catch (error) {

    console.log("ERROR:", error.response?.data || error.message);

    msg.reply("Maaf sistem sedang sibuk.");
  }
});

client.initialize();