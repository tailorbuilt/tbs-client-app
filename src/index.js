const electron = require("electron");
const fs = require("fs");
const os = require("os");
const {app, BrowserWindow, ipcMain, dialog, Menu} = electron;
const notifier = require('node-notifier');
const getmac = require('getmac')
let win
let winSettings
let winInfo
let myPath = app.getPath('userData')
var session
var site_info
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const { app, autoUpdater } = require('electron')

const server = 'tbs-client-1cvy88p9o-tailorbuilt.vercel.app'
const url = `${server}/update/${process.platform}/${app.getVersion()}`

autoUpdater.setFeedURL({ url })

console.log(process.argv[2])
const isLocal=process.argv[2]

const axios = require('axios').default;
app.on('ready', ()=>{


    const computerName = os.hostname()
    const net = os.networkInterfaces()
    const mac = getmac.default()
    console.log("computer name:" + computerName)
    console.log( app.getPath('userData') )
    console.log("MAC: " + mac)

    'use strict';

    const { networkInterfaces } = require('os');

    const nets = networkInterfaces();
    const results = Object.create(null); // Or just '{}', an empty object

    let localIpAddress = '';
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        console.log('addr: ' + add);
        localIpAddress = add;
    })


    try{
        const clientSettingsString = fs.readFileSync(myPath + '/settings.json').toString()
        console.log(clientSettingsString)
        const clientSettings = JSON.parse(clientSettingsString)
        console.log(clientSettings)

        console.log(clientSettings.host)
        win = new BrowserWindow({
          webPreferences: {
            nodeIntegration: true,
            nativeWindowOpen: true
          }
        })
	let http = process.argv[2] ?? 'http'
        console.log("loading page " + http + "://"+clientSettings.host+"/client/"+'name:'+clientSettings.name+"/"+mac)
        win.loadURL(http + "://" + clientSettings.host+"/client/"+'name:'+clientSettings.name+"/"+mac)

        if (fs.existsSync(myPath + '/winsize.json')){
            fileWindowSizeString = fs.readFileSync(myPath + "/winsize.json").toString();
            fileWindowSize = JSON.parse(fileWindowSizeString)
            
            if (fileWindowSize[2]===true){
                win.maximize()
            } else {
                win.setSize(fileWindowSize[0],fileWindowSize[1])
            }
        }
        if (fs.existsSync(myPath + '/winpos.json')){
            fileWindowPosString = fs.readFileSync(myPath + "/winpos.json").toString();
            fileWindowPos = JSON.parse(fileWindowPosString)
            win.setPosition(fileWindowPos[0],fileWindowPos[1])
        }
        
        win.on("resize", ()=>{
            const winSize = win.getSize()
            winSize.push(win.isMaximized())
            winSizeString = JSON.stringify(winSize)
            fs.writeFileSync(myPath + "/winsize.json", winSizeString)
            console.log(winSize)
        })
        win.on("move", () =>{
            const winPos = win.getPosition()
            winPosString = JSON.stringify(winPos)
            fs.writeFileSync(myPath + "/winpos.json", winPosString)
            console.log(winPos)
        })

        //win.webContents.on('console-message', (event, level, message, line, sourceId) => {
          //console.log(message + " " +sourceId+" ("+line+")" + "\n");
        //});

        let firstLogin = true;
        win.on("page-title-updated", (event, title)=> {
            let currentURL = win.webContents.getURL()
            console.log(currentURL)
            if (currentURL.includes("login")){
                console.log("page is login....")
                console.log("first login: " + firstLogin);
                if (firstLogin == false){
                    firstLogin = true;
                    console.log('need to go to mac setup....');
                    console.log("loading page " + http + "://"+clientSettings.host+"/client/"+'name:'+clientSettings.name+"/"+mac)
                    console.log("first login: " + firstLogin);
                    win.loadURL(http + "://" + clientSettings.host+"/client/"+'name:'+clientSettings.name+"/"+mac)
                } else {
                    firstLogin = false;
                }
                const menu = Menu.buildFromTemplate(template)
                Menu.setApplicationMenu(menu)

                win.setClosable(true)
            } else{
                console.log("page is NOT login....")

                win.setClosable(false)


                
                //template[1].visible = false
                //template[2].visible = true
                //template[3].visible = true
                //template[4].visible = true
                //const menu = Menu.buildFromTemplate(template)
                //Menu.setApplicationMenu(menu)

            }
        })

    } catch (e){
        openSettings()
    }
})


