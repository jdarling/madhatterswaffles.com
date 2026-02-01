import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { build } from 'esbuild';
import { pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const staticDir = path.join(rootDir, 'docs');

const routesToRender = ['/', '/menu'];

async function loadTemplate() {
  const templatePath = path.join(staticDir, 'index.html');
  return fs.readFile(templatePath, 'utf8');
}

function renderRoute(route, template, AppShell) {
  const markup = renderToString(
    React.createElement(
      StaticRouter,
      { location: route },
      React.createElement(AppShell)
    )
  );

  return template.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${markup}</div>`
  );
}

async function writeRouteHtml(route, html) {
  const routePath = route.replace(/^\//, '');
  const outputDir = routePath ? path.join(staticDir, routePath) : staticDir;
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, 'index.html'), html, 'utf8');
}

async function prerender() {
  const template = await loadTemplate();
  const prerenderDir = path.join(rootDir, '.prerender');
  const entry = path.join(rootDir, 'src', 'AppShell.jsx');
  const outfile = path.join(prerenderDir, 'AppShell.mjs');

  await fs.mkdir(prerenderDir, { recursive: true });
  await build({
    entryPoints: [entry],
    outfile,
    bundle: true,
    platform: 'node',
    format: 'esm',
    jsx: 'automatic',
    logLevel: 'silent',
    external: ['react', 'react-dom', 'react-dom/server', 'react-router'],
    loader: {
      '.png': 'dataurl',
      '.jpg': 'dataurl',
      '.jpeg': 'dataurl',
      '.svg': 'dataurl',
      '.avif': 'dataurl',
      '.webp': 'dataurl',
    },
  });

  const { default: AppShell } = await import(pathToFileURL(outfile).href);
  for (const route of routesToRender) {
    const html = renderRoute(route, template, AppShell);
    await writeRouteHtml(route, html);
  }
}

prerender();
