const verifyConditions = [
  ['@semantic-release/changelog'],
  [
    '@semantic-release/git',
    {
      assets: ['package.json', 'CHANGELOG.md'],
      message:
        'chore(release): ${nextRelease.version} [ci-skip]\n\n${nextRelease.notes}'
    }
  ]
];

const analyzeCommits = [['@semantic-release/commit-analyzer']];

const generateNotes = ['@semantic-release/release-notes-generator'];
const prepare = [
  '@semantic-release/changelog',
  [
    '@semantic-release/npm',
    {
      // this here is just for package.log update
      npmPublish: false
    }
  ],
  [
    '@semantic-release/git',
    {
      assets: ['package.json', 'package-lock.json', 'CHANGELOG.md'],
      message:
        'chore(release): ${nextRelease.version} [ci-skip]\n\n${nextRelease.notes}'
    }
  ]
];

// skipped steps
const verifyRelease = [];
const fail = [];
const success = [];
const addChannel = [];

module.exports = {
  repositoryUrl:
    'https://gitlab.corp.cic.es/CIC/Corporativo/tuesday-talks/02-vuejs-creando-una-web-del-tiempo.git',
  branches: ['origin/main', 'main'],
  verifyConditions,
  analyzeCommits,
  verifyRelease,
  generateNotes,
  publish: '@semantic-release/npm',
  prepare,
  fail,
  success,
  addChannel
};
