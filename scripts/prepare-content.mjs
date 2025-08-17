import { spawnSync } from 'node:child_process';

const forwardArgs = process.argv.slice(2);

function run(scriptPath) {
  const result = spawnSync(process.execPath, [scriptPath, ...forwardArgs], {
    stdio: 'inherit'
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run('scripts/build-content.mjs');
run('scripts/sync-assets.mjs');
