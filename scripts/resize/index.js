import fs from 'fs'
import path from 'path'
import { scanFolder, getImagePath, loadSharpImage, cropAndSaveSharpImage } from './common.js'

const OUTPUT_SIZE  = 1024
const IMG_PATH     = getImagePath()
const CROP_PATH    = path.join(IMG_PATH, "..", "img_" + OUTPUT_SIZE)
const JSON_PATH    = path.join(IMG_PATH, "..", "data_images.json") // Nome del file per il salvataggio dei dati

run()

async function run() {

	if (!fs.existsSync(CROP_PATH)) fs.mkdirSync(CROP_PATH)

	const files = scanFolder(IMG_PATH)

	const data = []

	// Inizio cronometro...
	const t0 = (new Date()).getTime()

	for (const file of files) {

		const FileName      = path.parse(file).name
		const FileExtension = ".jpg"
		const sharp_img     = await loadSharpImage(path.join(IMG_PATH, file))

		// print
		console.log('Ridimensiono file: ' + file)

		const output_path = path.join(CROP_PATH, FileName + FileExtension)
		sharp_img.image.resize(OUTPUT_SIZE, OUTPUT_SIZE, {fit: 'inside'}).rotate().toFile(output_path)

		const { info } = await sharp_img.image.toBuffer({ resolveWithObject: true })

		data.push({
			FileName,
			FileExtension,
			// ImageWidth  : info.width,
			// ImageHeight : info.height,
		})
	}

	// ...fine cronometro
	const t1 = (new Date()).getTime()

	console.log()
	console.log("Tempo impiegato: " + (t1 - t0) + "ms")
	console.log("Numero di immagini ridimensionate: " + data.length)
	console.log("Scrivo dati nel file: " + JSON_PATH + "...")
	fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 4), 'utf8')
	console.log("Fatto!")
	console.log(":)")
}
