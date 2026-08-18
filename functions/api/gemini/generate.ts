/**
 * Cloudflare Pages Function: POST /api/gemini/generate
 * 把 Web Request 翻译成核心 generateText 调用
 */

import type { PagesFunction } from "../../_types";

interface Env {
  GEMINI_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const body = (await request.json().catch(() => ({}))) as any;
    const { prompt, systemInstruction, temperature, responseMimeType } = body || {};

    if (!prompt) {
      return jsonResponse({ error: "缺少提示词 (Prompt is required)" }, 400);
    }

    const { generateText } = await import("../../../src/server/geminiCore");
    const result = await generateText(
      { prompt, systemInstruction, temperature, responseMimeType },
      env as any
    );

    return jsonResponse(result, 200);
  } catch (err: any) {
    console.error("[cf-fn] /api/gemini/generate error:", err);
    const status = err?.status || 500;
    return jsonResponse(
      { error: err?.message || "AI 生成失败，请稍后重试" },
      status
    );
  }
};

export const onRequestGet: PagesFunction = () =>
  jsonResponse({ error: "Method Not Allowed" }, 405);

export const onRequestOptions: PagesFunction = () =>
  new Response(null, { status: 204, headers: corsHeaders() });

function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders() },
  });
}

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
