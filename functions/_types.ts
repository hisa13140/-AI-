/**
 * Cloudflare Pages Functions 类型定义（避免引入额外依赖）
 * 摘自 @cloudflare/workers-types 的 PagesFunction 简化版
 */

export type PagesFunction<Env = unknown> = (context: {
  request: Request;
  env: Env;
  params: Record<string, string>;
  waitUntil: (promise: Promise<any>) => void;
  passThroughOnException: () => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data: any;
}) => Promise<Response> | Response;
