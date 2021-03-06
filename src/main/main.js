const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');

require('electron-debug')();
app.commandLine.appendSwitch('remote-debugging-port', '9222')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;



function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({width: 1280, height: 800})

    // and load the index.html of the app.
    // win.loadURL(url.format({
    //     pathname: path.join(__dirname, 'app.html'),
    //     protocol: 'file:',
    //     slashes: true
    // }));

    console.log('process.env', process.env.NODE_ENV)
    if(process.env.NODE_ENV === 'development') {
        const port = process.env.PORT || 4567;
        console.log('port',port);
        win.loadURL("http://localhost:4567/dist/app.html")
        win.webContents.openDevTools()
    }else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'app.html'),
            protocol: 'file:',
            slashes: true
        }));
    }

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', ()=>{

    if(process.env.NODE_ENV === 'development') {
        const { default: installExtension, REACT_DEVELOPER_TOOLS , REDUX_DEVTOOLS} = require('electron-devtools-installer');
        installExtension(REACT_DEVELOPER_TOOLS)
        .then(() => installExtension(REDUX_DEVTOOLS))
        .then((name) => {
              console.log(`Added Extension:  ${name}`)
              createWindow();
        })
        .catch((err) => console.log('An error occurred: ', err));

    }else {
        createWindow();
    }



});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('new-window',(evt, param)=>{
    console.log(evt, param);

    let _new_win = new BrowserWindow({ width: 1920, height: 1080, webPreferences: {
            nodeIntegrationInWorker: true
        }});

    _new_win._param = {
        param: param
    };

    _new_win.loadURL(url.format({
        pathname: path.join(__dirname, param.path),
        protocol: 'file:',
        slashes: true
    }));

    // viz_win.maximize()

});