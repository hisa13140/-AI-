/**
 * Express 适配层 —— 包装 geminiCore 给本地 dev server 使用
 * 生产环境走 Cloudflare Pages Functions（见 functions/ 目录）
 */

import type { Request, Response } from "express";
import { generateText, generateTextStream, GeminiError } from "./geminiCore";

function sendJson(res: any, statusCode: number, data: any) {
  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(statusCode).json(data);
  }
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

async function getRequestBody(req: any): Promise<any> {
  if (req.body && typeof req.body === "object" && Object.keys(req.body).length > 0) {
    return req.body;
  }
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk: any) => { raw += chunk; });
    req.on("end", () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve({}); }
    });
    req.on("error", () => resolve({}));
  });
}

export async function handleGeminiGenerate(req: Request, res: Response) {
  try {
    const body = await getRequestBody(req);
    const { prompt, systemInstruction, temperature, responseMimeType } = body || {};
    if (!prompt) return sendJson(res, 400, { error: "缺少提示词 (Prompt is required)" });

    const result = await generateText({ prompt, systemInstruction, temperature, responseMimeType });
    return sendJson(res, 200, result);
  } catch (err: any) {
    const status = err instanceof GeminiError ? err.status : 500;
    console.error("[express] /api/gemini/generate error:", err);
    return sendJson(res, status, { error: err?.message || "AI 生成失败，请稍后重试" });
  }
}

export async function handleGeminiStream(req: Request, res: Response) {
  try {
    const body = await getRequestBody(req);
    const { prompt, systemInstruction, temperature } = body || {};
    if (!prompt) {
      res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
      return res.end(`data: ${JSON.stringify({ error: "缺少提示词" })}\n\n`);
    }

    const stream = generateTextStream({ prompt, systemInstruction, temperature });

    if (!res.headersSent) {
      res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");
      if (typeof res.flushHeaders === "function") res.flushHeaders();
    }

    const reader = stream.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
    res.end();
  } catch (err: any) {
    console.error("[express] /api/gemini/stream error:", err);
    if (!res.headersSent) {
      res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
      res.end(`data: ${JSON.stringify({ error: err?.message || "AI 流式生成失败" })}\n\n`);
    } else {
      res.end();
    }
  }
}
