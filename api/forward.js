// api/forward.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { text } = await request.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json(
        { success: false, error: 'Bot config missing' },
        { status: 500 }
      );
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const payload = {
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown'
    };

    await axios.post(url, payload);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка отправки в Telegram:', error.message);
    return NextResponse.json(
      { success: false, error: 'Send failed' },
      { status: 500 }
    );
  }
}
