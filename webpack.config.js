const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const { DefinePlugin } = require("webpack");
const helper = require('./scripts/helper');


const build_path = path.resolve(__dirname, './public');

module.exports = (env, argv) => {
	const production = argv.mode == "production";
	const ASSET_PATH = production ? helper.app_package.config.asset_path : "/";
	let minimize = production;
	let plugins = [
		new HtmlWebpackPlugin({
			inject: true,
			template: './src/index.html',
			minify: {
				removeComments: true,
				collapseWhitespace: false,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
		}),
		new MiniCssExtractPlugin({
				filename: '[name].css',
		}),
		new DefinePlugin({
			'process.env.ASSET_PATH': production ? JSON.stringify(ASSET_PATH) : null,
			'process.env.PRODUCTION': production,
			'process.env.APP_NAME': helper.app_package.config.graphic_slug
		})
	];
	let babelRule = {
		test:  /\.(m?js|svelte)$/,
		exclude: /\/node_modules\/(?!(svelte\/))/,
		loader: "babel-loader",
		options: {
			presets: [
				['@babel/preset-env', {
					"useBuiltIns": "usage",
					"corejs": 3
				}]
			] 
		}
	};
	let rules = [
		{
			test: /\.svelte$/,
			exclude: /node_modules/,
			use: {
				loader: 'svelte-loader',
				options: {
					emitCss: true,
					hotReload: true
				}
			}
		},
		{
			test: /\.css$/,
			use: [				
				require.resolve('style-loader'),
				MiniCssExtractPlugin.loader,
				{
					loader: "css-loader",
					options: {
						url: false
					}
				},
				{
					loader: require.resolve('postcss-loader'),
					options: {
						// Necessary for external CSS imports to work
						// https://github.com/facebookincubator/create-react-app/issues/2677
						ident: 'postcss',
						plugins: () => [
							require('postcss-flexbugs-fixes'),
							autoprefixer({
								flexbox: 'no-2009'
							}),
						],
					},
				},
			],
		}
	];

	//use babel for production builds
	if (production) {
		rules.unshift(babelRule);
	}

	let config = {};
	if (argv.mode === "production") {
		plugins = plugins.concat([
			new CleanWebpackPlugin(),
			new CopyWebpackPlugin([
				{
					from: path.resolve('./src/static'),
					to: path.resolve(build_path, 'static')
				}
			]),
		]);
	}
	if (argv.mode === "development") {
		config = Object.assign(config, {
			devtool: 'source-map',
			devServer: {
				contentBase: path.resolve(__dirname, './src')
			}
		});
	}
	if (argv.mode === "test") {
		config = Object.assign(config, {
			devtool: 'source-map'
		});
	}
	config = Object.assign(config, {
		entry: {
			'app': production ? ["@webcomponents/custom-elements", "./src/index.js"] : ['./src/index.js']
		},
		output: {
			path: build_path,
			publicPath: ASSET_PATH,
			filename: '[name].js'
		},
		module: {
			rules: rules
		},
		plugins: plugins,
		optimization: {
			minimize: minimize,
			minimizer: [
				new TerserPlugin(),
				new OptimizeCSSAssetsPlugin({})
			]			
		}
	});
	return config;
};