import getColors  from 'get-image-colors'
import fs from 'fs'
import path from 'path'
import { scanFolder, getImagePath } from './common.js'

const IMG_PATH   = getImagePath() // percorso delle cartella delle immagini (relativo a questo script)
const JSON_PATH  = path.join(IMG_PATH, "..", "data_colors.json") // Nome del file per il salvataggio dei dati
const NUM_COLORS = 1 // numero di colori da estrarre

run()

async function run() {

	const files = scanFolder(IMG_PATH)

	const data = []

	// Inizio cronometro...
	const t0 = (new Date()).getTime()

	for (const file of files) {

		let Colors = []
		await getColors(path.join(IMG_PATH, file), {
			count: NUM_COLORS
		}).then(colors => {
			Colors = colors.map(color => color.hex())
		})

		// print
		console.log('File: ' + file, Colors)

		data.push({
			FileName      : path.parse(file).name,
			FileExtension : ".jpg",
			Colors
		})
	}

	// ...fine cronometro
	const t1 = (new Date()).getTime()

	console.log()
	console.log("Tempo impiegato: " + (t1 - t0) + "ms")
	console.log("Numero di immagini analizzate: " + data.length)
	console.log("Scrivo dati nel file: " + JSON_PATH + "...")
	fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 4), 'utf8')
	console.log("Fatto!")
	console.log(":)")

}

