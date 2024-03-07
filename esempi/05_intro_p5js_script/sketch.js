function setup() {
	createCanvas(300, 200)
}

function draw() {
	background(200)

	stroke(255, 102, 0)
	line(10, 20, 150, 50)
	point(50, 100)

	fill(255, 0, 0)
	rect(50, 30, 70, 70)

	fill(0, 255, 0, 128)
	rect(70, 50, 70, 70)


	stroke(0)
	fill(255)

	noFill()
	beginShape()
	vertex(90, 70)
	vertex(90, 150)
	vertex(150, 190)
	vertex(250, 30)
	endShape(CLOSE)
}
