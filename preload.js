const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  requestData: () => ipcRenderer.send('request-data'),
  onResponseData: (callback) => ipcRenderer.on('response-data', (event, data) => callback(data))
});