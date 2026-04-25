import { Bot } from "./bot";
import { loadConfig } from "./config";
import { DefaultTokenStorage } from "./token-storage";

// --- HUGGING FACE GÖRSEL ARAYÜZ VE HEALTH CHECK ---
// Bu blok Hugging Face'in sistemi kapatmasını engelleyen hayati kısımdır.
Bun.serve({
  port: 7860,
  fetch(req) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);

    return new Response(
      `<html>
        <head>
          <title>Steam Booster Status</title>
          <meta charset="UTF-8">
        </head>
        <body style="font-family: 'Segoe UI', sans-serif; background: #0d1117; color: #58a6ff; text-align: center; padding-top: 50px;">
          <div style="border: 2px solid #238636; display: inline-block; padding: 40px; border-radius: 15px; background: #161b22; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <h1 style="color: #238636; margin-bottom: 10px;">🚀 Steam Hour Booster Aktif</h1>
            <p style="color: #8b949e; font-size: 1.2em;">Bot şu an arka planda 7/24 çalışıyor.</p>
            <hr style="border: 0; border-top: 1px solid #30363d; margin: 20px 0;">
            <p style="font-size: 1.1em;">Kullanıcı: <span style="color: #ffffff;">blads1948</span></p>
            <p style="font-size: 1em; color: #8b949e;">Çalışma Süresi: <span style="color: #ffffff;">${hours}s ${minutes}dk</span></p>
            <p style="font-size: 0.9em; color: #8b949e;">Son Kontrol: ${new Date().toLocaleString('tr-TR')}</p>
            <div style="margin-top: 20px; font-size: 0.9em; color: #238636; animation: pulse 2s infinite;">● Sistem Stabil ve Erişilebilir</div>
          </div>
          <style>
            @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
          </style>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  },
});
console.info("Web arayüzü ve Health Check 7860 portunda başlatıldı.");
// --- HUGGING FACE GÖRSEL ARAYÜZ END ---

console.info("Starting Steam Hour Booster");

const configPath = Bun.env["CONFIG_PATH"] ?? "./config.json";
const tokenStorageDir = Bun.env["TOKEN_STORAGE_DIRECTORY"] ?? "./tokens";
const steamDataDirectory = Bun.env["STEAM_DATA_DIRECTORY"] ?? "./steam-data";

try {
    const config = await loadConfig(configPath);
    const ts = new DefaultTokenStorage(tokenStorageDir);

    for (const entry of config) {
        const bot = new Bot(
            entry.username,
            entry.password,
            entry.games,
            steamDataDirectory,
            ts,
            entry.online,
        );
        
        // Hata durumunda botun çöküp tüm servisi kapatmasını önlemek için catch ekliyoruz
        await bot.login().catch(err => {
            console.error(`Giriş hatası (${entry.username}):`, err);
        });
    }
} catch (error) {
    console.error("Konfigürasyon veya Başlatma Hatası:", error);
}