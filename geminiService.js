import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini API key'ini tanımla
const API_KEY = "";

// API key'i console'da göster
console.log("API_KEY değeri:", API_KEY);
console.log("API_KEY tipi:", typeof API_KEY);
console.log("API_KEY uzunluğu:", API_KEY ? API_KEY.length : "undefined");

const genAI = new GoogleGenerativeAI(API_KEY);

export const getTaskAdvice = async (taskTitle) => {
  try {
    // API key kontrolü
    if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY") {
      console.error("API key bulunamadı:", API_KEY);
      return "API key bulunamadı. Lütfen .env dosyasını kontrol edin.";
    }

    console.log("API key yüklendi:", API_KEY.substring(0, 10) + "...");
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    Aşağıdaki görev için bana yardımcı ol:
    
    Görev: ${taskTitle}
    
    Lütfen şu konularda öneriler ver:
    1. Bu görevi yaparken dikkat edilmesi gereken önemli noktalar
    2. Görevi daha verimli yapmak için ipuçları
    3. Olası zorluklar ve çözüm önerileri
    4. Görev için gerekli olabilecek araçlar veya kaynaklar
    5. Zaman yönetimi önerileri
    
    Yanıtını Türkçe olarak, madde madde ve kısa tut. Toplam 150-200 kelime civarında olsun.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API hatası:", error);
    return `API Hatası: ${error.message}. Lütfen API key'inizi kontrol edin.`;
  }
}; 