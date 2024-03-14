let immagini = []

function setup() {
	createCanvas(windowWidth, windowHeight)
	for(let i=0; i<300; i++) {
		immagini[i] = loadImage("./frames_small/" + (i*6+"").padStart(4, "0") + ".jpg")
	}
}

function draw() {
	background(200)
	let frame = mouseX
	if(frame >= immagini.length) frame = immagini.length - 1
	for(let i=0; i<frame; i++) {
		image(immagini[i], i*2, i*1)
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}