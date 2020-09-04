const { app, BrowserWindow } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

async function createWindow() {
    if (isDev) {
        try {
            const {
                default: installExtension,
            } = require("electron-devtools-installer");
        } catch (error) {}
    }
    mainWindow = new BrowserWindow({
        width: 1050,
        height: 625,
        show: false,
        icon: path.join(
            isDev ? process.cwd() + "/resources" : process.resourcesPath,
            "media",
            "icon.ico"
        ),
    });
    mainWindow.on("ready-to-show", async () => {
        mainWindow.show();
        if (isDev) mainWindow.webContents.openDevTools({ mode: "undocked" });
    });
    mainWindow.on("closed", () => (mainWindow = null));
    mainWindow.loadURL(`file://${path.join(__dirname, "../public/index.html")}`);
}

app.on("ready", createWindow);

app.on("activate", () => {
    if (mainWindow === null) createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
