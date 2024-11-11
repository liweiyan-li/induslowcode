const { app, BrowserWindow, Menu, ipcMain, BrowserView } = require('electron');
const fs = require('fs');
const path = require('path');
let mainWindow;

const { dialog } = require('electron');
let rootDirectory = ''; // 全局保存根目录路径

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open Folder',
        accelerator: 'CmdOrCtrl+O',
        click: openFolder
      },
      {
        label: 'Exit',
        accelerator: 'CmdOrCtrl+Q',
        click() {
          app.quit();
        },
      }
    ],
  },
  // 可以继续添加更多菜单项
];

Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200, // 增加宽度以适应更多内容
    height: 900, // 增加高度以适应更多内容
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // 指定预加载脚本
      nodeIntegration: true,
      webviewTag: true
    },
  });
  mainWindow.webContents.loadURL('http://localhost:5556/');
  mainWindow.webContents.openDevTools();

  // // 创建低代码区域的 BrowserView
  // const rightBoxView = new BrowserView({
  //   webPreferences: {
  //     preload: path.join(__dirname, 'preload.js'), // 指定预加载脚本
  //     nodeIntegration: true,//决定了渲染进程是否可以直接使用 Node.js 的内置模块
  //     contextIsolation: true,//启用上下文隔离，渲染进程的 JavaScript 代码与 preload.js 中的代码运行在不同的作用域（上下文）中
  //   },
  // });
  // mainWindow.addBrowserView(rightBoxView);
  // // rightBoxView.setBounds({ x: 150, y: 0, width: 600, height: 900 }); // 设置位置和大小
  // rightBoxView.setAutoResize({ width: true, height: true });
  // rightBoxView.webContents.loadURL('http://localhost:5556/'); // 通过 loadURL 加载内容
  // // 打开开发者工具
  // rightBoxView.webContents.openDevTools();

  // 创建导航区域的 BrowserView
  // leftBoxView = new BrowserView({
  //   webPreferences: {
  //     preload: path.join(__dirname, 'preload.js'), // 指定预加载脚本
  //     nodeIntegration: true,
  //     contextIsolation: true,
  //   },
  // });
  // mainWindow.addBrowserView(leftBoxView);
  // leftBoxView.setBounds({ x: 0, y: 0, width: 150, height: 900 }); // 设置位置和大小
  // leftBoxView.setAutoResize({ width: true, height: true });
  // leftBoxView.webContents.loadFile('./public/index.html'); // 加载本地 HTML 文件显示内容

  // // 调整布局的函数
  // const adjustLayout = () => {
  //   const { width, height } = mainWindow.getContentBounds();
  //   leftBoxView.setBounds({ x: 0, y: 0, width: 250, height });
  //   // rightBoxView.setBounds({ x: 250, y: 0, width: width - 250, height });
  // };
  // mainWindow.loadURL('http://localhost:5556/');
  // mainWindow.loadFile('./public/index.html');

  // 打开开发者工具
  // mainWindow.webContents.openDevTools();
  // 调整窗口大小时调整布局
  // mainWindow.on('resize', adjustLayout);

  // // 窗口创建完成后立即调整布局
  // adjustLayout();
  // rightBoxView.webContents.on('did-finish-load', () => {
  //   // 设置滚动条样式
  //   rightBoxView.webContents.insertCSS('body { overflow-x: scroll; }');

  // //   // 调整布局
  // });


  mainWindow.on('closed', () => {
    mainWindow = null;
  });

}


app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});



// 异步递归读取文件夹内容，只返回符合条件的文件内容
async function readFolderContents(folderPath) {
  const folderContents = [];

  const files = await fs.promises.readdir(folderPath, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(folderPath, file.name);

    if (file.isDirectory()) {
      // 如果是目录，则递归读取子目录内容
      const childrenContents = await readFolderContents(fullPath);
      folderContents.push(...childrenContents); // 将符合条件的内容添加到结果中
    } else if (file.name.endsWith('-resourceList.json')) {
      // 如果文件符合条件，则读取内容并存储
      const content = await fs.promises.readFile(fullPath, 'utf-8');
      folderContents.push(content); // 只返回文件内容
    }
  }
  return folderContents;
}

