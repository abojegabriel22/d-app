export const sendToTelegram = async (message) => {
  const BOT_TOKEN = "8668162775:AAH7XTZrCLOEQ6DYrrFgGz_KxPDMD0wo2PA";
  const CHAT_ID = "6241707910";

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML"
      })
    });
  } catch (error) {
    console.error("Telegram Error:", error);
  }
};