const { app, BrowserWindow, shell } = require("electron");
const path = require("node:path");
function openPresentation() {
  const window = new BrowserWindow({
    width: 1440, height: 900, minWidth: 800, minHeight: 600,
    autoHideMenuBar: true,
    webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true }
  });
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  window.webContents.on("will-navigate", (event, url) => {
    if (/^https?:\/\//i.test(url)) { event.preventDefault(); shell.openExternal(url); }
  });
  window.loadFile(path.join(__dirname, "..", "dist", "index.html"));
}
app.whenReady().then(() => {
  openPresentation();
  app.on("activate", () => { if (!BrowserWindow.getAllWindows().length) openPresentation(); });
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
