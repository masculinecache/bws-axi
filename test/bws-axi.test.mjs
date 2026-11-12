import assert from 'node:assert/strict';
import { chmodSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import test from 'node:test';

const root = new URL('..', import.meta.url).pathname;
const cli = join(root, 'bin/bws-axi');
const mockDir = mkdtempSync(join(tmpdir(), 'bws-axi-test-'));
const mockBws = join(mockDir, 'bws');
writeFileSync(mockBws, `#!/usr/bin/env node
const args = process.argv.slice(2);
const projects = Array.from({ length: 501 }, (_, i) => ({ id: String(i).padStart(36, '0'), name: 'project-' + i }));
const secrets = Array.from({ length: 501 }, (_, i) => ({ key: 'KEY_' + i, type: 'login', value: 'value' }));
process.stdout.write(JSON.stringify(args[0] === 'project' ? projects : secrets));
`);
chmodSync(mockBws, 0o755);

function run(...args) {
  return execFileSync(process.execPath, [cli, ...args], {
    encoding: 'utf8',
    env: { ...process.env, BWS_BIN: mockBws, BWS_ACCESS_TOKEN: 'test-token' },
  });
}

test('projects reports aggregate count and truncation hint', () => {
  const output = run('projects', '--limit', '2');
  assert.match(output, /count: 2 of 501 total/);
  assert.match(output, /help\[1\]: Run `bws-axi projects --limit 501` for all 501 projects/);
  assert.match(output, /projects\[2\]/);
});

test('projects default limit is 500 and discloses the remaining project', () => {
  const output = run('projects');
  assert.match(output, /count: 500 of 501 total/);
  assert.match(output, /help\[1\]: Run `bws-axi projects --limit 501` for all 501 projects/);
  assert.match(output, /projects\[500\]/);
});

test('items reports aggregate count and truncation hint', () => {
  const output = run('items', 'project-0', '--limit', '2');
  assert.match(output, /count: 2 of 501 total/);
  assert.match(output, /help\[1\]: Run `bws-axi items project-0 --limit 501` for all 501 items/);
  assert.match(output, /secrets\[2\]/);
});

test('items default limit is 500 and discloses the remaining item', () => {
  const output = run('items', 'project-0');
  assert.match(output, /count: 500 of 501 total/);
  assert.match(output, /help\[1\]: Run `bws-axi items project-0 --limit 501` for all 501 items/);
  assert.match(output, /secrets\[500\]/);
});
