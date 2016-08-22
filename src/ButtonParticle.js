var util = require("./util.js");
var Particle = require("./Particle.js");
var globalVar = require("./GlobalVar.js");

var ButtonParticle = function (options){
	Particle.call(this,{
		visualObject : options.visualObject,   //visualObject为实现了display方法的对象
		p : options.p,
		reflect : false,
		topspeed : options.topspeed,   //控制最高速度
		acceleration : options.acceleration,
		velocity : options.velocity
	});
	//this.strength = 0.1;
	this.vortexAttract = options.vortexAttract || true;   //vortexAttract确定button是被直线吸引还是漩涡吸引
	this.xoff = Math.random() * 10;    //用于生产noise随机数
};
util.inheritPrototype(ButtonParticle, Particle);

//粒子作用力
ButtonParticle.prototype.applyForce = function(force){
	this.acceleration.add(force);
};

//更新粒子状态
ButtonParticle.prototype.update = function(){
	if (this.attractPt){
		var vect = p5.Vector.sub(this.visualObject.position,this.attractPt.position);
		var len = vect.mag();
		if (this.vortexAttract){                  //两种吸引方式，两种运动模式
			var options = {
				b : this,
				threshold : 400 
			};
			var force = this.attractPt.attract(options);   //引力与漩涡力
			this.applyForce(force);
			
			var randomVect = this.velocity.copy();   //影响运行路径的随机向量防止所以的button都在运行一模一样的路径
			randomVect.mult(0.3);
			
			this.xoff += 0.01;    
			var effectAngle = (this.p.noise(this.xoff) - 0.5) * 2    //-1 to 1
			* (Math.PI / 2 * 0.1);  
			randomVect.rotate(effectAngle);
			this.velocity.add(randomVect);
			
			if (this.reflect){
				if(this.visualObject.position.x < this.visualObject.width/2 || this.visualObject.position.x > this.p.width - this.visualObject.width/2){
					this.velocity.x *= -1;
				}
				if(this.visualObject.position.y < this.visualObject.height/2 || this.visualObject.position.y > this.p.height - this.visualObject.height/2){
					this.velocity.y *= -1;
				}
			}
			//无限符号（∞）运动路径的实现
			var angle = vect.heading();
			
			if(!this.attractPt.clocklwise && len < 200 && angle < Math.PI/4 && angle > 0){
				this.attractPt = globalVar.attractPtR;
			}else{
				if(this.attractPt.clockwise && len < 200 && angle < 3 * Math.PI/4 && angle > Math.PI/2){
					this.attractPt = globalVar.attractPtL;
				}
			}
			this.velocity.add(this.acceleration);   //更新速度
			this.velocity.limit(this.topspeed);    //限制最高速度
			this.acceleration.mult(0);  //加速度清零
		}else{       //align模式的吸引方式（easing）
			vect.mult(-0.1);
			this.velocity = vect;
		}
	}
	this.visualObject.position.add(this.velocity);   //更新位置
};

//绘制粒子
ButtonParticle.prototype.display = function(){
	if(this.visualObject.pState != "click" && this.visualObject.pState != "hover" && this.visualObject.pState != "press"){
		this.update();
	}
	this.visualObject.display();
};

module.exports = ButtonParticle;