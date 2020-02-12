const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

var versions = {
  css: '20180426.01',
  jsLibs: '20180426.01',
  jsMain: '20180426.01',
  jsBookFullscreen: '20180426.01',
  jsGameFullscreen: '20180426.01',
  jsSaveThePig: '20180426.01'
};

Handlebars.registerHelper('versionCSS', () => { return versions.css; });
Handlebars.registerHelper('versionJSLibs', () => { return versions.jsLibs; });
Handlebars.registerHelper('versionJSMain', () => { return versions.jsMain; });
Handlebars.registerHelper('versionJSBookFullscreen', () => { return versions.jsBookFullscreen; });
Handlebars.registerHelper('versionJSGameFullscreen', () => { return versions.jsGameFullscreen; });
Handlebars.registerHelper('versionJSSaveThePig', () => { return versions.jsSaveThePig; });
