import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to get GoogleGenAI client
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// AI PDF Summarization / Analysis endpoint
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { text, prompt, action = 'summarize', language = 'vi' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text content is required' });
    }

    const ai = getAIClient();
    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not configured
      const langNotice = language === 'vi' 
        ? '⚠️ Lưu ý: Chưa cấu hình GEMINI_API_KEY. Đây là phân tích mẫu tự động.'
        : '⚠️ Notice: GEMINI_API_KEY not configured. This is a local preview analysis.';
      
      const words = text.trim().split(/\s+/).length;
      const preview = text.slice(0, 300) + '...';

      return res.json({
        result: `${langNotice}\n\n### 📄 ${language === 'vi' ? 'Tổng quan tài liệu' : 'Document Overview'}\n- **${language === 'vi' ? 'Số từ' : 'Word count'}**: ~${words}\n- **${language === 'vi' ? 'Trích đoạn mở đầu' : 'Initial excerpt'}**: "${preview}"\n\n### 💡 ${language === 'vi' ? 'Các điểm chính (Mô phỏng)' : 'Key Points (Preview)'}\n1. Tài liệu chứa nội dung chuyên sâu được phân tích tự động.\n2. Cấu trúc văn bản rõ ràng, các ý chính đã được ghi nhận.\n3. Để mở khóa toàn bộ sức mạnh AI, hãy cung cấp GEMINI_API_KEY trong cài đặt.`
      });
    }

    let systemInstruction = language === 'vi'
      ? 'Bạn là trợ lý AI chuyên nghiệp phân tích tài liệu PDF của HLOVEPDF. Hãy phản hồi bằng Tiếng Việt rõ ràng, định dạng Markdown đẹp mắt, cấu trúc khoa học với các gạch đầu dòng, tóm tắt cô đọng và danh sách ý quan trọng.'
      : 'You are an expert PDF document analysis assistant for HLOVEPDF. Provide structured, accurate, well-formatted Markdown responses with key takeaways and bullet points.';

    let userInstruction = '';
    if (action === 'summarize') {
      userInstruction = language === 'vi'
        ? `Hãy tóm tắt ngắn gọn và nêu bật 5 điểm cốt lõi nhất của tài liệu sau:\n\n${text.slice(0, 25000)}`
        : `Summarize this document clearly and list the top 5 key takeaways:\n\n${text.slice(0, 25000)}`;
    } else if (action === 'chat') {
      userInstruction = `${prompt}\n\nDựa trên nội dung tài liệu sau:\n${text.slice(0, 25000)}`;
    } else if (action === 'translate') {
      userInstruction = language === 'vi'
        ? `Hãy dịch đoạn trích tài liệu sau sang Tiếng Việt một cách tự nhiên và lưu loát:\n\n${text.slice(0, 20000)}`
        : `Translate the following text to fluent English:\n\n${text.slice(0, 20000)}`;
    } else if (action === 'action_items') {
      userInstruction = language === 'vi'
        ? `Hãy trích xuất tất cả các việc cần làm (Action Items), hạn chót (Deadlines) và người phụ trách (nếu có) từ văn bản này:\n\n${text.slice(0, 25000)}`
        : `Extract all action items, tasks, and deadlines from this text:\n\n${text.slice(0, 25000)}`;
    } else {
      userInstruction = `${prompt || 'Analyze this document'}:\n\n${text.slice(0, 25000)}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\n${userInstruction}` }]
        }
      ]
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({ 
      error: error?.message || 'Failed to analyze document with AI',
      result: 'Không thể phân tích tài liệu lúc này. Vui lòng thử lại sau.'
    });
  }
});

// Production / Dev Vite handling
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
