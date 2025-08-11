import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';



export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.use (helmet({
    contentSecurityPolicy:{
      directives:{
        defaultSrc:["'self'"],
        scriptSrc:["'self'","'unsafe-inline'"],
        styleSrc:["'self'","'unsafe-inline'"],
      },
    },
  }));
  const limiter = rateLimit({
    windowMs: 15+60+1000,
    max:100,
    message: "Haz llegado al limite de solicited, intentalo de nuevo en 15 minutos"
  });
  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y',
    // index: 'index.html',
    index:false,
  }));

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    if(originalUrl.includes('..')|| originalUrl.includes('%2e%2e')){
      return res.status(400).send('Bad request');
    }

    return commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}
//Inicia el server
function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
