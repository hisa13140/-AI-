import { GoogleGenAI } from "@google/genai";
import type { Request, Response } from "express";

// Safe JSON response helper that works with both Express and Node native ServerResponse
function sendJson(res: any, statusCode: number, data: any) {
  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(statusCode).json(data);
  }
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

// Safe body parser for requests in both Express and Vite connect middleware
async function getRequestBody(req: any): Promise<any> {
  if (req.body && typeof req.body === "object" && Object.keys(req.body).length > 0) {
    return req.body;
  }
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk: any) => {
      raw += chunk;
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
    req.on("error", () => {
      resolve({});
    });
  });
}

// Candidate supported models ordered by immediate availability and resilience
// gemini-3.1-flash-lite provides high throughput and avoids 503 high-demand queues
const CANDIDATE_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
];

export async function handleGeminiGenerate(req: Request, res: Response) {
  try {
    const body = await getRequestBody(req);
    const { prompt, systemInstruction, temperature, responseMimeType } = body || {};

    if (!prompt) {
      return sendJson(res, 400, { error: "缺少提示词 (Prompt is required)" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return sendJson(res, 500, { 
        error: "未配置 GEMINI_API_KEY，请在环境变量中配置。" 
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const config: Record<string, any> = {
      temperature: typeof temperature === "number" ? temperature : 0.7,
    };

    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    if (responseMimeType) {
      config.responseMimeType = responseMimeType;
    }

    let lastError: any = null;
    let generatedText = "";

    // Iterate through candidates until one succeeds
    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config,
        });
        generatedText = response.text || "";
        if (generatedText) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} generateContent failed:`, err?.message || err);
      }
    }

    if (!generatedText && lastError) {
      throw lastError;
    }

    return sendJson(res, 200, { text: generatedText });
  } catch (err: any) {
    console.error("Gemini API generation error:", err);
    return sendJson(res, 500, { 
      error: err?.message || "AI 生成失败，请稍后重试" 
    });
  }
}

export async function handleGeminiStream(req: Request, res: Response) {
  try {
    const body = await getRequestBody(req);
    const { prompt, systemInstruction, temperature } = body || {};

    if (!prompt) {
      return sendJson(res, 400, { error: "缺少提示词 (Prompt is required)" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return sendJson(res, 500, { 
        error: "未配置 GEMINI_API_KEY，请在环境变量中配置。" 
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const config: Record<string, any> = {
      temperature: typeof temperature === "number" ? temperature : 0.7,
    };

    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    let streamSuccess = false;
    let lastError: any = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContentStream({
          model: modelName,
          contents: prompt,
          config,
        });

        // Set headers once we successfully open stream
        if (!res.headersSent) {
          res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
          res.setHeader("Cache-Control", "no-cache, no-transform");
          res.setHeader("Connection", "keep-alive");
          res.setHeader("X-Accel-Buffering", "no");
          if (typeof res.flushHeaders === "function") {
            res.flushHeaders();
          }
        }

        for await (const chunk of response) {
          const text = chunk.text || "";
          if (text) {
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
          }
        }

        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
        streamSuccess = true;
        break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Streaming with ${modelName} failed:`, err?.message || err);
        // If headers already sent and stream broke mid-way, don't attempt to re-send headers
        if (res.headersSent) {
          break;
        }
      }
    }

    if (!streamSuccess) {
      if (!res.headersSent) {
        return sendJson(res, 500, { error: lastError?.message || "AI 流式生成失败" });
      } else {
        res.write(`data: ${JSON.stringify({ error: lastError?.message || "AI 流式生成中断" })}\n\n`);
        res.end();
      }
    }
  } catch (err: any) {
    console.error("Gemini API streaming general error:", err);
    if (!res.headersSent) {
      return sendJson(res, 500, { error: err?.message || "AI 流式生成失败" });
    } else {
      res.write(`data: ${JSON.stringify({ error: err?.message || "AI 流式生成中断" })}\n\n`);
      res.end();
    }
  }
}
