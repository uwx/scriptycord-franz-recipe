'use strict';

console.log('in fastpreload');

const path = require('path');

const { appTitle, nukeCrashReporter, userDataPath, desktopCoreAppRoot } = require('./preload/utils.js');

nukeCrashReporter();

require('./preload/monkeyPatch.js');

require('./preload/notificationScreenPolyfill.js');

require(desktopCoreAppRoot + '/mainScreenPreload');

process.once('loaded', function () {
  global.DiscordNative.nativeModules.requireModule = (name, remote) => {
    console.log('DiscordNative.nativeModules.requireModule: looking for:', name, 'remote:', remote || false);
    //if (!/^discord_/.test(name) && name !== \'erlpack\') {\n      throw new Error(\'"\' + String(name) + \'" is not a whitelisted native module\');
    if (remote) {
      throw new Error(); // i haven't figured out how this one works yet
    } else {
      return require(path.join(userDataPath, appTitle, 'modules', name));
    }
  };
});

// TODO: add patched notificationScreen

/*global.mainAppDirname = mod;

var metadata = metadata = {
    channel: _buildInfo2.default.releaseChannel
  };

  if (process.platform === 'linux') {
    var XDG_CURRENT_DESKTOP = process.env.XDG_CURRENT_DESKTOP || 'unknown';
    var GDMSESSION = process.env.GDMSESSION || 'unknown';
    metadata['wm'] = XDG_CURRENT_DESKTOP + ',' + GDMSESSION;
    try {
      metadata['distro'] = _child_process2.default.execFileSync('lsb_release', ['-ds'], { timeout: 100, maxBuffer: 512, encoding: 'utf-8' }).trim();
    } catch (e) {} // just in case lsb_release doesn't exist
  }

global.crashReporterMetadata*/

/* no need to emit, it works!
process.once('loaded', function () {
  console.log('loaded dont emit');
});*/