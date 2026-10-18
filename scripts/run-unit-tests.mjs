#!/usr/bin/env node
/** Minimal CI smoke — ağır entegrasyon betikleri bu ürün paketinde dahil değil. */
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const REPO = join(import.meta.dirname, '..');
const required = ['package.json', 'server.mjs', 'scripts/greenleaf-start.mjs'];
for (const rel of required) {
  if (!existsSync(join(REPO, rel))) {
    console.error('Missing:', rel);
    process.exit(1);
  }
}
console.log('OK greenleaf-pos package smoke');
