var express = require("express");
var path = require('path');
var app = express();
app.get('/*', function(req, res) {
    var file = req.params[0]||"index.html";
    console.log('请求文件： ' + file + ' ...');
    if (file) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.sendfile('./' + file, {
        });
        console.log('　　文件： ' + file + ' 请求成功');
    } else {
        res.send(404, 'Sorry! you cant see that.');
        console.log('　　文件： ' + file + ' 请求失败');
    }

});
var port = 31136;
app.listen(port);
console.log("HTTP服务开启在%s端口上。",port);