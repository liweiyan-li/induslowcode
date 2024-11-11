// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendSchemaToFile: (scenarioName, schemaData) =>
    ipcRenderer.send('save-schema-to-file', { scenarioName, schemaData }),
  invoke: (channel, data) => {
    const validChannels = ['reset-schema'];
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
  },
  onFolderContents: (callback) => 
    ipcRenderer.on('folderContents', callback),
});

contextBridge.exposeInMainWorld('electronAPI1', {
  onFolderContents: (callback) => 
    ipcRenderer.on('folderContents', callback),
});
