// Eski hali: const config = await loadConfig("./config.json");
// Yeni güvenli hali:

const username = Bun.env.STEAM_USERNAME; // Hugging Face Secrets'tan gelir
const password = Bun.env.STEAM_PASSWORD;

if (!username || !password) {
  console.error("HATA: Steam bilgileri Secrets kısmında bulunamadı!");
  process.exit(1);
}

// Botu başlatırken bu değişkenleri kullan
const bot = new Bot(
    username,
    password,
    ["480, 730, 578080, 1599600, 412220, 613100, 503560, 823130, 700330, 291550"], // Oyun ID'lerini buraya elinle yazabilirsin veya onu da Secret yapabilirsin
    steamDataDirectory,
    ts,
    true
);
await bot.login();