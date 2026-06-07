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
      '@semantic-release/git',
      {
        assets: ['docs/CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};
