import fs from 'fs'
import path from 'path'
import { scanFolder, getImagePath, loadSharpImage, cropAndSaveSharpImage } from './common.js'

const OUTPUT_SIZE    = 256
const IMG_PATH       = getImagePath()    // percorso delle cartella delle immagini (relativo a questo script)
const CROP_PATH      = path.join(IMG_PATH, "..", "img_" + OUTPUT_SIZE)
const JSON_PATH      = path.join(IMG_PATH, "..", "data_images.json") // Nome del file per il salvataggio dei dati

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
		sharp_img.image.resize(OUTPUT_SIZE).rotate().toFile(output_path)

		const { info } = await sharp_img.image.toBuffer({ resolveWithObject: true })

		data.push({
			FileName,
			FileExtension,
			ImageWidth  : info.width,
			ImageHeight : info.height,
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

function getTensor(buffer) {
	const tensor = tidy(() => {
		const decode = TF.node.decodeImage(buffer, 3)
		let expand
		if (decode.shape[2] === 4) {                 // input is in rgba format, need to convert to rgb
			const channels = TF.split(decode, 4, 2)  // tf.split(tensor, 4, 2)  // split rgba to channels
			const rgb = TF.stack([channels[0], channels[1], channels[2]], 2)    // stack channels back to rgb and ignore alpha
			expand = TF.reshape(rgb, [1, decode.shape[0], decode.shape[1], 3])  // move extra dim from the end of tensor and use it as batch number instead
		} else {
			expand = TF.expandDims(decode, 0)
		}
		const cast = TF.cast(expand, 'float32')
		return cast
	})
	return tensor
}

function getFormattedData(face) {
	const expressions = Object.entries(face.expressions).reduce((acc, val) => ((val[1] > acc[1]) ? val : acc), ['', 0])
	return {
		box : {
			left   : Math.floor(face.alignedRect._box._x),
			top    : Math.floor(face.alignedRect._box._y),
			width  : Math.floor(face.alignedRect._box._width),
			height : Math.floor(face.alignedRect._box._height),
		},
		confidence : Math.round(face.detection._score * 1000) / 10,
		gender : face.gender,
		genderConfidence : Math.round(face.genderProbability * 1000) / 10,
		age : Math.round(10 * face.age) / 10,
		expression : expressions[0],
		expressionConfidence : Math.round(expressions[1] * 1000) / 10,
	}
}

async function detect(tensor, opts) {
	try {
		const result = await detectAllFaces(tensor, opts)
			.withFaceLandmarks()
			.withFaceExpressions()
			.withFaceDescriptors()
			.withAgeAndGender()
		return result
	} catch (err) {
		console.log('Caught error', err.message)
		return []
	}
}

// function detectPromise(tensor, opts) {
// 	return new Promise((resolve) => detectAllFaces(tensor, opts)
// 		// .withFaceLandmarks()
// 		.withFaceExpressions()
// 		.withFaceDescriptors()
// 		.withAgeAndGender()
// 		.then((res) => resolve(res))
// 		.catch((err) => {
// 			console.log('Caught error', err.message)
// 			resolve([])
// 		}))
// }
