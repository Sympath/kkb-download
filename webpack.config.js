const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  context: process.cwd(), // 上下文对象
  target: 'node',
  mode: "development",
  node: {
    __filename: false,
    __dirname: false
  },
  resolve: {
    alias: {
      "@": path.join(__dirname, "./src"), // 这样@符号就表示项目根目录中src这一层路径
      "_": __dirname
    }
  },
  entry: {
    // formatConfig: "./src/formatConfig.js",
    main: "./src/index.js",
    getFilesArr: './src/getFilesArr_1.js',
    shDownLoad: './src/shDownLoad_1.js',
    delete: './src/delete.js',
    download: './src/download.js'
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: "babel-loader",
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
};
