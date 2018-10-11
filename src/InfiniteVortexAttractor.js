import Attractor from 'Attractor'
import VortexAttractor from 'VortexAttractor'

export default class InfiniteVortexAttractor extends VortexAttractor {
  constructor(options) {
    super(options)
    this.dis = options.dis
    this.positionLeft = new p5.Vector(this.position.x - this.dis / 2, this.position.y)
    this.positionRight = new p5.Vector(this.position.x + this.dis / 2, this.position.y)
    this.realAttractPointRecord = {}
  }

  draw() {
    const ctx = this.scene.ctx
    ctx.save()
    ctx.translate(this.positionLeft.x, this.positionLeft.y)
    ctx.beginPath()
    ctx.arc(0, 0, this.width / 2, 0, 2 * Math.PI)
    ctx.fillStyle = this.fillCol
    ctx.fill()
    ctx.restore()

    ctx.save()
    ctx.translate(this.positionRight.x, this.positionRight.y)
    ctx.beginPath()
    ctx.arc(0, 0, this.width / 2, 0, 2 * Math.PI)
    ctx.fillStyle = this.fillCol
    ctx.fill()
    ctx.restore()
  }

  attract(particle){
    let realAttractPoint = this.realAttractPointRecord[particle.id]
    if (!realAttractPoint) {
      realAttractPoint = this.positionLeft
      this.realAttractPointRecord[particle.id] = realAttractPoint
    }

    // var vect = p5.Vector.sub(particle.geometry.position, realAttractPoint)
    var vect = p5.Vector.sub(realAttractPoint, particle.geometry.position)
    var len = vect.mag()
    var angle = vect.heading()

    if(realAttractPoint != this.positionLeft
      && len < this.threshold + 20
      && angle < Math.PI/4
      && angle > 0){
      realAttractPoint = this.positionLeft
      this.realAttractPointRecord[particle.id] = realAttractPoint
    } else if(len < this.threshold + 20
      && angle < 3 * Math.PI/4
      && angle > Math.PI/2 * 1.4){
      realAttractPoint = this.positionRight
      this.realAttractPointRecord[particle.id] = realAttractPoint
    }

    return super._attract(particle, realAttractPoint, realAttractPoint == this.positionLeft)
  }
}

