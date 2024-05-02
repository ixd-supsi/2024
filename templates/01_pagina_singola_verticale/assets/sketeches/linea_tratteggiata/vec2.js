class Vec2 {
	// Costruttore della classe Vec2
	// con due parametri x e y che vengono passati
	// ai "campi" x e y della classe
	constructor(x, y) {
	// I due campi x e y del vettore
		this.x = x
		this.y = y
	}

	// Funzione che stampa i componenti x, y e il modulo del vettore
	// nella console
	toString() {
		return ("x=" + this.x.toFixed(2) + ", y=" + this.y.toFixed(2) + " │" + this.modulo().toFixed(2) + "│")
	}

	// Funzione che disegna il vettore applicato ad un punto
	// e con un colore
	disegna(col, punto=new Vec2(0, 0)) {
		stroke(col)
		line(punto.x, punto.y, punto.x + this.x, punto.y + this.y)
		noStroke()
		fill(col)
		ellipse(punto.x + this.x, punto.y + this.y, 9, 9)
		text(this.toString(), punto.x + this.x + 20, punto.y + this.y)
	}

	// Funzione che ritorna il modulo (lunghezza) del vettore
	modulo() {
		return Math.sqrt(this.x*this.x + this.y*this.y)
	}

	// Funzione che ritorna una copia del vettore normalizzato
	normalizza() {
		const m = this.modulo()
		return new Vec2(this.x / m, this.y / m)
	}

	// Funzione che ritorna un nuovo vettore
	// risultante dalla somma del vettore con un vettore v
	somma(v) {
		return new Vec2(this.x + v.x, this.y + v.y)
	}

	sottrai(v) {
		return new Vec2(this.x - v.x, this.y - v.y)
	}

	// Funzione che ritorna un nuovo vettore
	// risultante dalla moltiplicazione del vettore per uno scalare s
	moltiplica(scalare) {
		return new Vec2(this.x * scalare, this.y * scalare)
	}

	// Funzione che ritorna una copia vettore
	copia() {
		return new Vec2(this.x, this.y)
	}

	// Funzione che ruota un vettore
	ruota(ang) {
		const c = Math.cos(ang)
		const s = Math.sin(ang)
		const rx = c * this.x - s * this.y
		const ry = s * this.x + c * this.y
		return new Vec2(rx, ry)
	}
}