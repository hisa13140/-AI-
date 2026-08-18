import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import dotenv from 'dotenv';
import { handleGeminiGenerate, handleGeminiStream } from './src/server/geminiApi.ts';
import express from 'express';

dotenv.config();

function apiServerPlugin(): Plugin {
  return {
    name: 'api-server-plugin',
    configureServer(server) {
      server.middlewares.use(express.json({ limit: '10mb' }));
      server.middlewares.use('/api/gemini/generate', async (req, res) => {
        if (req.method === 'POST') {
          try {
            await handleGeminiGenerate(req as any, res as any);
          } catch (err: any) {
            console.error('Error handling /api/gemini/generate:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err?.message || 'Internal server error' }));
          }
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
      server.middlewares.use('/api/gemini/stream', async (req, res) => {
        if (req.method === 'POST') {
          try {
            await handleGeminiStream(req as any, res as any);
          } catch (err: any) {
            console.error('Error handling /api/gemini/stream:', err);
            if (!res.headersSent) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err?.message || 'Internal streaming error' }));
            }
          }
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
