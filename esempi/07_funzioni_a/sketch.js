

function setup() {
	createCanvas(windowWidth, windowHeight)
}

function draw() {

	background(200)

	let cx = height/2
	let cy = width/2
	let raggio = 100
	let lati = mouseX

	for(let i=0; i<lati; i++) {
		let a = TAU / lati * i
		let vx = cos(a) * raggio + cx
		let vy = sin(a) * raggio + cy
		ellipse(vx, vy, 10, 10)
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}