

function setup() {
	createCanvas(windowWidth, windowHeight)
}

function draw() {

	background(200)

	noFill()

	for (let i=0; i<10; i++) {
		poligono(width/2, height/2, mouseX + i * mouseY, i + 3)
	}




}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}


function poligono(cx, cy, raggio, lati) {
	beginShape()
	for(let i=0; i<lati; i++) {
		let a = TAU / lati * i
		let vx = cos(a) * raggio + cx
		let vy = sin(a) * raggio + cy
		vertex(vx, vy)
	}
	endShape(CLOSE)
}