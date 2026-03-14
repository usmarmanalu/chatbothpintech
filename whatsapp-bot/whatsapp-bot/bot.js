const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");

// inisialisasi client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  }
});

// QR Code
client.on("qr", (qr) => {
  console.log("Scan QR ini dengan WhatsApp kamu:");
  qrcode.generate(qr, { small: true });
});

// Bot siap
client.on("ready", () => {
  console.log("✅ WhatsApp bot siap digunakan");
});

// Jika login berhasil
client.on("authenticated", () => {
  console.log("🔐 Authenticated");
});

// Jika session tersimpan
client.on("auth_failure", (msg) => {
  console.error("❌ Auth failure:", msg);
});

// menerima pesan
client.on("message", async (msg) => {
  try {
    // ignore status
    if (msg.from === "status@broadcast") return;

    // ignore group
    if (msg.from.includes("@g.us")) return;

    const userId = msg.from;
    const text = msg.body;

    console.log("📩 Pesan masuk:", text);

    const res = await axios.post(
      "https://chatbothpintech.vercel.app/api/chat",
      {
        userId: userId,
        message: text
      }
    );

    const reply = res.data.reply || "Maaf saya tidak mengerti pertanyaan Anda.";

    await msg.reply(reply);

    console.log("🤖 Reply:", reply);

  } catch (error) {
    console.error("ERROR:", error.message);

    msg.reply("Maaf sistem sedang sibuk. Silakan coba lagi nanti.");
  }
});

// mulai bot
client.initialize();