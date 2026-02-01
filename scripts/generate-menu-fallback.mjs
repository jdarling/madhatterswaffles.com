import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';
import dataSources from '../src/config/dataSources.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'src', 'data');
const outputFile = path.join(outputDir, 'menuFallback.json');

function normalizeMenuRows(rows) {
  return rows.filter((row) =>
    Object.values(row || {}).some((value) => String(value || '').trim() !== '')
  );
}

async function readExistingFallback() {
  try {
    const existing = await fs.readFile(outputFile, 'utf8');
    return JSON.parse(existing);
  } catch (error) {
    return null;
  }
}

async function generateFallback() {
  const generatedAt = new Date().toISOString();
  let rows = [];

  try {
    const response = await fetch(dataSources.menuCsvUrl);
    if (!response.ok) {
      throw new Error(`Menu CSV request failed with ${response.status}`);
    }
    const csvText = await response.text();
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    rows = normalizeMenuRows(parsed.data || []);
  } catch (error) {
    const existing = await readExistingFallback();
    if (existing) {
      await fs.mkdir(outputDir, { recursive: true });
      await fs.writeFile(outputFile, JSON.stringify(existing, null, 2) + '\n', 'utf8');
      console.warn('Menu fallback generation failed; kept existing fallback.');
      return;
    }
    console.warn(`Menu fallback generation failed: ${error.message}`);
  }

  const payload = {
    generatedAt,
    rows,
  };

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(outputFile, JSON.stringify(payload, null, 2) + '\n', 'utf8');
}

generateFallback();