ipcMain.on("save", (event,host,name)=>{
    console.log("Host: " + host)
    console.log("Name: " + name)
    const userSettings = {
        "host": host,
        "name": name,
    }

    const userSettingsString = JSON.stringify(userSettings)
    console.log(userSettingsString)
    const mac = getmac.default()
    console.log(mac)

    fs.writeFileSync(myPath + "/settings.json", userSettingsString)
    if(win){
        win.loadURL("http://" + host+"/client/"+'name:'+name+"/"+mac)
    } else {
        win = new BrowserWindow({
          webPreferences: {
            nodeIntegration: true,
            contextIsolation: true
	  }
	})
        win.loadURL("http://" + host)
    }
    winSettings.destroy();


})
ipcMain.on("close_info", (event)=>{
    console.log("close info")
    winInfo.destroy();
})

ipcMain.on("toast", (event,message)=>{
    console.log("toast message")
    toast(message)
})

ipcMain.on('session_settings', (event, session_settings)=>{
  session = session_settings
  console.log("session info: " + session);
})

let isMac = process.platform === 'darwin'

let template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : [])
]

let connection_menu = {
      label: "Connection",
      enabled: true,
      visible: true,
      submenu: [
        {
            label: "Change Settings",
            click(){openSettings()}
        }
      ]
  }


let editmenu = { role: 'editMenu' }
let viewmenu = {
    label: 'View',
    submenu: [
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  }
let helpmenu = {
    role: 'help',
    submenu: [
      {
        label: 'Training',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://www.tailorbuilt.com')
        }
      }
    ]
  }

template.push(connection_menu)
template.push(editmenu)
template.push(viewmenu)
template.push(helpmenu)

console.log(template)

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

function openSettings(){
    winSettings = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    try{
        const clientSettingsString = fs.readFileSync(myPath + '/settings.json').toString()
        console.log(clientSettingsString)
        const clientSettings = JSON.parse(clientSettingsString)
        console.log(clientSettings)

        console.log(clientSettings.host)



        winSettings.loadFile('src/index.html', {
            query: { host: clientSettings.host, name: clientSettings.name }
        });
    } catch(e) {
        winSettings.loadFile('src/index.html');
    }



}

function showInfo(){
  winInfo = new BrowserWindow({
    width: 300,
    height: 400,
    webPreferences: {
        nodeIntegration: true,
	contextIsolation: false,
    }
  })
  InfoTitle = session['dp_type']+session['dp_line']+' - '+session['idno'];
  InfoHeader = '<script>const electron = require("electron"); const {ipcRenderer} = electron; function closeWindow(){ ipcRenderer.send("close_info"); } </script> </header>';
  InfoFooter = '';
  InfoOkBtn = '<button type="button" class="btn btn-form btn-primary" onclick="closeWindow();">Ok</button>';


  winInfo.loadURL('data:text/html;charset=utf-8,<head> <link rel="stylesheet" href="css/photon.css"> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <title>'+InfoTitle+'</title> </head> <body>'+InfoHeader+site_info+InfoOkBtn+InfoFooter+'</body>');

}


function toast(message){

  console.log("message toast center")
  console.log(message)

  notifier.notify(
    {
      title: 'TailorBuilt Solutions, LLC.',
      message: message,
      //icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
      sound: true, // Only Notification Center or Windows Toasters
      wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
    },
    function (err, response) {
      // Response is response from notification
    }
  );

//win.show();

}

