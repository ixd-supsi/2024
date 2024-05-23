import exifr from 'exifr'
import fs from 'fs'
import path from 'path'

// Nome del file per il salvataggio dei dati
const OUTPUT = "data_exif.json"

// Percorso delle cartella delle immagini (relativo a questo script)
const PATH = "../img_orig/"

// È possibile selezionare solo i campi desiderati:
// const FILTRO = ['ISO', 'Orientation', 'LensModel']
// ...oppure inserirli tutti:
const FILTRO = undefined

// Files da ignorare:
const FILES_DA_IGNORARE = ['.DS_Store', '.AppleDouble', '.LSOverride']

// Elenco di tutti i files nella cartella PATH
const files = fs.readdirSync(PATH).filter( e => FILES_DA_IGNORARE.indexOf(e) == -1)

// immagine singola
exifr.parse(PATH + files[10]).then(output => {
	console.log(output)
})

const data = []

for (const file of files) {
	await exifr.parse(PATH + file, FILTRO).then(output => {
		console.log("Carico: " + file)
		output.FileExtension = path.extname(file)
		output.FileName = path.parse(file).name
		// const d = new Date(output.CreateDate)
		// console.log(d.getHours())
		data.push(output)
	}).catch( error => console.log("Errore: " + file))
}
console.log()
console.log("Numero di immagini analizzati: " + data.length)
console.log("Scrivo dati EXIF nel file: " + OUTPUT + "...")
fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 4), 'utf8')
console.log("Fatto!")
console.log(":)")
