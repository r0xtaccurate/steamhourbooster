import { Bot } from "./bot";
import { loadConfig } from "./config";
import { DefaultTokenStorage } from "./token-storage";

// --- HUGGING FACE GÖRSEL ARAYÜZ VE HEALTH CHECK ---
Bun.serve({
  port: 7860,
  fetch(req) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);

    return new Response(
      `<html>
        <head><title>Steam Booster Status</title><meta charset="UTF-8"></head>
        <body style="font-family: sans-serif; background: #0d1117; color: #58a6ff; text-align: center; padding-top: 50px;">
          <div style="border: 2px solid #238636; display: inline-block; padding: 40px; border-radius: 15px; background: #161b22;">
            <h1 style="color: #238636;">🚀 Steam Hour Booster Aktif</h1>
            <p>Bot şu an arka planda uyanık.</p>
            <hr style="border: 0; border-top: 1px solid #30363d; margin: 20px 0;">
            <p>Kullanıcı: <span style="color: #ffffff;">blads1948</span></p>
            <p>Uptime: <span style="color: #ffffff;">${hours}s ${minutes}dk</span></p>
            <div style="margin-top: 20px; color: #238636;">● Sistem Stabil</div>
          </div>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  },
});

// --- AYARLAR VE SECRETS ---
const username = Bun.env.STEAM_USERNAME;
const password = Bun.env.STEAM_PASSWORD;
const steamDataDirectory = Bun.env["STEAM_DATA_DIRECTORY"] ?? "./steam-data";
const tokenStorageDir = Bun.env["TOKEN_STORAGE_DIRECTORY"] ?? "./tokens";

if (!username || !password) {
  console.error("HATA: Steam bilgileri Secrets kısmında bulunamadı!");
  process.exit(1);
}

// Botu Başlat
try {
    const ts = new DefaultTokenStorage(tokenStorageDir);
    
    // Oyun ID'leri (Dizi olarak düzeltildi)
    const games = [480, 730, 578080, 1599600, 412220, 613100, 503560, 823130, 700330, 291550, 3678970]; 

    const bot = new Bot(
        username,
        password,
        games,
        steamDataDirectory,
        ts,
        true
    );

    console.info(`[${new Date().toLocaleString()}] ${username} için bot başlatılıyor...`);
    await bot.login();
} catch (error) {
    console.error("Bot başlatılırken bir hata oluştu:", error);
}