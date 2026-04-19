import { Bot } from "./bot";
import { loadConfig } from "./config";
import { DefaultTokenStorage } from "./token-storage";

// --- HUGGING FACE HEALTH CHECK SERVER START ---
// Hugging Face'in "Starting" durumunda takılmasını önlemek için 7860 portunu açıyoruz.
Bun.serve({
  port: 7860,
  fetch(req) {
    return new Response("Steam Hour Booster is Running! 🚀");
  },
});
console.info("Health check server is live on port 7860");
// --- HUGGING FACE HEALTH CHECK SERVER END ---

console.info("Starting Steam Hour Booster");

const configPath = Bun.env["CONFIG_PATH"] ?? "./config.json";
const tokenStorageDir = Bun.env["TOKEN_STORAGE_DIRECTORY"] ?? "./tokens";
const steamDataDirectory = Bun.env["STEAM_DATA_DIRECTORY"] ?? "./steam-data";

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
	await bot.login();
}