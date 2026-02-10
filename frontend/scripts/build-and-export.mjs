import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

const root = resolve(process.cwd());
const dist = resolve(root, 'dist');
const staticDir = resolve(root, '../regist/src/main/resources/static/spa');

execSync('npm run build', { stdio: 'inherit' });
rmSync(staticDir, { recursive: true, force: true });
mkdirSync(staticDir, { recursive: true });
cpSync(dist, staticDir, { recursive: true });

console.log('Exported frontend dist to Spring static/spa');
