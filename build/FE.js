!function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = "function" == typeof require && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                throw new Error("Cannot find module '" + o + "'");
            }
            var f = n[o] = {
                exports: {}
            };
            t[o][0].call(f.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e);
            }, f, f.exports, e, t, n, r);
        }
        return n[o].exports;
    }
    for (var i = "function" == typeof require && require, o = 0; o < r.length; o++) s(r[o]);
    return s;
}({
    1: [ function(require, module) {
        module.exports = {
            text: {
                font_size: "14px",
                font_family: "思源黑体 CN Regular",
                color: "#222222"
            }
        };
    }, {} ],
    2: [ function(require) {
        function text(ctx, c, x, y) {
            ctx = c.setContextStyle(ctx);
            ctx.fillText(c.char, x, y);
        }
        function C(c, style) {
            this.char = c, this.style = style || Object.create(config.text);
        }
        function MX(ctx, text) {
            this.ctx = ctx;
            var MCS = this.MCS = [];
            text = text ? String(text) : "";
            for (var c, i = 0, line = [], j = 0; c = text[i]; i += 1) if ("\n" === c) {
                MCS.push(line);
                j += 1;
                line = [];
            } else line.push(new C(c));
            MCS.push(line);
            this.draw();
        }
        function init() {
            canvasNode = document.querySelector("canvas.editor");
            canvasNode.width = config.editor.width;
            canvasNode.height = config.editor.height;
            ctx = canvasNode.getContext("2d");
            var mx = new MX(ctx, "asdadsadsdas\n萨达大厦的asdasd阿"), cursorMap = new WeakMap(), cursorInfoMap = new WeakMap();
            canvasNode.addEventListener("click", function(e) {
                function resetCursor(cInfo) {
                    var offsetInfo = mx.getOffset(cInfo.line, cInfo.column);
                    inputNode.style.left = offsetInfo.x + canvasNode.offsetLeft + "px";
                    inputNode.style.top = offsetInfo.y + canvasNode.offsetTop + "px";
                }
                var inputNode = cursorMap.get(canvasNode);
                if (!inputNode) {
                    inputNode = document.createElement("input");
                    inputNode.className = "cursor";
                    inputNode.addEventListener("input", function() {
                        var cInfo = cursorInfoMap.get(this);
                        mx.add(this.value, cInfo.line, cInfo.column);
                        cInfo.column += this.value.length;
                        mx.draw();
                        resetCursor(cInfo);
                        this.value = "";
                    });
                    inputNode.addEventListener("keydown", function(e) {
                        var cInfo = cursorInfoMap.get(this);
                        switch (e.which) {
                          case 13:
                            var newLineInfo = mx.newLine(cInfo.line, cInfo.column);
                            mx.draw();
                            cInfo.line = newLineInfo.line;
                            cInfo.column = newLineInfo.column;
                            resetCursor(cInfo);
                        }
                    });
                    cursorMap.set(canvasNode, inputNode);
                    document.body.appendChild(inputNode);
                }
                var cInfo = mx.getNearCInfo(e.offsetX, e.offsetY);
                cursorInfoMap.set(inputNode, cInfo);
                resetCursor(cInfo);
                inputNode.focus();
            });
        }
        var config = (require("./config/setting.user"), {
            editor: {
                height: 400,
                width: 500
            },
            text: {
                font_size: "14px",
                font_family: "思源黑体 CN Regular",
                color: "#222222"
            },
            d_text: {
                font_size: "12px",
                font_family: "Source Code Pro",
                color: "#000000"
            }
        });
        C.ctx = function() {
            return document.createElement("canvas").getContext("2d");
        }();
        C.prototype = {
            getFontSize: function() {
                this.style;
                return this.style.font_size || config.text.font_size || config.d_text.font_size;
            },
            getFontFamily: function() {
                return this.style.font_family || config.text.font_family || config.d_text.font_family;
            },
            getFontString: function() {
                return this.getFontSize() + " " + this.getFontFamily();
            },
            getColor: function() {
                return this.style.color || config.text.color || config.d_text.color;
            },
            getHeight: function() {
                return parseFloat(this.getFontSize()) || 12;
            },
            setContextStyle: function(ctx) {
                ctx.font = this.getFontString();
                ctx.textAlign = "left";
                ctx.fillStyle = this.getColor();
                return ctx;
            },
            getWidth: function() {
                var ctx = this.setContextStyle(C.ctx);
                return ctx.measureText(this.char).width;
            }
        };
        var L = {
            getLineHeight: function(CS) {
                for (var c, maxLineHeight = 0, i = 0; c = CS[i]; i += 1) {
                    var lineHeight = c.getHeight();
                    lineHeight > maxLineHeight && (maxLineHeight = lineHeight);
                }
                return maxLineHeight;
            }
        };
        MX.prototype = {
            getNearCInfo: function(x, y) {
                for (var CS, MCS = this.MCS, acc_lineHeight = 0, lineHeight = 0, line = 0, i = 0, len = MCS.length; len > i; i += 1) {
                    CS = MCS[i];
                    line = i;
                    if (y >= acc_lineHeight && (acc_lineHeight += lineHeight = L.getLineHeight(CS)) >= y) break;
                }
                var acc_charWidth = 0, charWidth = 0, column = 0;
                console.group(x);
                console.log(CS);
                for (var c, i = 0, len = CS.length; len > i; i += 1) {
                    c = CS[i];
                    column = i;
                    var _left_eage = acc_charWidth - charWidth / 2;
                    charWidth = c.getWidth();
                    var _right_eage = acc_charWidth + charWidth / 2;
                    acc_charWidth += charWidth;
                    console.log(_left_eage, x, _right_eage);
                    if (x >= _left_eage && _right_eage >= x) break;
                }
                console.log(i, len, column);
                i && i === len && (column += 1);
                console.groupEnd(x);
                return {
                    C: c,
                    x: acc_charWidth - charWidth,
                    y: acc_lineHeight - lineHeight,
                    line: line,
                    column: column
                };
            },
            draw: function() {
                ctx = this.ctx;
                ctx.fillStyle = "#FFFFFF";
                var canvas = ctx.canvas;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                for (var lineHeight, acc_charWidth, charWidth, CS, MCS = this.MCS, acc_lineHeight = 0, i = 0; CS = MCS[i]; i += 1) {
                    lineHeight = L.getLineHeight(CS);
                    acc_lineHeight += lineHeight;
                    acc_charWidth = 0;
                    for (var c, j = 0; c = CS[j]; j += 1) {
                        charWidth = c.getWidth();
                        text(ctx, c, acc_charWidth, acc_lineHeight);
                        acc_charWidth += charWidth;
                    }
                }
            },
            add: function(text, line, column) {
                var MCS = this.MCS;
                text = text ? String(text) : "";
                if (text) for (var char, i = text.length - 1; char = text[i]; i -= 1) {
                    var CS = MCS[line];
                    CS || (CS = MCS[line] = []);
                    var new_c = new C(char);
                    CS.splice(column, 0, new_c);
                }
            },
            getOffset: function(line, column) {
                for (var CS, c, MCS = this.MCS, acc_lineHeight = 0, lineHeight = 0, acc_charWidth = 0, charWidth = 0, i = 0; line >= i; i += 1) {
                    CS = MCS[i];
                    acc_lineHeight += lineHeight = L.getLineHeight(CS);
                }
                for (var i = 0; column > i; i += 1) {
                    c = CS[i];
                    acc_charWidth += charWidth = c.getWidth();
                }
                return {
                    x: acc_charWidth,
                    y: acc_lineHeight - lineHeight
                };
            },
            newLine: function(line, column) {
                var MCS = this.MCS, oldLine = MCS[line], newLine = oldLine.splice(column);
                this.MCS.splice(line + 1, 0, newLine);
                return {
                    line: line + 1,
                    column: 0
                };
            }
        };
        window.onload = init;
    }, {
        "./config/setting.user": 1
    } ]
}, {}, [ 2 ]);