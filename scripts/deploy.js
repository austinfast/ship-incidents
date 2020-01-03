const path = require('path');
const url = require('url');
const glob = require('glob');
const storage = require('@google-cloud/storage');
const FastlyPurge = require('fastly-purge');
const helper = require('./helper.js');

const build_path = path.resolve('./public');
const fastlyPurge = new FastlyPurge('');
const user = process.env.USER || process.env.USERNAME;
const cdn_auth = process.env.CDN_AUTH || null;
const base_url = 'https://www.gannett-cdn.com/experiments/usatoday/';
const options = {
    bucket: 'experiments-www-gannett-cdn-com',
    keyFilename: '/Users/' + user + '/.serviceaccount-experiments-www-gannett-cdn-com.json',
    projectId: 'gannett-product-production',
    base: '/' + path,
    public: true
};

const ensure_slash = (path, needsSlash=true) => {
    const hasSlash = path.endsWith('/');
    if (hasSlash && !needsSlash) {
        return path.substr(path, path.length - 1);
    } else if (!hasSlash && needsSlash) {
        return `${path}/`;
    } else {
        return path;
    }
};

const inject_credentials = (purge_url) => {
    const split_characters = 'www',
        parts = purge_url.split(split_characters);
    if (!cdn_auth) {
        throw "CDN_AUTH environment variable not set";
    }
    return parts[0] + cdn_auth + '@' + split_characters + parts[1];
};

const upload_to_nearline = (file_path, cdn_path, options) => {
    let gcs = storage({
            keyFilename: options.keyFilename,
            projectId: options.projectId
        }),
        bucket = gcs.bucket(options.bucket),
        storage_root = url.parse(ensure_slash(helper.app_package.config.asset_path)).pathname,
        local_path = file_path.replace(build_path, '');
    if (local_path[0] === '/') {
        local_path = local_path.slice(1);
    }
    let destination = storage_root + local_path;
    let purge_url = cdn_path + local_path;
    bucket.upload(file_path, {
        destination: destination
    }, function(err, file) {
        if (!err) {
            console.log('uploaded %s to %s', file_path, file.name);
            console.log('purging', purge_url);
            fastlyPurge.url(inject_credentials(purge_url), () => {});
        }
    });
};

// homepage not specified
if (!helper.app_package.config.asset_path) {
    throw new Error('Asset path not specified in package.json');
}
// where are you deploying this too?
if (helper.app_package.config.asset_path.indexOf(base_url) === -1)  {
    throw new Error(`Asset path must include ${base_url}`);
}
// user has not changed the url 
if (helper.app_package.config.asset_path === base_url)  {
    throw new Error('Asset path should be customized, a common pattern is https://www.gannett-cdn.com/experiments/usatoday/responsive/YEAR/app-name/');
}

glob(build_path + '/**', {}, function(er, files) {
    for (let file of files) {
        // is a file
        if (file.replace(build_path, '').indexOf('.') !== -1) {
            upload_to_nearline(file, helper.app_package.config.asset_path, options);
        }
    }
});


module.exports = {
    inject_credentials: inject_credentials,
    upload_to_nearline: upload_to_nearline
};