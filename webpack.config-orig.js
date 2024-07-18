const path = require("path");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { DefinePlugin } = require("webpack");
const helper = require("./scripts/helper");

const build_path = path.resolve(__dirname, "./public");
const DEPLOY_ENV = process.env.DEPLOY_ENV || "dev";

// TODO: may need to think even more about splitting out chunks for the 
// iframe embeds when it comes to data loading modules
// right now it is working well for the shared page, but at the cost of the individual embeds
// which will load ALL of the data when they require the shared chunk
function getHtmlPlugins(outputs, production) {
	const iframeOutputs = outputs
		.filter((output) => (production ? !output.local_only : true))
		.map((output) => {
			if (output.filename == "index") {
				return new HtmlWebpackPlugin({
					inject: true,
					template: './src/localtest.html',
					filename: 'index.html',
				})
			}
			return new HtmlWebpackPlugin({
				inject: true,
				template: `./src/iframe.html`,
				filename: `${output.filename}.html`,
				chunks: ["shared", output.filename],
				templateParameters: {
					title: output.title ? output.title : helper.graphic_info.title,
					domId: `MK-${output.filename}-embed`,
					description: output.description
						? output.description
						: helper.graphic_info.description,
				},
				minify: {
					removeComments: production,
					collapseWhitespace: false,
					removeRedundantAttributes: true,
					useShortDoctype: true,
					removeEmptyAttributes: true,
					removeStyleLinkTypeAttributes: true,
					keepClosingSlash: true,
					minifyJS: production,
					minifyCSS: production,
					minifyURLs: production,
				},
			});
		});
	if (!production) {
		return iframeOutputs;
	} else {
		const storytellingOutputs = outputs
			.filter((output) => !output.local_only)
			.map((output) => {
				return new HtmlWebpackPlugin({
					inject: false,
					template: `./src/s2embed.html`,
					filename: `${output.filename}_embed.html`,
					// only include shared module 1 time in the embed files
					// right now this is hard-coded to timeline, but should probably be on whatever embed gets loaded first
					chunks:
						output.filename == "timeline"
							? ["shared", output.filename]
							: [output.filename],
					templateParameters: {
						title: output.title ? output.title : helper.graphic_info.title,
						domId: `MK-${output.filename}-embed`,
						description: output.description
							? output.description
							: helper.graphic_info.description,
					},
					minify: {
						removeComments: production,
						collapseWhitespace: false,
						removeRedundantAttributes: true,
						useShortDoctype: true,
						removeEmptyAttributes: true,
						removeStyleLinkTypeAttributes: true,
						keepClosingSlash: true,
						minifyJS: production,
						minifyCSS: production,
						minifyURLs: production,
					},
				});
			});
		return iframeOutputs.concat(storytellingOutputs);
	}
}

function getEntries(outputs, production) {
	let entries = {
		shared: [
			"d3",
			"svelte",
			"./src/lib/colors.js",
			"./src/lib/dates.js",
			"./src/lib/events.js",
			"./src/lib/months.js",
			"./src/lib/text.js",
			"./src/lib/utils.js",
			"./src/lib/urls.js",
			"./src/lib/data/index.js",
			"./src/lib/data/incidents.js",
			/*
			"./src/lib/data/victims.js",
			"./src/lib/data/offenders.js",
			"./src/lib/data/weapons.js",
			*/
			"./src/style/index.css",
			"./src/style/fonts.css",
		],
	};
	outputs.forEach((output) => {
		if (production && output.local_only) {
			return;
		}
		const jsFile = `./src/${output.filename}.js`;
		entries[output.filename] = production
			? {
					import: ["@webcomponents/custom-elements", jsFile],
					dependOn: "shared",
			  }
			: {
					import: [jsFile],
					dependOn: "shared",
			  };
	});
	return entries;
}

module.exports = (env, argv) => {
	const production = argv.mode == "production";
	const dataRoot =
		process.env.MK_DATA_SRC == "development" ? helper.graphic_info.dataSources.development
		: process.env.MK_DATA_SRC == "production" || production
			? helper.graphic_info.dataSources.production
			: helper.graphic_info.dataSources.local;
	const ASSET_PATH = production
		? helper.app_package.config.asset_path.replace("$BRANCH", DEPLOY_ENV)
		: "/";
	const minimize = production;
	const output = helper.graphic_info.output;
	const htmlPlugins = getHtmlPlugins(output, production);
	let plugins = htmlPlugins.concat([
		new MiniCssExtractPlugin({
			filename: "[name].css",
		}),
		new DefinePlugin({
			"process.env.ASSET_PATH": production ? JSON.stringify(ASSET_PATH) : null,
			"process.env.PRODUCTION": production,
			"process.env.APP_NAME": helper.app_package.config.graphic_slug,
			"process.env.MK_DATA_ROOT": JSON.stringify(dataRoot),
		}),
	]);
	let babelRule = {
		test: /\.(m?js|svelte)$/,
		exclude: /\/node_modules\/(?!(svelte\/))/,
		loader: "babel-loader",
		options: {
			presets: [
				[
					"@babel/preset-env",
					{
						useBuiltIns: "usage",
						corejs: 3,
					},
				],
			],
		},
	};
	let rules = [
		{
			test: /\.svelte$/,
			exclude: /node_modules/,
			use: {
				loader: "svelte-loader",
				options: {
					emitCss: true,
					hotReload: true,
					compilerOptions: {
						hydratable: false,
					},
				},
			},
		},
		{
			test: /\.css$/,
			use: [
				production ? MiniCssExtractPlugin.loader : "style-loader",
				{
					loader: "css-loader",
					options: {
						url: false,
					},
				},
				{
					loader: require.resolve("postcss-loader"),
					options: {
						postcssOptions: {
							plugins: () => [
								require("postcss-flexbugs-fixes"),
								autoprefixer({
									flexbox: "no-2009",
								}),
							],
						},
					},
				},
			],
		},
	];

	//use babel for production builds
	if (production) {
		rules.unshift(babelRule);
	}

	let config = {};
	if (argv.mode === "production") {
		plugins = plugins.concat([
			new CopyWebpackPlugin({
				patterns: [
					{
						from: path.resolve("./src/static"),
						to: path.resolve(build_path, "static"),
						globOptions: {
							gitignore: true,
						},
						noErrorOnMissing: true,
					},
				],
			}),
		]);
	}
	if (argv.mode === "development") {
		config = Object.assign(config, {
			devtool: "source-map",
			devServer: {
				static: path.resolve(__dirname, "./src"),
				client: {
					overlay: {
						warnings: false,
					},
				},
			},
		});
	}
	if (argv.mode === "test") {
		config = Object.assign(config, {
			devtool: "source-map",
		});
	}
	config = Object.assign(config, {
		entry: getEntries(output, production),
		output: {
			path: build_path,
			publicPath: ASSET_PATH,
			filename: "[name].js",
			clean: production,
		},
		module: {
			rules: rules,
		},
		plugins: plugins,
		optimization: {
			minimize: minimize,
			minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
			// splitChunks: {
			// 	chunks: 'all'
			// }
		},
	});
	return config;
};