import exifr from 'exifr'
import fs from 'fs'
import path from 'path'

// Nome del file per il salvataggio dei dati
const OUTPUT = "data_exif.json"

// Percorso delle cartella delle immagini (relativo a questo script)
// const PATH = "../img_orig"
const PATH = "/Users/andreas/Desktop/img_512_sel"

// È possibile selezionare solo i campi desiderati:
// const FILTRO = ['ISO', 'Orientation', 'LensModel']
// ...oppure inserirli tutti:
const FILTRO = undefined

// Files da ignorare:
const FILES_DA_IGNORARE = ['.DS_Store', '.AppleDouble', '.LSOverride']

// Elenco di tutti i files nella cartella PATH
const files = fs.readdirSync(PATH).filter( e => FILES_DA_IGNORARE.indexOf(e) == -1)

// immagine singola
exifr.parse(path.join(PATH,files[10])).then(output => {
	console.log(output)
})

const data = []

// Inizio cronometro...
const t0 = (new Date()).getTime()

for (const file of files) {
	await exifr.parse(path.join(PATH, file), FILTRO).then(output => {
		console.log("File: " + file)

		data.push({
			ImageWidth : output.ExifImageWidth,
			ImageHeight : output.ExifImageHeight,
			FileExtension : path.extname(file),
			FileName : path.parse(file).name,
			EXIF : output
		})
	}).catch( error => console.log("Errore: " + file))
}

// ...fine cronometro
const t1 = (new Date()).getTime()

console.log()
console.log("Tempo impiegato: " + (t1 - t0) + "ms")
console.log("Numero di immagini analizzate: " + data.length)
console.log("Scrivo dati nel file: " + OUTPUT + "...")
fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 4), 'utf8')
console.log("Fatto!")
console.log(":)")
