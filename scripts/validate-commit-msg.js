#!/usr/bin/env node

const fs = require('node:fs');

const COMMIT_MSG_FILE = process.argv[2];
const CONVENTIONAL_COMMIT_REGEX = /^(build|chore|ci|docs|feat|fix|perf|refactor|style|test|revert)(\([A-Z0-9._\/-]+\))?(!)?:/;

if (!COMMIT_MSG_FILE) {
  console.error('[COMMIT-CHECK] Kein Commit-Message-Pfad uebergeben.');
  process.exit(1);
}

const raw = fs.readFileSync(COMMIT_MSG_FILE, 'utf8');
const firstLine = raw
  .split(/\r?\n/)
  .find((line) => line.trim().length > 0)
  ?.trim() || '';

if (!CONVENTIONAL_COMMIT_REGEX.test(firstLine)) {
  console.error('\n[COMMIT-CHECK] Ungueltige Commit-Message.');
  console.error(`[COMMIT-CHECK] Gefunden: "${firstLine}"`);
  console.error('[COMMIT-CHECK] Erwartet Prefix wie feat:, fix:, chore:, docs:, ...');
  process.exit(1);
}
