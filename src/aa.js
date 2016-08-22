//测试

var pp;
var sketch = function (p) {
    var width = Math.max(document.documentElement.clientWidth,960);
    var height = Math.max(document.documentElement.clientHeight,600);
    p.setup = function (){
        p.createCanvas(width,height);
        p.canvas.id = "aa";
        p.rectMode = 'center';
    }
    p.draw = function () {
        p.background(200);
        p.rectMode = 'center';
        p.ellipse(p.width/2,p.height/2,50,50);
        // p.rect(10,10,50,50);
        // console.log(p.width);
    }
    pp = p;
}

new p5(sketch,'sketch1');
setTimeout(resizeCanvas,0);

function resizeCanvas(){
    var sketch = document.getElementById("sketch1");
    var width = Math.max(document.documentElement.clientWidth ,960);
    var height = Math.max(document.documentElement.clientHeight ,600);
    var left,top;
    pp.resizeCanvas(width,height);
    if (document.documentElement.clientWidth  < 960){
        left = (document.documentElement.clientWidth - pp.width) / 2;
    }else{
        left = (pp.width - document.documentElement.clientWidth) / 2;
    }
    if (document.documentElement.clientHeight - 50  < 600){
        top = (document.documentElement.clientHeight + 50 - pp.height) / 2;
    }else{
        top = (pp.height - document.documentElement.clientHeight + 50) / 2;
    }
    sketch.style.left = left + "px";
    sketch.style.top = top + "px";
}

$(window).resize(resizeCanvas);
