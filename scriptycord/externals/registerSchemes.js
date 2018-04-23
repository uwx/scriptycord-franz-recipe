'use strict';
const electron = require('electron');
const path = require('path');
const { protocolRoot } = require('../paths.js');

process.once('loaded', () => {
  const webContents = electron.remote.getCurrentWebContents();
  webContents.once('dom-ready', () => {
    const protocol = webContents.session.protocol;
    protocol.isProtocolHandled('hansen', async isHandled => {
      console.log('[got callback');
      if (isHandled) {
        console.warn('[registerSchemes] hansen already handled, removing');
        await unregisterProtocol(protocol, 'hansen');
      }

      protocol.registerFileProtocol('hansen', (req, callback) => {
        var url = req.url.substr(9);
        if (url.endsWith('/')) {
          url = url.slice(0, -1);
        }
        
        console.log('[HANSEN] url', url);
        callback({path: path.normalize(protocolRoot + '/' + url)});
      }, error => {
        if (error) {
          console.error('[HANSEN] Failed to register protocol', error);
        }
      });

      electron.webFrame.registerURLSchemeAsPrivileged('hansen');
      electron.webFrame.registerURLSchemeAsPrivileged('extension');
      electron.webFrame.registerURLSchemeAsPrivileged('chrome-extension');
    });
  });

});

function unregisterProtocol(protocol, scheme) {
  return new Promise((resolve, reject) => {
    protocol.unregisterProtocol(scheme, err => {
      if (err) reject(err);
      else resolve();
    });
  })
}

/*
webFrame.registerURLSchemeAsPrivileged(scheme[, options])

    scheme String
    options Object (optional)
        secure Boolean - (optional) Default true.
        bypassCSP Boolean - (optional) Default true.
        allowServiceWorkers Boolean - (optional) Default true.
        supportFetchAPI Boolean - (optional) Default true.
        corsEnabled Boolean - (optional) Default true.

*/