import path from 'node:path';
import { homedir } from 'node:os';
import { createHash } from 'node:crypto';

export const isWindows = process.platform === 'win32';

/** Keep application data in the current user's OS-specific private profile. */
export function defaultDataDirectory(platform = process.platform, home = homedir(), env = process.env): string {
  if (platform === 'win32') return path.join(env.APPDATA || path.join(home, 'AppData', 'Roaming'), 'XIPU MCP');
  if (platform === 'darwin') return path.join(home, 'Library', 'Application Support', 'XIPU MCP');
  return path.join(env.XDG_CONFIG_HOME || path.join(home, '.config'), 'XIPU MCP');
}

/**
 * Windows uses an authenticated named pipe rather than a Unix domain socket.
 * Hashing the data directory keeps development, test and installed instances separate.
 */
export function brokerEndpoint(directory: string, platform = process.platform): string {
  if (platform !== 'win32') return path.join(directory, 'bridge.sock');
  const id = createHash('sha256').update(path.resolve(directory)).digest('hex').slice(0, 24);
  return `\\\\.\\pipe\\xipu-mcp-${id}`;
}

export const credentialProtectionName = isWindows ? 'Windows 数据保护（DPAPI）' : 'macOS 钥匙串';
