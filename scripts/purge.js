const path = require('path');
const deploy = require(path.resolve('./scripts/deploy'));
const FastlyPurge = require('fastly-purge');
const fastlyPurge = new FastlyPurge('');

let purge_url = process.argv[2];
if (purge_url && purge_url.indexOf('.gannetnpmt-cdn.com/experiments')) {
	console.log('purging "%s"', deploy.inject_credentials(purge_url));
	fastlyPurge.url(deploy.inject_credentials(purge_url), () => {});
}
else {
	console.warn('"%s" is not a valid URL to purge', purge_url);
}

