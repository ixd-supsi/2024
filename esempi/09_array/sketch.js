const sequenza = []

function preload(){
	for (let i=0; i<100; i++) {
		sequenza.push(loadImage("./frames_small/" + (i * 18 + "").padStart(4, "0") + ".jpg"))
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight)
}

function draw() {
	background(200)
	for (let i=0; i<sequenza.length; i++) {
		image(sequenza[i], i * mouseX * 0.1, i * mouseY * 0.1, 320, 180)
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}
