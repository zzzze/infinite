/*
基于p5.js,Button
by:Zzzz
date:2016-03-03
*/
var Button = require("./Button.js");
var util = require("./util.js");

function ButtonPlus(options) {
	Button.call(this, options);
	this.breath = false;  //是否开启呼吸效果
	this.breathState = false;  //呼吸状态
	this.w = options.width;  //原始宽度数据备份
	this.h = options.height;  //原始高度数据备份
	this.clickTimeline = 0;   //On状态的时间轴
	this.geometryType = "circle";
	this.maxWidth = 100;
	this.filtered = false;   //用于过滤
	
	var translateX = this.constructor.prototype.trans[this.constructor.prototype.trans.length - 1].x,     //p5的bug,translate后,鼠标位置出错.
		translateY = this.constructor.prototype.trans[this.constructor.prototype.trans.length - 1].y;
	this.mouseX = this.p.mouseX - translateX;
	this.mouseY = this.p.mouseY - translateY;
}
util.inheritPrototype(ButtonPlus, Button);

//统计ButtonPlus实例被选中个数，主要目的在于控制每次只能选择一个Button
ButtonPlus.prototype.hoverObjCount = 0;
ButtonPlus.prototype.clickObjCount = 0;
ButtonPlus.prototype.unselectableArea = null;

//判断ButtonPlus是否被选中（加强版）
ButtonPlus.prototype.isSelected = function () {
	

	if (this.filtered){     //假如被排除了，那么所有的状态都为未选中（亦即永远选不中）
		return false;
	}
	var width = this.width > 40 ? this.width : 40;
	var height = this.width > 40 ? this.width : 40;
	if (this.width === this.height && this.geometryType === "circle") {
		if (Math.pow((this.mouseX - this.position.x), 2) + Math.pow((this.mouseY - this.position.y), 2) <= Math.pow(width / 2, 2)) {
			if (this.isMouseInUnSectArea(this.mouseX, this.mouseY) && this.pState !== "click" && this.pState !== "press"){
				return false;
			}else{
				return true;
			}
		} else {
			return false;
		}
	} else {
		if (this.mouseX >= this.position.x - width / 2 && this.mouseX <= this.position.x + width / 2 && this.mouseY >= this.position.y - height / 2) {
			if (this.isMouseInUnSectArea(this.mouseX, this.mouseY)){
				return false;
			}
			return true;
		} else {
			return false;
		}
	}
};

ButtonPlus.prototype.isMouseInUnSectArea = function (mouseX, mouseY){
	if (this.constructor.prototype.unselectableArea !== null && (Math.pow((mouseX - this.constructor.prototype.unselectableArea.x), 2) + Math.pow((mouseY - this.constructor.prototype.unselectableArea.y), 2) <= Math.pow(this.maxWidth / 2, 2))){
		return true;
	}else{
		return false;
	}
}

//判断ButtonPlus的状态（加强版）
ButtonPlus.prototype.getState = function () {
	/**
	 * hover (pState) ： 鼠标悬浮（被选中）
	 * press (pState) ： 鼠标按下
	 * click (pState) ： 鼠标点击
	 * mouseOut (pState) ： 鼠标从button上移开/未被选中
	 * on (pSwitch) : Button处于开启状态
	 * off (pSwitch) ： Button处于关闭状态
	 */
	if (this.isSelected()) {
		if (this.pState === "click") {
			if (this.p.mouseIsPressed) {
				if (this.pState !== "mouseOut") {
					return "press";
				} else {
					return;
				}
			} else {
				return "click";
			}
		} else {
			if (this.constructor.prototype.hoverObjCount <= 0 || this.pState != "mouseOut") {
				if (this.p.mouseIsPressed) {
					if (this.pState === "mouseOut") {
						return "mouseOut";
					} else {	
						//如果button的大小小于90,则不出现press状态
						if(this.width >= this.maxWidth - 10){
							return "press";
						}else{
							return "hover"
						}
					}
				} else {
					if (this.pState === "press") {
						if (this.pSwitch === "on") {
							this.pSwitch = "off";
							this.fire({ type: "turnOff" });
							this.constructor.prototype.hoverObjCount += 1;
							this.constructor.prototype.clickObjCount -= 1;
							if (this.constructor.prototype.clickObjCount === 0){
								this.constructor.prototype.unselectableArea = null;
							}
							return "hover";
						} else {

							this.pSwitch = "on";
							this.fire({ type: "turnOn" });
							return "click";

						}
					} else {
						if (this.pState !== "hover") {
							//first
							this.constructor.prototype.hoverObjCount += 1;
						}
						return "hover";
					}
				}
			} else {
				return "mouseOut";
			}
		}
	} else {
		if (this.pState == "click") {
			if (this.constructor.prototype.clickObjCount > 1 && this.clickTimeline !== 0){
				this.constructor.prototype.clickObjCount -= 1;
				this.pSwitch = "off";
				return "mouseOut";
			}
			return "click";
		} else {
			if (this.p.mouseIsPressed && this.pSwitch == "on") {
				this.pSwitch = "off";
				this.fire({ type: "turnOff" });
				if (this.constructor.prototype.clickObjCount === 0){
					this.constructor.prototype.unselectableArea = null;
				}
			}
			if (this.pState == "hover" ) {  //|| this.pState == "press"
				this.constructor.prototype.hoverObjCount -= 1;
			}
			return "mouseOut";
		}
	}
};

