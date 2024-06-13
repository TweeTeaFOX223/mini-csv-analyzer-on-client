// 出力は絶対pathで指定しなければいけない為、node.jsのpathモジュールを使用する
const path = require("path");
const outputPath = path.resolve(__dirname, "dist");

module.exports = {
  // バンドルするファイルを指定
  entry: "./src/main.mjs",
  output: {
    // バンドルしてmain.jsとして出力
    filename: "main.js",
    path: outputPath,
  },

  // webpack-dev-serverで対象にするディレクトリの設定
  devServer: {
    static: {
      directory: outputPath,
    },
  },
};
