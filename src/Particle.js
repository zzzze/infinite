var Particle = function (options){
	this.visualObject = options.visualObject;   //visualObject为实现了position属性与display方法的对象
	this.p = options.p;
	this.reflect = false;
	this.topspeed = options.topspeed || Math.random() * 3 + 2;  //控制最高速度
    this.acceleration = options.acceleration ?  options.acceleration.copy() : new p5.Vector(0,0);  //加速度
    this.velocity = options.velocity ?  options.velocity.copy() : new p5.Vector(    //速度
        Math.random()*((Math.random()>0.5)?-0.5:0.5),
        Math.random()-((Math.random()>0.5)?0.5:1)
    );
}

//粒子作用力
Particle.prototype.applyForce = function(force){
	this.acceleration.add(force);
}

//更新粒子状态
Particle.prototype.update = function(){
	//速度
	if(!this.velocity){
		var random1 = Math.random()*((Math.random()>0.5)?-0.5:0.5);
		var random2 = Math.random()-((Math.random()>0.5)?0.5:1);
		this.velocity = new p5.Vector(random1,random2);
	}
	
	this.velocity.add(this.acceleration);
	this.acceleration.mult(0);  //加速度清零
	
	if(this.reflect){
		if(this.visualObject.position.x < this.visualObject.width/2 || this.visualObject.position.x > this.p.width - this.visualObject.width/2){
			this.velocity.x *= -1;
		}
		if(this.visualObject.position.y < this.visualObject.height/2 || this.visualObject.position.y > this.p.height - this.visualObject.height/2){
			this.velocity.y *= -1;
		}
	}else{
        if(this.visualObject.position.x < -this.visualObject.width/2){
            this.visualObject.position.x = this.p.width + this.visualObject.width - Math.abs(this.visualObject.position.x);
        } 
        if(this.visualObject.position.x > this.p.width + this.visualObject.width/2){
			this.visualObject.position.x = this.visualObject.position.x - this.p.width - this.visualObject.width;
		}
        if(this.visualObject.position.y < -this.visualObject.height/2){
            this.visualObject.position.y = this.p.height + this.visualObject.height - Math.abs(this.visualObject.position.y);
        }
        if(this.visualObject.position.y > this.p.height + this.visualObject.height/2){
			this.visualObject.position.y = this.visualObject.position.y - this.p.height - this.visualObject.height;
		}
    }
	
	this.velocity.limit(this.topspeed);

	this.visualObject.position.add(this.velocity);
}

//绘制粒子
Particle.prototype.display = function(){
	this.update();
	this.visualObject.display();
}

module.exports = Particle;