var config = {
	editor:{
		height:400,
		width:400
	},
	//User
	text:{
		font_size:"14px",
		font_family:"思源黑体 CN Regular",
		color:"#222222"
	},
	//Default
	d_text:{
		font_size:"12px",
		font_family:"Source Code Pro",
		color:"#000000"
	}
}

function text(ctx,c,x,y) {
	//设置样式
	ctx = c.setContextStyle(ctx);
	// 设置字体内容，以及在画布上的位置
	ctx.fillText(c.char, x, y); 
	// // 绘制空心字
	// ctx.strokeText(text, x, 100); 
}

//字符信息
function C(c,/*line,column,*/style) {
	this.char = c,
	// this.line = line,
	// this.column = column,
	this.style = style||Object.create(config.text)
};
C.ctx = (function  () {
	return document.createElement("canvas").getContext("2d");
}());
C.prototype = {
	getFontSize:function () {
		var style = this.style;
		return this.style.font_size||config.text.font_size||config.d_text.font_size
	},
	getFontFamily:function () {
		return this.style.font_family||config.text.font_family||config.d_text.font_family;
	},
	getFontString:function () {
		return this.getFontSize()+" "+this.getFontFamily();
	},
	getColor:function () {
		return this.style.color||config.text.color||config.d_text.color; 
	},
	getHeight:function () {
		return parseFloat(this.getFontSize())||12;
	},
	setContextStyle:function (ctx){
		// 设置字体
		ctx.font = this.getFontString();
		// 设置对齐方式
		ctx.textAlign = "left";
		// 设置填充颜色
		ctx.fillStyle = this.getColor(); 
		return ctx;
	},
	getWidth:function () {
		var ctx = this.setContextStyle(C.ctx);
		return ctx.measureText(this.char).width;
	}
};

//行信息辅助功能
var L = {
	getLineHeight:function (CS) {
		var maxLineHeight = 0
		for(var i = 0,c; c = CS[i]; i+=1){
			var lineHeight = c.getHeight();
			(lineHeight>maxLineHeight)&&(maxLineHeight = lineHeight);
		}
		return maxLineHeight;
	}
}

