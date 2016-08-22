/**
 * VisualObject
 * by:Zzzz
 * date:2016-05-03
 */
var VisualObject = function (options) {
	this.position = options.position.copy();  //位置
	this.width = options.width;  //宽度
	this.height = options.height;  //高度
	this.p = options.p;  //p5实例 
	this.fillCol = options.fillCol || this.p.color(200,200,200,100);
}

VisualObject.prototype.update = function(){
}

//根据不同的状态绘制Button
VisualObject.prototype.display = function () {
	this.update();
	this.drawGeometry();
}

// 绘制几何图形
VisualObject.prototype.drawGeometry = function () {
	this.strokeCol ? this.p.stroke(this.strokeCol) : this.p.noStroke();
	this.p.fill(this.fillCol);
	this.p.push();
	this.p.translate(this.position.x, this.position.y);
	this.p.ellipse(0, 0, this.width, this.height);
	this.p.pop();
}


module.exports = VisualObject;