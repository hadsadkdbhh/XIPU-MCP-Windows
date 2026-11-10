import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { brokerEndpoint, defaultDataDirectory } from '../src/platform.js';

test('Windows application data stays in the selected roaming profile', () => {
  const directory = defaultDataDirectory('win32', 'C:\\Users\\Student', { APPDATA: 'D:\\Roaming' } as NodeJS.ProcessEnv);
  assert.equal(directory, path.join('D:\\Roaming', 'XIPU MCP'));
  const fallback = defaultDataDirectory('win32', 'C:\\Users\\Student', {} as NodeJS.ProcessEnv);
  assert.equal(fallback, path.join('C:\\Users\\Student', 'AppData', 'Roaming', 'XIPU MCP'));
});

test('Windows named pipes are private to each application data directory', () => {
  const first = brokerEndpoint('C:\\Users\\Student\\AppData\\Roaming\\XIPU MCP', 'win32');
  const second = brokerEndpoint('D:\\Test\\XIPU MCP', 'win32');
  assert(first.startsWith('\\\\.\\pipe\\xipu-mcp-'));
  assert.match(first, /[a-f0-9]{24}$/);
  assert.notEqual(first, second);
});

test('macOS retains its original application data and Unix socket paths', () => {
  const directory = defaultDataDirectory('darwin', '/Users/student', {} as NodeJS.ProcessEnv);
  assert.equal(
    directory,
    path.join('/Users/student', 'Library', 'Application Support', 'XIPU MCP'),
  );
  assert.equal(brokerEndpoint(directory, 'darwin'), path.join(directory, 'bridge.sock'));
});
