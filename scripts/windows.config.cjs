module.exports = {
  appId: 'edu.xipu.mcp',
  productName: 'XIPU MCP',
  directories: { output: 'dist' },
  files: [
    'build/main.cjs',
    'build/preload.cjs',
    'build/documents-worker.cjs',
    'build/ui/**',
    'package.json',
  ],
  asar: true,
  electronDist: 'node_modules/electron/dist',
  extraResources: [
    { from: 'runtime/win32-x64/node.exe', to: 'node.exe' },
    { from: 'runtime/win32-x64/node-LICENSE', to: 'node-LICENSE' },
    { from: 'build/bridge.cjs', to: 'bridge.cjs' },
    { from: 'assets/icon.png', to: 'icon.png' },
  ],
  win: {
    icon: 'assets/icon.ico',
    artifactName: 'XIPU-MCP-Windows-${version}.${ext}',
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: 'XIPU MCP',
  },
};
