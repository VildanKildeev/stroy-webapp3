// api/proxy.js
import { NextResponse } from 'next/server';
import axios from 'axios';
import cheerio from 'cheerio';

export async function GET() {
  try {
    const { data } = await axios.get('https://t.me/s/stojpoKarmanu', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(data);
    const posts = [];

    $('.tgme_widget_message').each((i, el) => {
      const $el = $(el);
      const date = $el.find('.tgme_widget_message_date time').attr('datetime');
      const text = $el.find('.tgme_widget_message_text').text().trim();
      const photo = $el.find('.tgme_widget_message_photo_wrap').css('background-image') || null;
      
      if (text) {
        posts.push({ 
          date, 
          text, 
          photo: photo ? photo.replace('url("', '').replace('")', '') : null 
        });
      }
    });

    return NextResponse.json({ success: true, posts });
  } catch (e) {
    console.error('Proxy error:', e);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch posts',
      details: e.message 
    }, { status: 500 });
  }
}