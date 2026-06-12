#!/usr/bin/env bash

set -euo pipefail

payload_file="$(mktemp)"
trap 'rm -f "$payload_file"' EXIT
cat >"$payload_file" || true

if ! command -v git >/dev/null 2>&1; then
  exit 0
fi

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$repo_root" ]]; then
  exit 0
fi

cd "$repo_root"

if ! command -v npx >/dev/null 2>&1; then
  echo "[stop-problems-gate] npx is not available; cannot run TypeScript diagnostics."
  exit 0
fi

# Run TypeScript checker in no-emit mode and parse canonical TS error lines.
get_ts_error_lines() {
  local output
  output="$(npx tsc --noEmit --pretty false 2>&1 || true)"
  printf '%s\n' "$output" | grep -E "\.tsx?\([0-9]+,[0-9]+\): error TS[0-9]+:" || true
}

count_lines() {
  printf '%s\n' "$1" | sed '/^$/d' | wc -l | tr -d ' '
}

initial_error_lines="$(get_ts_error_lines)"
initial_error_count="$(count_lines "$initial_error_lines")"

if [[ "$initial_error_count" == "0" ]]; then
  echo "[stop-problems-gate] No TypeScript syntax/compiler errors detected."
  exit 0
fi

echo "[stop-problems-gate] Found $initial_error_count TypeScript error(s) before auto-fix."

if command -v npm >/dev/null 2>&1; then
  echo "[stop-problems-gate] Running auto-fix via npm run lint -- --fix ..."
  npm run lint -- --fix >/dev/null 2>&1 || true
fi

final_error_lines="$(get_ts_error_lines)"
final_error_count="$(count_lines "$final_error_lines")"

if [[ "$final_error_count" == "0" ]]; then
  echo "[stop-problems-gate] Auto-fix removed all TypeScript errors."
  exit 0
fi

if [[ "$final_error_count" != "$initial_error_count" ]]; then
  echo "[stop-problems-gate] Auto-fix reduced errors: $initial_error_count -> $final_error_count"
else
  echo "[stop-problems-gate] Auto-fix could not reduce TypeScript errors."
fi

echo "[stop-problems-gate] Blocking stop until remaining errors are fixed."
echo
printf '%s\n' "$final_error_lines" | head -n 80

# Non-zero exit blocks Stop hook.
exit 2