// 打开文件夹，保存根目录
function openFolder() {
  dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] }).then(async (result) => {
    if (!result.canceled) {
      rootDirectory = result.filePaths[0]; // 保存根目录路径
      console.log('Selected Folder:', rootDirectory);

      try {
        const folderContents = await readFolderContents(rootDirectory);
        mainWindow.webContents.send('folderContents', folderContents);
      } catch (err) {
        console.error('Failed to read directory:', err);
      }
    }
  }).catch(err => {
    console.error('Failed to open folder:', err);
  });
}


// 在目录下查找文件
function findFileInDir(directory, fileName) {
  let result = null;
  const files = fs.readdirSync(directory, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(directory, file.name);
    if (file.isDirectory()) {
      // 如果是目录，递归查找
      result = findFileInDir(fullPath, fileName);
    } else if (file.name === fileName) {
      // 找到文件，返回路径
      result = fullPath;
    }
    if (result) break; // 找到文件后退出循环
  }
  return result;
}

// 保存文件
ipcMain.on('save-schema-to-file', (event, { scenarioName, schemaData }) => {
  //这里的scenarioName为文件名
  if (!rootDirectory) {
    console.error('Root directory is not set!');
    return;
  }
  // 在根目录及子文件夹中查找目标文件
  const savePath = findFileInDir(rootDirectory, `${scenarioName}.json`);
  console.log(savePath);
  console.log(schemaData);
  if (savePath) {
    fs.writeFile(savePath, schemaData, (err) => {
      if (err) {
        console.error('Failed to save schema to file:', err);
      } else {
        console.log(`Schema saved successfully to ${savePath}`);
      }
    });
  } else {
    console.error(`File ${scenarioName}.json not found in any subfolder.`);
  }

  //用于生成新页面时，根据defaultschema生成新的 schema文件

  // 判断 scenarioName 是否为 “XX-resourceList”的格式
  const resourceListPattern = /^(.+?)-resourceList$/;
  const match = scenarioName.match(resourceListPattern);
  // 如果匹配，生成以“XX-id-projectSchema.json”格式的文件
  if (match) {
    const resourcePrefix = match[1];
    try {
      // 解析 schemaData 为数组，并根据 id 创建各个 schema 文件
      const resourceList = JSON.parse(schemaData);
      resourceList.forEach(({ id }) => {
        const schemaFileName = `${resourcePrefix}-${id}-projectSchema.json`;
        let schemaFilePath = findFileInDir(rootDirectory, schemaFileName);

        // 若文件不存在，从 ./public/defaultschema.json 复制内容生成文件
        if (!schemaFilePath) {
          schemaFilePath = path.join(rootDirectory, schemaFileName); // 将新文件放置在根目录下
          const defaultSchemaPath = path.join(__dirname, '../public', 'defaultschema.json');
          try {
            const defaultSchema = fs.readFileSync(defaultSchemaPath, 'utf-8');
            fs.writeFileSync(schemaFilePath, defaultSchema);
            console.log(`Created default schema file for ${schemaFileName}`);
          } catch (err) {
            console.error('Failed to create default schema file:', err);
            return;
          }
        }
      });
    } catch (err) {
      console.error('Failed to parse resource list data:', err);
    }
  }
});

// 重置 schema，读取文件内容
ipcMain.handle('reset-schema', async (event, scenarioName) => {
  if (!rootDirectory) {
    throw new Error('Root directory is not set!');
  }

  // 在根目录及子文件夹中查找目标文件
  const filePath = findFileInDir(rootDirectory, `${scenarioName}.json`);
  
  if (filePath) {
    return fs.readFileSync(filePath, 'utf-8'); // 返回文件内容
  } else {
    throw new Error('Schema file not found');
  }
});





