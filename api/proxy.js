// /api/proxy.js
export default async function handler(req, res) {
  const { method = "getUpdates" } = req.query;

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; // настрой в Vercel
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID; // -100... ID канала

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return res.status(500).json({ error: "TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы" });
  }

  try {
    // Получаем сообщения канала
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`;
    const tgRes = await fetch(url);
    const tgData = await tgRes.json();

    if (!tgData.ok) {
      return res.status(500).json({ error: "Ошибка Telegram API", details: tgData });
    }

    // Фильтруем только сообщения из нужного канала
    const messages = tgData.result
      .filter(u => u.message && u.message.chat && u.message.chat.id.toString() === TELEGRAM_CHAT_ID)
      .map(u => ({
        text: u.message.text || "",
        date: u.message.date,
        photos: u.message.photo || [],
      }))
      .sort((a, b) => b.date - a.date); // последние сверху

    res.status(200).json({ ok: true, messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера", details: err.message });
  }
}
