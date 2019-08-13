//webpack.config.js
//是node的相关内容,请求了path模块
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')

const CopyWebpackPlugin = require('copy-webpack-plugin');
const resolve = dir => path.resolve(__dirname, dir);
module.exports = {
    // 入口文件
    entry:'./src/index.js',
    // 这mode我现在也不知
    mode:'development',
    // 构建后的出口文件配置
    
    resolve: {
        // 设置别名
        alias: {
            '@': resolve('src'),// 这样配置后 @ 可以指向 src 目录
            'api':resolve('src/api'),
            'static':resolve('src/static'),
            'assets':resolve('src/assets')
        }
    },
    output:{
        filename:'main.js',
        // 解析为绝对路径, path.resolve('/foo/bar', './baz');:// 返回: '/foo/bar/baz'
        path:path.resolve(__dirname,'dist')
        // __dirname,当前文件所在文件夹路径
    },
    module: {
        // 用于配置所有第三方加载器的规则
        rules: [
          {
            //   正则表达式去寻找.css为后缀的,匹配到就用下列加载器处理
            test: /\.css$/,
            // 采用的解析模块,顺序是!!从后到前!!
            use: ['style-loader', 'css-loader']
          },
          {
            test: /\.scss$/,
            use: [{
              loader: "style-loader"
            }, {
              loader: "css-loader",
              options:{
                sourceMap:true
                }
            }, {
              loader: "sass-loader",
              options:{
                sourceMap:true
                }
            }]
          },
          { test: /\.(jpg|png|gif|bmp|jpeg)$/,//正则表达式匹配图片规则
            use: [{
            loader:'url-loader',
            options:{
                limit:20000,//限制打包图片的大小：
                //如果大于或等于8192Byte，则按照相应的文件名和路径打包图片；如果小于8192Byte，则将图片转成base64格式的字符串。
                name:'images/[name]-[hash:8].[ext]',//images:图片打包的文件夹；
                //[name].[ext]：设定图片按照本来的文件名和扩展名打包，不用进行额外编码
                //[hash:8]：一个项目中如果两个文件夹中的图片重名，打包图片就会被覆盖，加上hash值的前八位作为图片名，可以避免重名。
            }
            }]},
          {
              test:/\.js$/,use:'babel-loader',exclude:/node_modules/
    // 主要以exclude,要排除node_modules ,因为不排除的话,babel会把所有第三方js文件都打包编译,会非常消耗性能,同时还有可能会导致包的损坏
            } ,
            {
              test:/\.(woff|woff2|eot|ttf|otf|svg)$/,
              loader:'file-loader'
            }  
        ]
      },
    plugins:[
        new htmlWebpackPlugin({
            //配置文件
            //指定 模拟页面,会根据指定的磁盘路径,生成内存中的页面
            template:path.join(__dirname,'./src/index.html'),
            //指定生成的页面的名称
            filename:'index.html'
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, './src/static'),
                to: 'static',
                ignore: ['.*']
            }
     ])
    ]
}