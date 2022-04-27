const path = require("path");

const PROJECT_DIR = path.join(__dirname, "..");

const get_package = () => {
	return require(path.join(PROJECT_DIR, "package.json"));
};

const get_info = () => {
	return require(path.join(PROJECT_DIR, "graphicinfo.json"));
};

module.exports = {
	app_package: get_package(),
	graphic_info: get_info(),
};

