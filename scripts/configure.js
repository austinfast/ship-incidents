#!/usr/bin/env node
var fs = require('fs');
var _ = require('lodash');
var npm_package = require('../package.json');

var pathArray = __dirname.split('/');
var slug = pathArray[pathArray.length - 2];

if (!npm_package.config) {
    npm_package.config = {};
};

npm_package.config.graphic_slug = slug;
npm_package.config.asset_path = 'https://www.gannett-cdn.com/experiments/usatoday/' + slug + '/';
npm_package.name = slug
npm_package.version = "1.0.0";
npm_package.description = "";
npm_package.homepage = "";

fs.writeFile(__dirname + '/../package.json', JSON.stringify(npm_package, null, 4), function(err) {
    if(err) {
        return console.log(err);
    }
    else {
        return console.log("New graphic: " + slug);
    }
});
