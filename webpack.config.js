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

function getHtmlPlugins(outputs, production) {
	return outputs.map((output) => {
		return new HtmlWebpackPlugin({
			inject: true,
			template: `./src/${output.filename}.html`,
			filename: `${output.filename}.html`,
			chunks: [output.filename],
			templateParameters: {
				title: output.title ? output.title : helper.graphic_info.title,
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
}

function getEntries(outputs, production) {
	let entries = {};
	outputs.forEach((output) => {
		const jsFile = `./src/${output.filename}.js`;
		entries[output.filename] = production
			? ["@webcomponents/custom-elements", jsFile]
			: [jsFile];
	});
	return entries;
}

module.exports = (env, argv) => {
	const production = argv.mode == "production";
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
						hydratable: true,
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
			splitChunks: {
				chunks: 'all'
			}
		},
	});
	return config;
};

