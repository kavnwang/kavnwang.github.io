import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';
import config from '../site.config.mjs';

const IMAGE_EXT = ['png','jpg','jpeg','gif','webp','svg','bmp','tiff','avif'];

async function copyFileEnsureDir(src, dest) {
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  await fs.promises.copyFile(src, dest);
}

function parseVaultArgs() {
  const vaultArgs = process.argv.filter(a => a.startsWith('--vault='));
  const vals = vaultArgs.map(a => a.slice('--vault='.length)).filter(Boolean);
  return vals;
}

async function syncVaultAssets() {
  const cliVaults = parseVaultArgs();
  const vaults = (cliVaults.length ? cliVaults : (config.vaultPaths || [])).filter(Boolean);
  if (!vaults.length) {
    console.log('No vaultPaths configured in site.config.mjs; skipping asset sync');
    return;
  }

  let copied = 0;
  for (const vaultPath of vaults) {
    const patterns = [
      path.join(vaultPath, 'Images/**/*'),
      path.join(vaultPath, 'images/**/*'),
      path.join(vaultPath, 'assets/**/*'),
      path.join(vaultPath, 'img/**/*'),
      path.join(vaultPath, `**/*.{${IMAGE_EXT.join(',')}}`),
    ].map(p => p.replace(/\\/g, '/'));

    const ignore = (config.ignorePatterns || []).map(p => p.replace(/\\/g, '/'));
    const entries = await fg(patterns, { dot: false, onlyFiles: true, ignore });

    for (const abs of entries) {
      const rel = path.relative(vaultPath, abs).replace(/\\/g, '/');
      const out = path.join(process.cwd(), 'public', rel).replace(/\\/g, '/');
      try {
        await copyFileEnsureDir(abs, out);
        copied += 1;
      } catch (e) {
        console.warn('Failed to copy asset', abs, '->', out, e?.message);
      }
    }
  }
  console.log(`Synced ${copied} asset(s) into public/`);
}

syncVaultAssets().catch(err => { console.error(err); process.exit(1); });
