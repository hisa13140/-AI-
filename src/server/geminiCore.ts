/**
 * Gemini API 业务逻辑核心 —— 不依赖任何 Web 框架
 * 可被 Express server、Cloudflare Pages Functions、Vite dev middleware 共用
 */

import { GoogleGenAI } from "@google/genai";

// 候选模型：按可用性 + 抗 503 排队优先级排序
// gemini-3.1-flash-lite 走量大、排队少；其他作为兜底
const CANDIDATE_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
];

export interface GenerateInput {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  responseMimeType?: string;
}

export interface GenerateOutput {
  text: string;
}

export class GeminiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

function getApiKey(env: Record<string, any> = process.env): string {
  const key = env.GEMINI_API_KEY;
  if (!key) {
    throw new GeminiError("未配置 GEMINI_API_KEY，请在环境变量中配置。", 500);
  }
  return key;
}

function makeClient(apiKey: string) {
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: { "User-Agent": "eduspark-edu/1.0" },
    },
  });
}

/**
 * 同步生成：依次尝试候选模型，直到一个成功
 */
export async function generateText(
  input: GenerateInput,
  env: Record<string, any> = process.env
): Promise<GenerateOutput> {
  if (!input.prompt) {
    throw new GeminiError("缺少提示词 (Prompt is required)", 400);
  }

  const apiKey = getApiKey(env);
  const ai = makeClient(apiKey);

  const config: Record<string, any> = {
    temperature: typeof input.temperature === "number" ? input.temperature : 0.7,
  };
  if (input.systemInstruction) config.systemInstruction = input.systemInstruction;
  if (input.responseMimeType) config.responseMimeType = input.responseMimeType;

  let lastError: any = null;
  for (const modelName of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: input.prompt,
        config,
      });
      const text = (response as any).text || "";
      if (text) return { text };
    } catch (err: any) {
      lastError = err;
      console.warn(`[gemini] generate ${modelName} failed:`, err?.message || err);
    }
  }

  if (lastError) {
    throw new GeminiError(lastError?.message || "AI 生成失败", 500);
  }
  throw new GeminiError("所有候选模型均无可用响应", 500);
}

export interface StreamChunk {
  text?: string;
  done?: boolean;
  error?: string;
}

/**
 * 流式生成：返回 Web ReadableStream，吐 SSE 格式（data: {json}\n\n）
 * - 任意一个模型成功开启流就持续用
 * - 失败回退到下一个候选模型
 */
export function generateTextStream(
  input: GenerateInput,
  env: Record<string, any> = process.env
): ReadableStream<Uint8Array> {
  if (!input.prompt) {
    const msg = JSON.stringify({ error: "缺少提示词 (Prompt is required)" });
    return new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(`data: ${msg}\n\n`));
        controller.close();
      },
    });
  }

  const apiKey = getApiKey(env);
  const ai = makeClient(apiKey);

  const config: Record<string, any> = {
    temperature: typeof input.temperature === "number" ? input.temperature : 0.7,
  };
  if (input.systemInstruction) config.systemInstruction = input.systemInstruction;

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      let succeeded = false;
      let lastError: any = null;

      for (const modelName of CANDIDATE_MODELS) {
        try {
          const response = await ai.models.generateContentStream({
            model: modelName,
            contents: input.prompt,
            config,
          });

          for await (const chunk of response as any) {
            const text = chunk?.text || "";
            if (text) {
              const payload = JSON.stringify({ text });
              controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
            }
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          succeeded = true;
          break;
        } catch (err: any) {
          lastError = err;
          console.warn(`[gemini] stream ${modelName} failed:`, err?.message || err);
        }
      }

      if (!succeeded) {
        const msg = lastError?.message || "AI 流式生成失败";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
        );
      }

      controller.close();
    },
  });
}
