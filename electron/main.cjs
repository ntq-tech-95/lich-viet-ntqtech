const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

function resolveIconPath() {
  const distIcon = path.join(__dirname, '../dist/icons/icon-512.png');
  if (fs.existsSync(distIcon)) return distIcon;
  const pubIcon = path.join(__dirname, '../public/icons/icon-512.png');
  return fs.existsSync(pubIcon) ? pubIcon : undefined;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1220,
    height: 840,
    minWidth: 380,
    minHeight: 620,
    title: 'Lịch Việt — Âm Lịch Việt Nam | NTQ TECH',
    icon: resolveIconPath(),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
