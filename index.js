const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path');
const { FullParser } = require('./src/io/pcap-parser')
let mainWin = null

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: true
    }
  })

  mainWin = win

  win.loadFile('public/index.html')

  ipcMain.on('request-data', (event) => {
    const data = { message: 'Hello from main process!' };
    event.reply('response-data', data);
  });
}

const handleReadFile = async (event) => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  win.loadURL('data:text/html,<h1>File Dialog Example</h1>');

  dialog.showOpenDialog(win, {
    title: 'Select a file',
    properties: ['openFile'],
    filters: [
      { name: 'PCAP Files', extensions: ['pcap'] }
    ],
  }).then(async result => {
    if (!result.canceled) {
      const data = await FullParser(result.filePaths[0]);
      console.log('Selected file:', result.filePaths[0]);
      mainWin.webContents.send('sendResults', {
        data,
        timestamp: new Date(),
      });
    }
  }).catch(err => {
    console.error('Error opening file dialog:', err);
  });

  win.close()
}

app.whenReady().then(() => {
  ipcMain.handle('os:readFile', handleReadFile)
  
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
