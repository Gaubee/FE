function text(t, e, n, i) {
    t = e.setContextStyle(t);
    t.fillText(e.char, n, i);
}

function C(t, e) {
    this.char = t, this.style = e || Object.create(config.text);
}

function MX(t, e) {
    this.ctx = t;
    var n = this.MCS = [];
    e = e ? String(e) : "";
    for (var i, o = 0, r = [], a = 0; i = e[o]; o += 1) if ("\n" === i) {
        n.push(r);
        a += 1;
        r = [];
    } else r.push(new C(i));
    n.push(r);
    this.draw();
}

function init() {
    canvasNode = document.querySelector("canvas.editor");
    canvasNode.width = config.editor.width;
    canvasNode.height = config.editor.height;
    ctx = canvasNode.getContext("2d");
    var t = new MX(ctx, "asdadsadsdas\n萨达大厦的asdasd阿"), e = new WeakMap(), n = new WeakMap();
    canvasNode.addEventListener("click", function(i) {
        function o(e) {
            var n = t.getOffset(e.line, e.column);
            r.style.left = n.x + canvasNode.offsetLeft + "px";
            r.style.top = n.y + canvasNode.offsetTop + "px";
        }
        var r = e.get(canvasNode);
        if (!r) {
            r = document.createElement("input");
            r.className = "cursor";
            r.addEventListener("input", function() {
                var e = n.get(this);
                t.add(this.value, e.line, e.column);
                e.column += this.value.length;
                t.draw();
                o(e);
                this.value = "";
            });
            r.addEventListener("keydown", function(e) {
                var i = n.get(this);
                switch (e.which) {
                  case 13:
                    var r = t.newLine(i.line, i.column);
                    t.draw();
                    i.line = r.line;
                    i.column = r.column;
                    o(i);
                }
            });
            e.set(canvasNode, r);
            document.body.appendChild(r);
        }
        var a = t.getNearCInfo(i.offsetX, i.offsetY);
        n.set(r, a);
        o(a);
        r.focus();
    });
}

var config = {
    editor: {
        height: 400,
        width: 400
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
};

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
    setContextStyle: function(t) {
        t.font = this.getFontString();
        t.textAlign = "left";
        t.fillStyle = this.getColor();
        return t;
    },
    getWidth: function() {
        var t = this.setContextStyle(C.ctx);
        return t.measureText(this.char).width;
    }
};

var L = {
    getLineHeight: function(t) {
        for (var e, n = 0, i = 0; e = t[i]; i += 1) {
            var o = e.getHeight();
            o > n && (n = o);
        }
        return n;
    }
};

MX.prototype = {
    getNearCInfo: function(t, e) {
        for (var n, i = this.MCS, o = 0, r = 0, a = 0, c = 0, s = i.length; s > c; c += 1) {
            n = i[c];
            a = c;
            if (e >= o && (o += r = L.getLineHeight(n)) >= e) break;
        }
        var f = 0, l = 0, h = 0;
        console.group(t);
        console.log(n);
        for (var g, c = 0, s = n.length; s > c; c += 1) {
            g = n[c];
            h = c;
            var u = f - l / 2;
            l = g.getWidth();
            var d = f + l / 2;
            f += l;
            console.log(u, t, d);
            if (t >= u && d >= t) break;
        }
        console.log(c, s, h);
        c && c === s && (h += 1);
        console.groupEnd(t);
        return {
            C: g,
            x: f - l,
            y: o - r,
            line: a,
            column: h
        };
    },
    draw: function() {
        ctx = this.ctx;
        ctx.fillStyle = "#FFFFFF";
        var t = ctx.canvas;
        ctx.fillRect(0, 0, t.width, t.height);
        for (var e, n, i, o, r = this.MCS, a = 0, c = 0; o = r[c]; c += 1) {
            e = L.getLineHeight(o);
            a += e;
            n = 0;
            for (var s, f = 0; s = o[f]; f += 1) {
                i = s.getWidth();
                text(ctx, s, n, a);
                n += i;
            }
        }
    },
    add: function(t, e, n) {
        var i = this.MCS;
        t = t ? String(t) : "";
        if (t) for (var o, r = t.length - 1; o = t[r]; r -= 1) {
            var a = i[e];
            a || (a = i[e] = []);
            var c = new C(o);
            a.splice(n, 0, c);
        }
    },
    getOffset: function(t, e) {
        for (var n, i, o = this.MCS, r = 0, a = 0, c = 0, s = 0, f = 0; t >= f; f += 1) {
            n = o[f];
            r += a = L.getLineHeight(n);
        }
        for (var f = 0; e > f; f += 1) {
            i = n[f];
            c += s = i.getWidth();
        }
        return {
            x: c,
            y: r - a
        };
    },
    newLine: function(t, e) {
        var n = this.MCS, i = n[t], o = i.splice(e);
        this.MCS.splice(t + 1, 0, o);
        return {
            line: t + 1,
            column: 0
        };
    }
};

window.onload = init;