function setup() {
	createCanvas(windowWidth, windowHeight)
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight)
}

function draw() {
	background(255, 210, 210)
	const raggio = 60
	const lati = floor(mouseX / 100) + 3

	noFill()
	for (let i=0; i<60; i++) {
		const rot = sin(i * 0.04 - frameCount * 0.01)
		poligono(width/2, height/2, raggio + i * 10, lati, rot)
	}
}

function poligono(cx, cy, raggio, lati, rotazione){
	// ellipse( cos(TAU / 5 * 0) * raggio, sin(TAU / 5 * 0) * raggio, 10, 10)
	// ellipse( cos(TAU / 5 * 1) * raggio, sin(TAU / 5 * 1) * raggio, 10, 10)
	// ellipse( cos(TAU / 5 * 2) * raggio, sin(TAU / 5 * 2) * raggio, 10, 10)
	// ellipse( cos(TAU / 5 * 3) * raggio, sin(TAU / 5 * 3) * raggio, 10, 10)
	// ellipse( cos(TAU / 5 * 4) * raggio, sin(TAU / 5 * 4) * raggio, 10, 10)

	beginShape()
	for (let i=0; i<lati; i++) {
		const x = cos(TAU / lati * i + rotazione) * raggio + cx
		const y = sin(TAU / lati * i + rotazione) * raggio + cy
		vertex(x, y)
	}
	endShape(CLOSE)
}
