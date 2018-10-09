import Attractor from 'Attractor'

export default class Particle {
  constructor(options) {
    this.geometry = options.geometry
    this.ctx = options.ctx
    this.rebound = false
    this.topspeed = options.topspeed || Math.random() * 3 + 2  //控制最高速度
    this.acceleration = options.acceleration ?  options.acceleration.copy() : new p5.Vector(0,0)  //加速度
    this.velocity = options.velocity ?  options.velocity.copy() : new p5.Vector(    //速度
      Math.random() * ((Math.random() > 0.5) ? -0.5 : 0.5),
      Math.random() - ((Math.random() > 0.5) ? 0.5 : 1)
    )
  }

  applyForce(force) {
    this.acceleration.add(force)
  }

  update() {
    //速度
    if(!this.velocity){
      var random1 = Math.random()*((Math.random()>0.5)?-0.5:0.5)
      var random2 = Math.random()-((Math.random()>0.5)?0.5:1)
      this.velocity = new p5.Vector(random1,random2)
    }

    this.velocity.add(this.acceleration)
    this.acceleration.mult(0)  //加速度清零

    if (this.rebound) {
      if (this.geometry.position.x < this.geometry.width/2 || this.geometry.position.x > this.ctx.canvas.width - this.geometry.width/2){
        this.velocity.x *= -1
      }
      if (this.geometry.position.y < this.geometry.height/2 || this.geometry.position.y > this.ctx.canvas.height - this.geometry.height/2){
        this.velocity.y *= -1
      }
    } else {
      if (this.geometry.position.x < -this.geometry.width/2){
        this.geometry.position.x = this.ctx.canvas.width + this.geometry.width - Math.abs(this.geometry.position.x)
      } 
      if (this.geometry.position.x > this.ctx.canvas.width + this.geometry.width/2){
        this.geometry.position.x = this.geometry.position.x - this.ctx.canvas.width - this.geometry.width
      }
      if (this.geometry.position.y < -this.geometry.height/2){
        this.geometry.position.y = this.ctx.canvas.height + this.geometry.height - Math.abs(this.geometry.position.y)
      }
      if (this.geometry.position.y > this.ctx.canvas.height + this.geometry.height/2){
        this.geometry.position.y = this.geometry.position.y - this.ctx.canvas.height - this.geometry.height
      }
    }
    this.velocity.limit(this.topspeed)
    this.geometry.position.add(this.velocity)
  }

  display() {
    if (!this.geometry.lockPosition) {
      this.update()
    }
    this.geometry.draw()
  }
}

