var path = require("path");

module.exports = {
	entry: './index.js',
	output: {
		path: __dirname,
		filename: 'bundle.js',
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader?presets[]=es2015&presets[]=react'
			},
			{
				test: /\.css$/,
				loader: 'style!css'		//npm install style-loader css-loader --save-dev
			}
		]
	}
}