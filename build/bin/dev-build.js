var flo = require('fb-flo'),
    fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec;


var server = flo('./', {
  port: 1514,//F=15,E=14
  dir: './',
  glob: ['js/FE/*.js','js/FE/**/*.js']
}, resolver);

/*修复fb-flo的监听目录与文件没有正确分类而抛出的异常BUG*/
;(function(){
var detectChangedFile = server.watcher.detectChangedFile;
server.watcher.detectChangedFile = function function_name (dir) {
  if (!this.dirRegistery[dir]) {
    return
  }
  detectChangedFile.apply(this,arguments);
}
}());

//监听初始化
server.once('ready', function() {
  console.log('开始监听变动并实时编译!');
  _build_debug();
});

function resolver(filepath, callback) {

  _build_debug();
}
var _com = process.env.OS.indexOf("Window")!==-1?"r.js.cmd":"r.js";
function _build_debug () {
  exec(_com+" -o build/bin/build-debug.js",function (error,cb) {
    if (error||cb.indexOf("Error:")===0) {
      console.log("+++debugger build Error+++");
      console.log(error||cb);
      console.log("---debugger build Error---");
    }else{
      console.log("build debugger version success");
      _build_normal();
    }
  })
};
function _build_normal () {
  exec(_com+" -o build/bin/build-normal.js",function (error,cb) {
    if (error||cb.indexOf("Error:")===0) {
      console.log("+++normal build Error+++");
      console.log(error||cb);
      console.log("---normal build Error---");
    }else{
      console.log("build normal version success");
      _build_min();
    }
  });
};
function _build_min () {
  exec(_com+" -o build/bin/build-min.js",function (error,cb) {
    if (error||cb.indexOf("Error:")===0) {
      console.log("+++min build Error+++");
      console.log(error||cb);
      console.log("---min build Error---");
    }else{
      console.log("build min version success");
    }
  })
}