function MX(ctx,text){
	this.ctx = ctx;
	var MCS = this.MCS = []
	text = text?String(text):"";
	for(var i = 0, c, line=[], j = 0/*MCS.length*/;
		c = text[i];
		i += 1){
		if (c === "\n") {
			MCS.push(line);
			j += 1;
			line = [];
		}else{
			line.push(new C(c/*,i,j*/));
		}
	}
	MCS.push(line);
};
MX.prototype = {
	//获取最接近某坐标的C对象及其相应信息
	getNearCInfo:function (x,y) {
		var MCS = this.MCS;
		var acc_lineHeight = 0;
		var lineHeight = 0;
		var line = 0;
		for(var i=0,CS,len=MCS.length; i<len; i+=1){
			CS = MCS[i];
			line = i;
			if (acc_lineHeight<=y&&(acc_lineHeight+=(lineHeight = L.getLineHeight(CS)))>=y) {
				break
			}
		}
		var acc_charWidth = 0;
		var charWidth = 0;
		var column = 0;
		console.group(x);
		console.log(CS);
		for(var i=0,c,len=CS.length; i<len; i+=1){
			c = CS[i];
			column = i;
			var _left_eage = acc_charWidth-charWidth/2;
			charWidth = c.getWidth()
			var _right_eage = acc_charWidth+charWidth/2;
			acc_charWidth+=charWidth;
			console.log(_left_eage,x,_right_eage);
			if (_left_eage<=x&&_right_eage>=x) {
				break
			}
		}
		//如果是找不到最佳点，而且队列非空，那就是末尾
		console.log(i,len,column);
		if (i&&i===len) {
			column+=1;
		}
		console.groupEnd(x);
		return {
			C:c,
			x:acc_charWidth - charWidth,
			y:acc_lineHeight - lineHeight,
			line:line,
			column:column
		};
	},
	draw:function () {
		//清空画布
		ctx = this.ctx;
		ctx.fillStyle = "#FFFFFF";
		var canvas = ctx.canvas;
		ctx.fillRect(0,0,canvas.width, canvas.height);
		//开始绘制文字
		var MCS = this.MCS;
		var acc_lineHeight = 0;
		var lineHeight;
		var acc_charWidth;
		var charWidth;
		for(var i=0,CS;CS=MCS[i];i+=1){
			lineHeight = L.getLineHeight(CS);
			acc_lineHeight+=lineHeight;
			acc_charWidth = 0;
			for(var j=0,c;c=CS[j];j+=1){
				charWidth = c.getWidth();
				text(ctx,c,acc_charWidth,acc_lineHeight);
				acc_charWidth+=charWidth;
			}
		}
	},
	add:function (text,line,column) {
		var MCS = this.MCS;
		text = text?String(text):"";
		if(text){
			for(var i=text.length-1,char;char = text[i];i-=1){
				var CS = MCS[line];
				if(!CS){
					CS = MCS[line] = []
				}
				var new_c = new C(char);
				CS.splice(column,0,new_c);
			}
		}
	},
	//传入光标坐标
	getOffset:function (line,column) {
		var MCS = this.MCS;
		var acc_lineHeight = 0;
		var lineHeight = 0;
		var acc_charWidth = 0;
		var charWidth = 0;
		var CS,c;
		for(var i=0;i<=line;i+=1){
			CS = MCS[i];
			acc_lineHeight+=(lineHeight = L.getLineHeight(CS));
		}
		for(var i=0;i<column;i+=1){
			c = CS[i];
			acc_charWidth+=(charWidth = c.getWidth());
		}
		return {
			x:acc_charWidth,
			y:acc_lineHeight-lineHeight
		}
	},
	//传入光标坐标
	newLine:function (line,column) {
		var MCS = this.MCS;
		var oldLine = MCS[line];
		var newLine = oldLine.splice(column);
		this.MCS.splice(line+1,0,newLine);
		return {
			line:line+1,
			column:0
		}
	}
};
function init (text) {

	/*var */canvasNode = document.querySelector("canvas.editor");
	canvasNode.width = config.editor.width;
	canvasNode.height = config.editor.height;
	/*var */ctx = canvasNode.getContext('2d');
	
	//初始化一个横竖都为0的矩阵列
	var mx = new MX(ctx,"");

	//光标缓存区
	var cursorMap = new WeakMap();
	//光标坐标信息缓存区
	var cursorInfoMap = new WeakMap();
	canvasNode.addEventListener("click",function (e) {
		var inputNode = cursorMap.get(canvasNode);
		if (!inputNode) {
			inputNode = document.createElement("input");
			inputNode.className = "cursor";

			function resetCursor(cInfo) {
				var offsetInfo = mx.getOffset(cInfo.line,cInfo.column);
				inputNode.style.left = offsetInfo.x+canvasNode.offsetLeft+"px";
				inputNode.style.top = offsetInfo.y+canvasNode.offsetTop+"px";
			}
			inputNode.addEventListener("input",function (e) {
				var cInfo = cursorInfoMap.get(this);
				mx.add(this.value,cInfo.line,cInfo.column);
				cInfo.column+=this.value.length;

				mx.draw();
				resetCursor(cInfo);
				this.value = "";
			});
			inputNode.addEventListener("keydown",function (e) {
				var cInfo = cursorInfoMap.get(this);
				switch(e.which){
					case 13:
					var newLineInfo = mx.newLine(cInfo.line,cInfo.column)
					mx.draw();
					cInfo.line = newLineInfo.line;
					cInfo.column = newLineInfo.column;
					resetCursor(cInfo);
					break
				}
			});
			cursorMap.set(canvasNode,inputNode)
			document.body.appendChild(inputNode);
		}
		var cInfo = mx.getNearCInfo(e.offsetX,e.offsetY);
		cursorInfoMap.set(inputNode,cInfo);
		// console.log(cInfo);
		resetCursor(cInfo);
		// console.log(e);
		inputNode.focus();
	});
}
window.onload = init;