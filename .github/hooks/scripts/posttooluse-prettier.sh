#!/usr/bin/env bash

set -euo pipefail

payload_file="$(mktemp)"
trap 'rm -f "$payload_file"' EXIT

cat > "$payload_file"

# Read nested fields from JSON safely via Node (jq might not be available).
json_get() {
  local key_path="$1"
  node -e '
const fs = require("fs");
const p = process.argv[1].split(".");
const f = process.argv[2];
let v;
try { v = JSON.parse(fs.readFileSync(f, "utf8")); } catch { process.exit(0); }
for (const k of p) {
  if (v && Object.prototype.hasOwnProperty.call(v, k)) v = v[k];
  else process.exit(0);
}
if (typeof v === "string") process.stdout.write(v);
else if (Array.isArray(v)) process.stdout.write(v.join("\n"));
else if (v && typeof v === "object") process.stdout.write(JSON.stringify(v));
' "$key_path" "$payload_file" 2>/dev/null || true
}

tool_name="$(json_get toolName)"
if [[ -z "$tool_name" ]]; then
  tool_name="$(json_get tool_name)"
fi

# Only run after file-editing tools.
case "$tool_name" in
  apply_patch|create_file|edit_notebook_file)
    ;;
  *)
    exit 0
    ;;
esac

candidate_list="$(mktemp)"
trap 'rm -f "$payload_file" "$candidate_list"' EXIT

{
  json_get toolInput.filePath
  json_get toolInput.filePaths
  json_get input.filePath
  json_get input.filePaths
  json_get parameters.filePath
  json_get parameters.filePaths
} | sed '/^$/d' >> "$candidate_list"

# Extract paths from apply_patch payload, if present.
patch_payload="$(json_get toolInput.input)"
if [[ -n "$patch_payload" ]]; then
  printf '%s\n' "$patch_payload" | sed -n 's/^\*\*\* Update File: //p; s/^\*\*\* Add File: //p' >> "$candidate_list"
fi

# Keep existing files only and deduplicate.
mapfile -t files < <(awk '!seen[$0]++' "$candidate_list" | while IFS= read -r path; do
  if [[ -f "$path" ]]; then
    printf '%s\n' "$path"
  fi
done)

if [[ ${#files[@]} -eq 0 ]]; then
  exit 0
fi

# Format using project-local Prettier when available.
if command -v npx >/dev/null 2>&1; then
  npx --no-install prettier --ignore-unknown --write "${files[@]}" >/dev/null 2>&1 || \
    npx prettier --ignore-unknown --write "${files[@]}" >/dev/null 2>&1 || true
fi

exit 0