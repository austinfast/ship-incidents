const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");

const PROJECT_DIR = path.join(__dirname, "..");

const get_package = () => {
	return require(path.join(PROJECT_DIR, "package.json"));
};

const get_info = () => {
	const rawInfoFile = fs.readFileSync(path.join(PROJECT_DIR, "graphicinfo.yml"), "utf-8");
	return yaml.load(rawInfoFile);
};

module.exports = {
	app_package: get_package(),
	graphic_info: get_info(),
};

