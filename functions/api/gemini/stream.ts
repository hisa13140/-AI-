/**
 * Cloudflare Pages Function: POST /api/gemini/stream
 * 流式 SSE 响应
 */

import type { PagesFunction } from "../../_types";

interface Env {
  GEMINI_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const body = (await request.json().catch(() => ({}))) as any;
    const { prompt, systemInstruction, temperature } = body || {};

    if (!prompt) {
      return new Response(
        `data: ${JSON.stringify({ error: "缺少提示词 (Prompt is required)" })}\n\n`,
        { status: 400, headers: sseHeaders() }
      );
    }

    const { generateTextStream } = await import("../../../src/server/geminiCore");
    const stream = generateTextStream(
      { prompt, systemInstruction, temperature },
      env as any
    );

    return new Response(stream, { status: 200, headers: sseHeaders() });
  } catch (err: any) {
    console.error("[cf-fn] /api/gemini/stream error:", err);
    return new Response(
      `data: ${JSON.stringify({ error: err?.message || "AI 流式生成失败" })}\n\n`,
      { status: err?.status || 500, headers: sseHeaders() }
    );
  }
};

export const onRequestGet: PagesFunction = () =>
  new Response("Method Not Allowed", { status: 405 });

export const onRequestOptions: PagesFunction = () =>
  new Response(null, { status: 204, headers: corsHeaders() });

function sseHeaders(): HeadersInit {
  return {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no",
    ...corsHeaders(),
  };
}

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
