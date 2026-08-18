const { spawnSync } = require('child_process');

const nodeMajor = Number(process.versions.node.split('.')[0]);
const args = process.argv.slice(2);
const env = { ...process.env };
const legacyOpenSslFlag = '--openssl-legacy-provider';

if (nodeMajor >= 17) {
  const nodeOptions = env.NODE_OPTIONS || '';

  if (!nodeOptions.includes(legacyOpenSslFlag)) {
    env.NODE_OPTIONS = nodeOptions
      ? `${legacyOpenSslFlag} ${nodeOptions}`
      : legacyOpenSslFlag;
  }
}

const result = spawnSync(
  process.execPath,
  [require.resolve('react-scripts/bin/react-scripts.js'), ...args],
  {
    stdio: 'inherit',
    env,
  }
);

if (result.error) {
  throw result.error;
}

process.exit(result.status === null ? 1 : result.status);
