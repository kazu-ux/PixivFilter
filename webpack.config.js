const path = require('path');

module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: 'development',

  // メインとなるJavaScriptファイル（エントリーポイント）
  // entry: './src/main.ts',

  entry: {
    background: path.join(__dirname, 'src/background.ts'),
    content_script: path.join(__dirname, 'src/content_script.ts'),
    'options/options': path.join(__dirname, 'src/options/options.ts'),
  },

  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },

  devtool: false,

  module: {
    rules: [
      {
        // 拡張子 .ts の場合
        test: /\.ts$/,
        // TypeScript をコンパイルする
        use: 'ts-loader',
      },
    ],
  },
  // import 文で .ts ファイルを解決するため
  // これを定義しないと import 文で拡張子を書く必要が生まれる。
  // フロントエンドの開発では拡張子を省略することが多いので、
  // 記載したほうがトラブルに巻き込まれにくい。
  resolve: {
    // 拡張子を配列で指定
    extensions: ['.ts', '.js'],
  },
};
