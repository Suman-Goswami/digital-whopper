import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const clientDist = path.resolve(__dirname, '../dist/client');
const serverEntry = path.resolve(__dirname, '../dist/server/entry-server.js');

app.use(
  '/assets',
  express.static(path.join(clientDist, 'assets'), {
    immutable: true,
    maxAge: '1y',
  })
);

app.use(express.static(clientDist, { index: false }));

app.use(async (req, res) => {
  try {
    const template = await fs.readFile(
      path.join(clientDist, 'index.html'),
      'utf-8'
    );

    const { render } = await import(pathToFileURL(serverEntry).href);

    const appHtml = await render(req.originalUrl || '/');

    const html = template.replace('<!--app-html-->', appHtml);

    res.status(200).setHeader('Content-Type', 'text/html');
    res.end(html);
  } catch (error) {
    console.error('SSR function error:', error);
    res.status(500).end(error.stack || String(error));
  }
});

export default app;