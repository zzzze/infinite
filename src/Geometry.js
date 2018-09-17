class Geometry {
  constructor(options) {
    this.position = options.position.copy()
    this.width = options.width
    this.height = options.height
    this.ctx = options.ctx 
    this.fillCol = options.fillCol || 'rgba(200, 200, 200, 1)'
    this.lockPosition = false
  }

  draw() {
    this.ctx.save()
    this.ctx.translate(this.position.x, this.position.y)
    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.width / 2, 0, 2 * Math.PI)
    this.ctx.fillStyle = 'rgba(200, 200, 200, .5)'
    this.ctx.fill()
    this.ctx.restore()
  }
}

export default Geometry

