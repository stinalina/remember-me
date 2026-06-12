#!/usr/bin/env bash

set -euo pipefail

# Consume hook payload (currently unused, but read to keep stdin clean).
cat >/dev/null || true

if ! command -v git >/dev/null 2>&1; then
  exit 0
fi

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$repo_root" ]]; then
  exit 0
fi

cd "$repo_root"

summary_dir=".github/hooks/reports"
mkdir -p "$summary_dir"
report_file="$summary_dir/latest-session-summary.md"

staged_files="$(git diff --cached --name-only || true)"
unstaged_files="$(git diff --name-only || true)"
untracked_files="$(git ls-files --others --exclude-standard || true)"

# Heuristic risk markers for open follow-up checks.
potential_risks="$(git diff -- . \
  | grep -E "(TODO|FIXME|XXX|HACK|waitForTimeout\(|dangerouslySetInnerHTML|bypassSecurityTrust|eval\(|exec\(|password|secret|token)" \
  || true)"

{
  echo "# Session Summary"
  echo
  echo "Generated: $(date -u +"%Y-%m-%d %H:%M:%SZ")"
  echo
  echo "## Changed Files"
  if [[ -n "$staged_files" || -n "$unstaged_files" || -n "$untracked_files" ]]; then
    {
      printf '%s\n' "$staged_files"
      printf '%s\n' "$unstaged_files"
      printf '%s\n' "$untracked_files"
    } | sed '/^$/d' | awk '!seen[$0]++' | sed 's/^/- /'
  else
    echo "- No local changes detected."
  fi
  echo
  echo "## Open Risks"
  if [[ -n "$potential_risks" ]]; then
    echo "- Potential risk markers detected in current diff:"
    echo
    echo "\`\`\`text"
    printf '%s\n' "$potential_risks"
    echo "\`\`\`"
    echo
    echo "- Review required before merge."
  else
    echo "- No obvious risk markers detected by heuristic scan."
    echo "- Residual risk remains: runtime behavior and environment-specific issues are not verified by this hook."
  fi
} >"$report_file"

echo "Session summary written to $report_file"
exit 0