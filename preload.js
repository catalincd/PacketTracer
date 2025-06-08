const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('API', {
  readFile: () => ipcRenderer.invoke('os:readFile'),
  readFilePath: (path) => ipcRenderer.invoke('os:readFile', path),
  onSendResults: (callback) => ipcRenderer.on('sendResults', (event, data) => callback(data)),
});
