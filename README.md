# ElectronVue
Create ElectronJS apps with ease integrated with VueJS

###### What is this?
This is a CLI based tool that is focused on closing the bridge between ElectronJS and VueJS.

## Table of Contents
 - [Installation](#installation)
 - [Usage](#usage)

## Installation
To install this CLI tool, run the following command...
```bash
npm install --global https://github.com/AxeriDev/ElectronVue
```
This will install it globally making it accessible through out your entire device.<br />
**NOTE**: If you want to only install the library in the project, remove the `--global` flag.

## Usage
Now lets get to using this tool.<br>
First lets create a new VueJS project via the following command...
```bash
npx vue create electron-vue-project
```
**NOTE**: Make sure you have Vue-CLI installed.

Now lets setup ElectronJS. Install ElectronJS with the following command...
```bash
npm install electron
```

Next, lets create our ElectronJS main script. For this example, it will be inside of `electron-vue-project/src/electron/Main.js`.
Now you can either setup electron yourself or paste the following code inside...
```js
const Electron = require("electron");

class Main {
    constructor() {
        Electron.app.on("ready", () => {
            this.buildWindow().loadURL("http://localhost:8080");
        });
    }
    
    buildWindow() {
        return new Electron.BrowserWindow({
            width: 1500,
            height: 800
        });
    }
}

const main = new Main();
```
**NOTE**: Make sure the `BrowserWindow` loads from the following URL: `http://localhost:8080` as this is the URL VueJS will start its development server at.
<br>
Were almost there now! Now we need to initialize electron-vue and then run dev.

To initialize electron-vue, run the following command...
```bash
electron-vue init
```

And now all we need to do is run it!
```bash
electron-vue dev
```
**NOTE**: after `dev` and `init` you can add one more parameter which can specify where the project root is.

### And thats it!
##### Important
Some users may put their electron main script in another directory, for those users, you must provide a config for electron-vue and set the electron main script location like the following...
###### electron-vue-project/electron-vue.json
```json
{
    "electron-main-path": "./src/electron/Main.js"
}
```

# Licence
This library is under the MIT licence

# Axeri
Feel free to fork this CLI tool, credits arn't needed, but we appreciate it greatly! :) Happy Coding!!
