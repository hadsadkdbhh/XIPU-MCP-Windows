import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

if (process.platform !== 'win32') throw new Error('Windows runtime packaging must run on Windows.');
if (process.versions.electron) throw new Error('Run Windows packaging with standalone Node.js, not Electron’s embedded Node runtime.');
if (!['x64', 'arm64'].includes(process.arch)) throw new Error(`Unsupported Windows architecture: ${process.arch}`);
if (Number(process.versions.node.split('.')[0]) < 22) throw new Error('Node 22 or newer is required to build XIPU MCP.');

const folder = path.resolve('runtime', `win32-${process.arch}`);
await mkdir(folder, { recursive: true });
const node = await readFile(process.execPath);
await writeFile(path.join(folder, 'node.exe'), node);
await copyFile(path.join(path.dirname(process.execPath), 'LICENSE'), path.join(folder, 'node-LICENSE')).catch(async () => {
  const response = await fetch(`https://raw.githubusercontent.com/nodejs/node/${process.version}/LICENSE`);
  if (!response.ok) throw new Error(`Could not obtain the Node.js license: HTTP ${response.status}`);
  const license = await response.text();
  if (!license.includes('Node.js contributors')) throw new Error('The Node.js license response was invalid.');
  await writeFile(path.join(folder, 'node-LICENSE'), license);
});
await writeFile(path.join(folder, 'metadata.json'), JSON.stringify({
  version: process.version,
  arch: process.arch,
  platform: process.platform,
  nodeSha256: createHash('sha256').update(node).digest('hex'),
}, null, 2) + '\n');
console.log(`Bundled Node ${process.version} for Windows ${process.arch}`);
