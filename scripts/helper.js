const path = require('path');
const fs = require('fs');

const get_package = () => {
	let app_directory = fs.realpathSync(process.cwd()),
		resolve_app = relative_path => path.resolve(app_directory, relative_path);
	return require(resolve_app('package.json'));
};

module.exports = {
	app_package: get_package()
};