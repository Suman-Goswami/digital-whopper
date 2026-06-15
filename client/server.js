import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;
const base = process.env.BASE || '/';

const app = express();

let vite;
let productionTemplate;

const resolvePath = (filePath) => path.resolve(__dirname, filePath);

if (!isProduction) {
  const { createServer } = await import('vite');

  vite = await createServer({
    root: __dirname,
    server: {
      middlewareMode: true,
    },
    appType: 'custom',
    base,
  });

  app.use(vite.middlewares);
} else {
  productionTemplate = await fs.readFile(
    resolvePath('dist/client/index.html'),
    'utf-8'
  );

  app.use(
    base,
    express.static(resolvePath('dist/client'), {
      index: false,
    })
  );
}

app.use(async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end('Method Not Allowed');
    }

    const url = req.originalUrl;

    let template;
    let render;

    if (!isProduction) {
      template = await fs.readFile(resolvePath('index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render;
    } else {
      template = productionTemplate;
      render = (await import('./dist/server/entry-server.js')).render;
    }

    const appHtml = await render(url);

    if (
      typeof appHtml === 'string' &&
      (appHtml.includes('<!doctype html') || appHtml.includes('<html'))
    ) {
      throw new Error(
        'entry-server.jsx must return only the React app HTML, not the full index.html document.'
      );
    }

    const html = template.replace('<!--app-html-->', appHtml);

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (error) {
    vite?.ssrFixStacktrace(error);
    console.error(error);
    res.status(500).end(error.stack);
  }
});

app.listen(port, () => {
  console.log(`SSR server running at http://localhost:${port}`);
});