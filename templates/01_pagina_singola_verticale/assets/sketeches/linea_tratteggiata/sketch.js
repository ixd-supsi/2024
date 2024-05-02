
function setup() {
	createCanvas(windowWidth, windowHeight)
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight)
}
function draw() {

	const A = new Vec2(50, 70)
	const B = new Vec2(mouseX, mouseY)
	const C = B.sottrai(A)
	const lunghezza = 15
	const num = Math.floor(C.modulo() / lunghezza)

	background(255, 210, 210)

	noFill()
	stroke(0)
	circle(A.x, A.y, 22, 22)
	circle(B.x, B.y, 22, 22)

	noStroke()
	fill(0)
	for (let i=0; i<num+1; i++) {
		const p = C.moltiplica(i / num).somma(A)
		circle(p.x, p.y, i % 2 * 7 + 10)
	}
}
