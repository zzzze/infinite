import Attractor from 'Attractor'

export default class VortexAttractor extends Attractor {
  constructor(options) {
    super(options)
    this.clockwise = options.clockwise || false
    this.threshold = options.threshold || 200
    this.thresholdCached = {}
  }

  _attract(particle, position, clockwise) {
    let threshold = this.thresholdCached[particle.id] || this.threshold
    threshold = threshold + (Math.random() - 0.5)
    threshold = Math.max(Math.min(threshold, this.threshold + 20), this.threshold - 20)
    this.thresholdCached[particle.id] = threshold
    var force = p5.Vector.sub(position, particle.geometry.position)
    var ff = force.copy()
    if(clockwise){
      ff.rotate(-Math.PI / 2)
    }else{
      ff.rotate(Math.PI / 2)
    }
    force.setMag(force.mag() - threshold)
    ff.setMag(threshold)
    force.add(ff)
    return force
  }

  attract(particle){
    return this._attract(particle, this.position, this.clockwise)
  }
}

