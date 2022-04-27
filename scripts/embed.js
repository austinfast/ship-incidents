#!/usr/bin/env node

require = require("esm")(module);
require("svelte/register");
const { readFile, stat, writeFile } = require("fs/promises");
const helper = require("./helper.js");
const path = require("path");

const DEPLOY_ENV = process.env.DEPLOY_ENV;
const ASSET_PATH = helper.app_package.config.asset_path.replace("$BRANCH", DEPLOY_ENV);
process.env.ASSET_PATH = ASSET_PATH;
const seed = Date.now();

async function fileExists(filePath) {
	return stat(filePath)
		.then(() => true)
		.catch(() => false);
}

// render static html for embedding
async function renderHtml(componentFilename, contentFilename) {
	const Component = require("../src/" + componentFilename).default;
	if (contentFilename) {
		const dataPath = path.join(__dirname, "..", "src/static/data", contentFilename);
		let contentFileExists = await fileExists(dataPath);
		if (contentFileExists) {
			const content = await readFile(
				path.join(__dirname,
				`../src/static/data/${contentFilename}`),
				"utf-8"
			).then(JSON.parse);
			// require component relative to the src/ directory
			const { html } = Component.render({ content: content });
			return html;
		} else {
			console.log("content file not found: " + contentFilename);
			prcoess.exit(1);
		}
	} else {
		const { html } = Component.render();
		return html;
	}
}

async function createEmbed(moduleName, componentFilename, contentFilename) {
	const outputFile = path.join(__dirname, "..", "public", `${moduleName}-embed.html`);
	const css = `${ASSET_PATH}${moduleName}.css?t=${seed}`;
	const js = `${ASSET_PATH}${moduleName}.js?t=${seed}`;
	const rendered = await renderHtml(componentFilename, contentFilename);
	const html = `<link href="${css}" rel="stylesheet" />\n<div id="${moduleName}" class="usat-interactive-graphic">${rendered}</div>\n<script src="${js}"></script>`;
	return writeFile(outputFile, html, "utf-8");
}

async function main() {
	console.log("Checking for any SSR embeds");
	const outputs = helper.graphic_info.output;
	let embeds = [];
	outputs.forEach((output) => {
		if (output.ssr) {
			console.log("Rendering embed for module " + output.filename);
			embeds.push(
				createEmbed(output.filename, output.ssr_component, output.ssr_contentfile)
			);
		}
	});
	return Promise.all(embeds);
}

if (require.main === module) {
	main();
}