ButtonPlus.prototype.update = function (){
	this.trans_position = new p5.Vector(this.position.x + this.constructor.prototype.trans[this.constructor.prototype.trans.length - 1].x, this.position.y + this.constructor.prototype.trans[this.constructor.prototype.trans.length - 1].y);
	var translateX = this.constructor.prototype.trans[this.constructor.prototype.trans.length - 1].x,     //p5的bug,translate后,鼠标位置出错.
		translateY = this.constructor.prototype.trans[this.constructor.prototype.trans.length - 1].y;
	this.mouseX = this.p.mouseX - translateX;
	this.mouseY = this.p.mouseY - translateY;
};
//根据不同的状态绘制ButtonPlus（加强版）
ButtonPlus.prototype.display = function () {
	this.update();
	if (this.strokeCol) {
		this.p.stroke(this.strokeCol);
	} else {
		this.p.noStroke();
	}

	this.p.rectMode('center');
	this.state = this.getState();
	this.cursorState(this.state);  //鼠标状态
	switch (this.state) {
		case "hover":
			//音效
			if (this.pState == "mouseOut") {         //首次hover
				if (this.sound) this.sound.play();
			}
			this.fillCol = this.buttonCol;
			//this.p.fill(this.fillCol);
			this.drawObj();
			if (this.width > this.maxWidth) {
				this.breath = true;
			}

			var s = 1.1;
			if (this.breath) {
				//呼吸效果
				if (!this.breathState && this.width <= this.maxWidth) {
					this.width *= 1.002;
					this.height *= 1.002;
				} else {
					this.breathState = true;
				}
				if (this.breathState && this.width > this.maxWidth - 10) {
					this.width *= 0.995;
					this.height *= 0.995;
				} else {
					this.breathState = false;
				}
			} else {
				//放大
				if (this.width <= this.maxWidth) {
					this.width *= s;
					this.height *= s;
				} else {

				}
			}
			this.fire({ type: "hover" });
			this.pState = "hover";
			break;
		case "mouseOut":
			if (this.buttonCol) {
				this.fillCol = this.buttonCol;
			}
			this.drawObj();
			this.breath = false;

			//缩小
			var s = 0.95;
			if (this.width > this.w) {
				this.width *= s;
				this.height *= s;
			}

			this.fire({ type: "mouseOut" });
			this.pState = "mouseOut";
			break;
		case "press":
			this.fillCol = this.pressCol;
			this.drawObj();
			this.fire({ type: "press" });
			this.pState = "press";
			break;
		case "click":
			this.fillCol = this.clickCol;
			this.drawObj();

			//点击反馈
			if (this.pState === "press") {    //trunOn
				this.clickTimeline = 0;
				this.constructor.prototype.hoverObjCount -= 1;
				this.constructor.prototype.clickObjCount += 1;
				this.constructor.prototype.unselectableArea = this.position.copy();
			} else {
				this.clickTimeline++;
			}
			
			this.fire({ type: "click" });
			this.pState = "click";
			break;
		default:
			if (this.buttonCol) {
				this.fillCol = this.buttonCol;
			} else {
				this.fillCol = this.p.color(0, 0, 100);
			}
			this.drawObj();
	}
};

//ButtonPlus状态重置
ButtonPlus.stateReset = function () {
	this.prototype.hoverObjCount = 0;
};

ButtonPlus.prototype.drawObj = function (){
	if (this.filtered){
		this.drawFilteredObj();
	}else{
		this.drawGeometry();
	}
};

ButtonPlus.prototype.drawFilteredObj = function (){
	//this.strokeCol ? this.p.stroke(this.strokeCol) : this.p.noStroke();
	this.p.fill(this.p.color(200,200,200));
	this.p.push();
	this.p.translate(this.position.x, this.position.y);
	this.p.ellipse(0, 0, this.width, this.height);
	this.p.pop();
};

ButtonPlus.prototype.trans = [{
	x : 0,
	y : 0
}];

ButtonPlus.prototype._trans = null;

ButtonPlus.translate = function (x, y, p){
	p.translate(x,y);
	this.prototype._trans = {
		x : this.prototype.trans[this.prototype.trans.length - 2].x + x,       //什么bug来的！！！！！Array最后一个竟然是length - 2！！！！！！
		y : this.prototype.trans[this.prototype.trans.length - 2].y + y
	};
};

ButtonPlus.pushMatrix = function (p){
	p.push();
	if (this.prototype._trans === null){
		this.prototype.trans.push({
			x : this.prototype.trans[this.prototype.trans.length - 1].x,
			y : this.prototype.trans[this.prototype.trans.length - 1].y
		});
	}else{
		this.prototype.trans.push({
			x : this.prototype._trans.x,
			y : this.prototype._trans.y
		});
	}
};

ButtonPlus.popMatrix = function (p){
	if (this.prototype.trans.length > 0){
		p.pop();
		this.prototype.trans.pop();
	}
};

module.exports = ButtonPlus;
