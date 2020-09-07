const {app, BrowserWindow} = require("electron");
const {Menu} = require('electron')

const path = require("path");
const isDev = require("electron-is-dev");

const autoFit = `
    document.getElementById('container').style.display = 'none';
    if(document.getElementsByClassName('ytp-size-button').item(0).title === '영화관 모드(t)') {
        document.getElementsByClassName('ytp-size-button').item(0).click();
    }
`

const skipAds = `
    setInterval(function() {
        var _cross = document.getElementsByClassName("ytp-ad-overlay-close-container")[0]; 
        var _skip = document.getElementsByClassName("ytp-ad-skip-button")[0]; 
        if (_cross != undefined) _cross.click(); 
        if (_skip != undefined) _skip.click() 
    }, 2000);
`

const menuItem1 = {
    label: '홈',
    click: () => {
        if(mainWindow) {
            mainWindow.webContents.executeJavaScript(`
                document.getElementsByClassName('yt-simple-endpoint style-scope ytd-topbar-logo-renderer')[0].click()
            `)
        }
    }
}

const menuItem2 = {
    label: '뒤로',
    click: () => {
        if(mainWindow) {
            mainWindow.webContents.executeJavaScript(`
                window.history.back()
            `)
        }
    }
}

const menuItem3 = {
    label: '앞으로',
    click: () => {
        if(mainWindow) {
            mainWindow.webContents.executeJavaScript(`
                window.history.forward()
            `)
        }
    }
}


const menuItem4_1 = {
    label: '항상위로 설정',
    click: () => {
        if(mainWindow) {
            mainWindow.setAlwaysOnTop(true, "floating", 1)
            menuItems[3] = menuItem4_2
            const newMenu = Menu.buildFromTemplate(menuItems)
            Menu.setApplicationMenu(newMenu)
        }
    }
}
const menuItem4_2 = {
    label: '항상위로 해제',
    click: () => {
        mainWindow.setAlwaysOnTop(false, "floating", 1)
        menuItems[3] = menuItem4_1
        const newMenu = Menu.buildFromTemplate(menuItems)
        Menu.setApplicationMenu(newMenu)
    }
}

const menuItem5 = {
    label: '자동맞춤',
    submenu: [
        {
            label: 'x1',
            click: () => {
                if(mainWindow) {
                    mainWindow.setSize(552, 350)
                    mainWindow.webContents.executeJavaScript(`
                        ${autoFit}
                        window.scrollTo(0, 150);
                    `)
                }
            }
        },
        {
            label: 'x2',
            click: () => {
                if(mainWindow) {
                    mainWindow.setSize(640, 400)
                    mainWindow.webContents.executeJavaScript(`
                        ${autoFit}
                        window.scrollTo(0, 125);
                    `)
                }
            }
            
        },
    ]
}

const menuItem6 = {
    label: '원상복구',
    click: () => {
        if(mainWindow) {
            mainWindow.webContents.executeJavaScript(`
                document.getElementById('container').style.display = 'flex'
                if(document.getElementsByClassName('ytp-size-button').item(0).title === '기본 보기(t)') {
                    document.getElementsByClassName('ytp-size-button').item(0).click();
                }
            `)
        }
    }
}

let menuItems = [
    menuItem1, menuItem2, menuItem3,menuItem4_1, menuItem5, menuItem6
]

const menu = Menu.buildFromTemplate(menuItems)

let mainWindow;

async function createWindow() {
    if (isDev) {
        try {
            const {default: installExtension} = require("electron-devtools-installer");
        } catch (error) {}
    }
    mainWindow = new BrowserWindow({
        width: 1050,
        height: 625,
        show: false,
        icon: path.join(isDev
            ? process.cwd() + "/resources"
            : process.resourcesPath, "media", "icon.ico")
    });
    mainWindow.on("ready-to-show", async() => {
        mainWindow.show();
        if (isDev) 
            mainWindow.webContents.openDevTools({mode: "undocked"});
        }
    );
    mainWindow.on("closed", () => (mainWindow = null));
    mainWindow.loadURL('https://www.youtube.com/');

    mainWindow.webContents.once('dom-ready', () => {
        mainWindow.webContents.executeJavaScript(`
            ${skipAds}
        `);
    });

    Menu.setApplicationMenu(menu);
}

app.on("ready", createWindow);
app.userAgentFallback = "Chrome";

app.on("activate", () => {
    if (mainWindow === null) 
        createWindow();
    }
);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") 
        app.quit();
    }
);