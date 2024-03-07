
let x, y


function setup() {
	createCanvas(windowWidth, windowHeight)
	x = width/2
	y = height/2
	background(200)
}

function draw() {

	fill(random(255), random(255), random(255))

	circle(x, y, 50)
	x = x + random(-3, 3)
	y = y + random(-3, 3)

}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}