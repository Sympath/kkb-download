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
      },
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /.less/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      // {
      //   test: /.jpg|jpeg|gif|png$/,
      //   use: "file-loader",
      // },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1024000,
            },
          },
        ],
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: "file-loader",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
};
