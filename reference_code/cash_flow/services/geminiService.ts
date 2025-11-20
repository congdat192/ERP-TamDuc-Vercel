import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, AIAnalysisResult, Branch } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFinances = async (
  transactions: Transaction[],
  branchName: string
): Promise<AIAnalysisResult> => {
  
  // Prepare data for the model (simplify to save tokens if needed, but JSON is usually fine for small datasets)
  const dataSummary = JSON.stringify(transactions.slice(0, 50)); // Analyze last 50 transactions for context

  const prompt = `
    Bạn là một chuyên gia phân tích tài chính AI cho một công ty.
    Dữ liệu đang xem xét thuộc về: ${branchName}.
    Dưới đây là danh sách các giao dịch gần đây (JSON):
    ${dataSummary}

    Hãy phân tích dữ liệu này và cung cấp đầu ra JSON theo schema sau:
    1. "summary": Một đoạn văn ngắn tổng quan về tình hình tài chính (Tiếng Việt).
    2. "insights": Một mảng các chuỗi (string), mỗi chuỗi là một điểm nổi bật hoặc xu hướng (ví dụ: chi phí nào đang tăng cao, nguồn thu nào tốt).
    3. "recommendations": Một mảng các chuỗi (string), đưa ra lời khuyên cụ thể để cải thiện dòng tiền.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            insights: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIAnalysisResult;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      summary: "Không thể thực hiện phân tích lúc này.",
      insights: ["Vui lòng kiểm tra lại kết nối hoặc khóa API."],
      recommendations: []
    };
  }
};
