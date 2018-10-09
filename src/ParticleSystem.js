export default class ParticleSystem {
  constructor() {
    this._particleArray = []
    this._attractorArray = []
  }

  addParticle(particle) {
    this._particleArray.push(particle)
  }

  addAttractor(attractor) {
    this._attractorArray.push(attractor)
  }

  updateParticle() {
    this._particleArray.forEach(particle => {
      this._attractorArray.forEach(attractor => {
        particle.applyForce(attractor.geometry.attract(particle.geometry))
      })
      particle.display()
    })
  }

  update() {
    this.updateParticle()
    this._attractorArray.forEach(item => item.display())
  }
}
