module.exports = {
  branches: ['master'],
  plugins: [
    '@semantic-release/commit-analyzer',
    [
      '@semantic-release/release-notes-generator',
      {
        writerOpts: {
          transform: (commit) => {
            const header = String(commit.header || '');
            const subject = String(commit.subject || '');

            // Keep only commits that reference NOTIFY in header/subject.
            if (!/NOTIFY/i.test(header) && !/NOTIFY/i.test(subject)) {
              return false;
            }

            return commit;
          },
        },
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'docs/CHANGELOG.md',
        changelogTitle:
          '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).',
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['docs/CHANGELOG.md', 'package.json', 'package-lock.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    // Fires only when a release was actually created. Notifies the backend AZ
    // Function which fans out release e-mails to all opted-in users via queue.
    // Requires env vars RELEASE_MAIL_FN_URL and RELEASE_MAIL_FN_KEY provided by the workflow.
    [
      '@semantic-release/exec',
      {
        successCmd:
          'curl --fail --show-error --silent --retry 3 --retry-connrefused --max-time 30 ' +
          '--request POST ' +
          '--header "Content-Type: application/json" ' +
          '--data \'{"version":"${nextRelease.version}",' + '"$RELEASE_MAIL_FN_URL"',
      },
    ],
  ],
};
