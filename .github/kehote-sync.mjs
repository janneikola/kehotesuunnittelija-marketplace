// Generated marketplace publisher. No downloaded content is ever executed.
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, lstat, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const statePath = '.kehote-sync-state.json';
const hash = content => createHash('sha256').update(content).digest('hex');
const permitted = path => typeof path === 'string' && (
  ['.agents/plugins/marketplace.json', '.claude-plugin/marketplace.json'].includes(path) ||
  /^plugins\/[a-z0-9]+(?:-[a-z0-9]+)*\/(?:\.claude-plugin\/plugin\.json|\.codex-plugin\/plugin\.json|\.mcp\.json|README\.md|skills\/[a-z0-9]+(?:-[a-z0-9]+)*\/(?:SKILL\.md|tests\.json|references\/[a-zA-Z0-9_-]+\.md))$/.test(path));

async function regularPath(root, relative) {
  const parts = relative.split('/');
  for (let i = 1; i <= parts.length; i++) {
    try {
      const stat = await lstat(join(root, ...parts.slice(0, i)));
      if (stat.isSymbolicLink() || (i < parts.length ? !stat.isDirectory() : !stat.isFile())) throw new Error(`Unsafe file: ${relative}`);
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
}
async function existing(root, relative) {
  await regularPath(root, relative);
  try { return await readFile(join(root, relative), 'utf8'); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

export async function applySnapshot(root, snapshot, source) {
  if (snapshot?.formatVersion !== 1 || !Array.isArray(snapshot.files) || snapshot.files.length > 5000 || !/^[a-f0-9]{64}$/.test(snapshot.revision)) throw new Error('Invalid snapshot');
  const files = snapshot.files;
  if (!files.some(file => file.path === '.agents/plugins/marketplace.json') || !files.some(file => file.path === '.claude-plugin/marketplace.json')) throw new Error('Missing marketplace catalogs');
  let bytes = 0;
  const seen = new Set();
  for (const file of files) {
    if (!permitted(file.path) || typeof file.content !== 'string' || seen.has(file.path)) throw new Error('Invalid or duplicate package path');
    bytes += Buffer.byteLength(file.content); seen.add(file.path);
  }
  if (bytes > 20 * 1024 * 1024) throw new Error('Snapshot exceeds size limit');
  const sorted = [...files].sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  if (hash(JSON.stringify(sorted)) !== snapshot.revision) throw new Error('Snapshot hash mismatch');
  const previousText = await existing(root, statePath);
  const previous = previousText ? JSON.parse(previousText) : { source, files: {} };
  if (previous.source !== source || !previous.files || typeof previous.files !== 'object' || Array.isArray(previous.files)) throw new Error('Different marketplace source or invalid state');
  for (const [path, digest] of Object.entries(previous.files)) {
    if (!permitted(path) || !/^[a-f0-9]{64}$/.test(digest)) throw new Error('Invalid managed file state');
  }
  const paths = [...new Set([...Object.keys(previous.files), ...seen])];
  // Validate all files before changing any of them. Preserve hand-edited content.
  const current = new Map();
  const next = new Map(files.map(file => [file.path, file.content]));
  for (const path of paths) {
    const content = await existing(root, path); current.set(path, content);
    if (Object.hasOwn(previous.files, path)) {
      if (content === null || hash(content) !== previous.files[path]) throw new Error(`Locally changed managed file: ${path}. Edit the skill in Kehotesuunnittelija or resolve the conflict first.`);
    } else if (content !== null && content !== next.get(path)) throw new Error(`Refusing to overwrite an existing file: ${path}`);
  }
  const changed = [];
  for (const file of files) {
    if (current.get(file.path) === file.content) continue;
    await mkdir(dirname(join(root, file.path)), { recursive: true });
    await writeFile(join(root, file.path), file.content); changed.push(file.path);
  }
  for (const path of Object.keys(previous.files)) {
    if (!seen.has(path)) { await rm(join(root, path)); changed.push(path); }
  }
  const nextState = JSON.stringify({ source, revision: snapshot.revision, files: Object.fromEntries(sorted.map(file => [file.path, hash(file.content)])) }, null, 2) + '\n';
  if (nextState !== previousText) { await writeFile(join(root, statePath), nextState); changed.push(statePath); }
  return changed;
}

async function limitedJson(response, limit) {
  if (!response.ok) throw new Error(`Service returned HTTP ${response.status}. Check the connection, subscription and GitHub Actions settings.`);
  let bytes = 0; const chunks = [];
  for await (const chunk of response.body) {
    bytes += chunk.length;
    if (bytes > limit) throw new Error('Response exceeds size limit');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
export async function fetchSnapshot(config) {
  const endpoint = new URL(config.endpoint);
  if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || endpoint.search || endpoint.hash) throw new Error('A public HTTPS service endpoint is required');
  const headers = { Accept: 'application/json' };
  if (config.authentication === 'github-oidc') {
    if (!process.env.ACTIONS_ID_TOKEN_REQUEST_URL || !process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN) throw new Error('Run this workflow in GitHub Actions with id-token: write');
    const tokenUrl = new URL(process.env.ACTIONS_ID_TOKEN_REQUEST_URL);
    if (tokenUrl.protocol !== 'https:') throw new Error('Invalid GitHub token endpoint');
    tokenUrl.searchParams.set('audience', endpoint.href);
    const result = await limitedJson(await fetch(tokenUrl, { headers: { Authorization: `Bearer ${process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN}` }, redirect: 'error', signal: AbortSignal.timeout(15000) }), 65536);
    if (typeof result.value !== 'string' || result.value.length > 16384) throw new Error('Invalid GitHub identity token');
    headers.Authorization = `Bearer ${result.value}`;
  } else if (config.authentication !== 'public') throw new Error('Unknown authentication mode');
  return limitedJson(await fetch(endpoint, { headers, redirect: 'error', signal: AbortSignal.timeout(60000) }), 30 * 1024 * 1024);
}
export async function synchronize(root, config, fetcher = fetchSnapshot) {
  const snapshot = await fetcher(config);
  const changed = await applySnapshot(root, snapshot, config.endpoint);
  // Stage exactly the managed files; unrelated repository changes stay untouched.
  for (let i = 0; i < changed.length; i += 100) execFileSync('git', ['add', '--', ...changed.slice(i, i + 100)], { cwd: root, stdio: 'pipe' });
  return { revision: snapshot.revision, changed: changed.length };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const root = process.cwd();
    const config = JSON.parse(await readFile(join(root, '.kehote-sync.json'), 'utf8'));
    const result = await synchronize(root, config);
    console.log(`Marketplace ${result.revision}: ${result.changed} changed files. Check the commit and workspace sync separately.`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
