let immagini = []

function setup() {
	createCanvas(windowWidth, windowHeight)
	const intervallo = 8
	for(let i=0; i<1800/intervallo; i++) {
		immagini[i] = loadImage("./frames_small/" + (i*intervallo+"").padStart(4, "0") + ".jpg")
	}
}

function draw() {
	background(200)
	const colonne = 18
	const spazio = 0
	for(let i=0; i<immagini.length; i++) {
		const x = (i % colonne) * (32 + spazio)
		const y = Math.floor(i / colonne) * (18 + spazio)
		image(immagini[i], x, y, 32, 18)
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}