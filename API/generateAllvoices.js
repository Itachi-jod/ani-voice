require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

const apiKey = process.env.ELEVENLABS_API_KEY;
const text = "Ore wa Itachi. Sasuke, yamerou!"; // your dialogue here

async function getVoices() {
  try {
    const res = await axios.get("https://api.elevenlabs.io/v1/voices", {
      headers: {
        "xi-api-key": apiKey
      }
    });
    return res.data.voices;
  } catch (err) {
    console.error("❌ Failed to fetch voices:", err.response?.data || err.message);
    return [];
  }
}

async function generateVoice(text, voice) {
  try {
    const response = await axios({
      method: 'POST',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${voice.voice_id}`,
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      data: {
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.7
        }
      },
      responseType: 'arraybuffer',
    });

    const fileName = `anime-${voice.name.replace(/\s+/g, "_")}.mp3`;
    fs.writeFileSync(fileName, response.data);
    console.log(`✅ Saved: ${fileName}`);
  } catch (err) {
    console.error(`❌ Failed for ${voice.name}:`, err.response?.data || err.message);
  }
}

(async () => {
  const voices = await getVoices();

  if (!voices.length) return;

  for (const voice of voices) {
    await generateVoice(text, voice);
  }
})();
