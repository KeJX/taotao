
var express =require('express');//获得express模块
var app=express();//获得express对象
app.use(express.static(__dirname)).listen(8080);//让别人客人访问此目录下所有的静态网页，端口号是8080
