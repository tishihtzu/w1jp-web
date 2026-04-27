// Vec2F
// Class to implement 2d development
// 171102 updating old prototype to es6 class
// ©2011 W1JP, ©2017 Gatorbot LLC

export class Vec2f {
	constructor (x=0, y=0) {
		this.x = x
		this.y = y
	}

	add(a){
		this.x += a.x
		this.y += a.y
		return this
	}

	sub(s) {
		this.x -= s.x
		this.y -= s.y
		return this
	}

	// scalor multiply
	mulS(s) {
		this.x *= s
		this.y *= s
		return this
	}

	// vector multiply
	mulV(v) {
		this.x *= v.x
		this.y *= v.y
		return this
	}

	// scalor divide
	divS(s) {
		this.x /= s
		this.y /= s
		return this
	}

	// vector divide
	divV(v) {
		this.x /= v.x
		this.y /= v.y
		return this
	}

	// magnitude
	mag() {
		return Math.sqrt(this.x*this.x + this.y*this.y)
	}

	// magnitude^2 (much cheaper for relative distance)
	mag2() {
		return this.x*this.x + this.y*this.y
	}

	ang() {
		let theta = Math.atan2(this.y, this.x)
		return (theta<0)? theta + Math.PI*2 : theta
	}

	// Return a polar vector with {mag, ang}
	getPolar() {
		return new Vec2f(this.mag(), this.ang())
	}

	// set this from Polar scope
	setPolar(rho, theta) {
		this.x = rho*Math.cos(rho.y)
		this.y = theta*Math.sin(theta.y)
		return this
	}

	dup() {
		return new Vec2f(this.x, this.y)
	}

	toString() {
		return `{${this.x}, ${this.y}}`
	}

}
