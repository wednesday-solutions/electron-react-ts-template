const { app, BrowserWindow } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (isDev) {
    win.loadURL(`http://localhost:3000`);
    win.webContents.once('dom-ready', () => {
      win.webContents.openDevTools();
    });
  } else {
    win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
    win.webContents.once('dom-ready', () => {
      win.webContents.openDevTools();
    });
  }
}

app.whenReady().then(() => {
  createWindow();

  if (isDev) {
    const { default: installer, REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

    const options = {
      loadExtensionOptions: { allowFileAccess: true }
    };
    installer([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS], options);
  }
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
