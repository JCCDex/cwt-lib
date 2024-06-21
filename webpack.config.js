const path = require('path')
module.exports = {
  mode: 'none',
  entry: './src/index.ts', // 指定入口文件
  output: {
    path: path.resolve(__dirname, 'dist'), // 指定打包文件的目录
    filename: 'bundle.js' // 打包后文件的名称
  },
  // 指定webpack打包时要使用的模块
  module: {
    // 指定loader加载的规则
    rules: [
      {
        test: /\.ts$/, // 指定规则生效的文件：以ts结尾的文件
        use: 'ts-loader', // 要使用的loader
        exclude: /node-modules/ // 要排除的文件
      }
    ]
  },
  // 设置哪些文件类型可以作为模块被引用
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      "crypto": false,
      "buffer": false,
      "stream": false,
    }
  }
}