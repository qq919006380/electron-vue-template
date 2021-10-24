import { app, BrowserWindow, ipcMain } from "electron";
import "../renderer/store";
import * as path from "path";

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  // global.__static = require("path")
  //   .join(__dirname, "/static")
  //   .replace(/\\/g, "\\\\");

  global.__static = path.join(__dirname, "/static").replace(/\\/g, "\\\\");
  // {{#if_eq eslintConfig 'airbnb'}}
}

let mainWindow, webContents;
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : path.join("file://", __dirname, path.sep, "index.html");

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true, //在网页中集成Node
      nodeIntegrationInWorker: true, //是否在Web工作器中启用了Node集成
      enableRemoteModule: true,
    },
  });

  mainWindow.loadURL(winURL);
  webContents = mainWindow.webContents;

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", () => {
  createWindow();
  // checkForUpdates();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

// import { autoUpdater } from 'electron-updater'
const { autoUpdater } = require("electron-updater");

const feedUrl = `http://localhost:8080/public`; // 更新包位置
// 主进程监听渲染进程传来的信息
ipcMain.on("update", (e, arg) => {
  checkForUpdates();
  console.log("update");
});

let checkForUpdates = () => {
  // 配置安装包远端服务器
  autoUpdater.setFeedURL(feedUrl);

  // 下面是自动更新的整个生命周期所发生的事件
  //错误
  autoUpdater.on("error", function(error, message) {
    sendUpdateMessage("error:", { error, message });
  });
  // 当开始检查更新的时候触发
  autoUpdater.on("checking-for-update", function(message) {
    sendUpdateMessage("checking-for-update", message);
  });
  // 当发现有可用更新的时候触发，更新包下载会自动开始
  autoUpdater.on("update-available", function(message) {
    sendUpdateMessage("update-available", message);
  });

  // // 当发现版本为最新版本触发
  autoUpdater.on("update-not-available", function(message) {
    sendUpdateMessage("update-not-available", message);
  });

  // 更新下载进度事件
  autoUpdater.on("download-progress", function(progressObj) {
    sendUpdateMessage("downloadProgress", progressObj);
  });
  // 更新下载完成事件
  autoUpdater.on("update-downloaded", function() {
    sendUpdateMessage("isUpdateNow");
    ipcMain.on("updateNow", (e, arg) => {
      autoUpdater.quitAndInstall();
    });
  });

  //执行自动更新检查
  autoUpdater.checkForUpdates();
};

// 主进程主动发送消息给渲染进程函数
function sendUpdateMessage(title, data) {
  webContents.send("message", { title, data });
}

// app.on('ready', () => {
//   if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
// })
