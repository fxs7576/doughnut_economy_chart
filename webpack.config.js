
const path = require("path");
const CleanPlugin = require("clean-webpack-plugin");

module.exports = {
    mode: "production",
    // watch: true,
    entry: "./src/main.ts",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "dist"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "/")
        },
        compress: true,
        port: 3000
    },
    devtool: "inline-source-map",
    resolve: {
        extensions: [".ts", ".js"]
    },
    plugins: [
        new CleanPlugin.CleanWebpackPlugin()
    ]
};