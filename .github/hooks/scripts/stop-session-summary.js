// Stop hook: writes a git-based session summary and shows it via systemMessage.
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const RISK_PATTERN =
  /(TODO|FIXME|XXX|HACK|waitForTimeout\(|dangerouslySetInnerHTML|bypassSecurityTrust|eval\(|exec\(|password|secret|token)/;

function git(args, cwd) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  } catch {
    return '';
  }
}

const lines = (text) => text.split(/\r?\n/).filter(Boolean);

const repoRoot = git(['rev-parse', '--show-toplevel'], process.cwd()).trim();
if (!repoRoot) {
  process.exit(0);
}

const changedFiles = [
  ...new Set([
    ...lines(git(['diff', '--cached', '--name-only'], repoRoot)),
    ...lines(git(['diff', '--name-only'], repoRoot)),
    ...lines(git(['ls-files', '--others', '--exclude-standard'], repoRoot)),
  ]),
];

const riskLines = lines(git(['diff', '--', '.'], repoRoot)).filter((line) => RISK_PATTERN.test(line));

const report = [
  '# Session Summary',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '## Changed Files',
  ...(changedFiles.length ? changedFiles.map((file) => `- ${file}`) : ['- No local changes detected.']),
  '',
  '## Open Risks',
  ...(riskLines.length
    ? [
        '- Potential risk markers detected in current diff:',
        '',
        '```text',
        ...riskLines,
        '```',
        '',
        '- Review required before merge.',
      ]
    : [
        '- No obvious risk markers detected by heuristic scan.',
        '- Residual risk remains: runtime behavior and environment-specific issues are not verified by this hook.',
      ]),
  '',
].join('\n');

const reportDir = path.join(repoRoot, '.github', 'hooks', 'reports');
const reportFile = path.join(reportDir, 'latest-session-summary.md');
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(reportFile, report);

// VS Code zeigt nur systemMessage einer JSON-Antwort auf stdout an.
process.stdout.write(
  JSON.stringify({
    systemMessage: `Session summary (${path.relative(repoRoot, reportFile)}):\n\n${report}`,
  }),
);
