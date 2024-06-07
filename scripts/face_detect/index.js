import { tidy } from '@tensorflow/tfjs-node' // in nodejs environments tfjs-node is required to be loaded before face-api
import { tf as TF, detectAllFaces, version, nets, SsdMobilenetv1Options } from '@vladmandic/face-api' // use this when face-api is installed as module (majority of use cases)
import fs from 'fs'
import path from 'path'
import { scanFolder, getImagePath, loadSharpImage, cropAndSaveSharpImage } from './common.js'

const IMG_PATH       = getImagePath()    // percorso delle cartella delle immagini (relativo a questo script)
const CROP_PATH      = path.join(IMG_PATH, "..", "face_crop")
const JSON_PATH      = path.join(IMG_PATH, "..", "data_face.json") // Nome del file per il salvataggio dei dati
const SALVA_CROP     = true              // salvare le immagini croppate?
const CROP_SIZE      = null              // ridimensiona crop (lasciare “null” per dimensione originale)

const MIN_CONFIDENCE_THRESHOLD = 0.15
const MAX_RESULTS    = 50

run()

async function run() {

	const MODEL_PATH = './model/'
	if (SALVA_CROP && !fs.existsSync(CROP_PATH)) fs.mkdirSync(CROP_PATH)

	const files = scanFolder(IMG_PATH)

	await TF.setBackend('tensorflow')
	await TF.ready()

	console.log(`Version: TensorFlow/JS ${TF?.version_core} FaceAPI ${version} Backend: ${TF?.getBackend()}`)
	console.log('Loading FaceAPI models')

	await nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH)
	await nets.ageGenderNet.loadFromDisk(MODEL_PATH)
	await nets.faceLandmark68Net.loadFromDisk(MODEL_PATH)
	await nets.faceRecognitionNet.loadFromDisk(MODEL_PATH)
	await nets.faceExpressionNet.loadFromDisk(MODEL_PATH)
	const optionsSSDMobileNet = new SsdMobilenetv1Options({ MIN_CONFIDENCE_THRESHOLD, MAX_RESULTS })

	const data = []
	let num_volti_trovati = 0

	// Inizio cronometro...
	const t0 = (new Date()).getTime()

	for (const file of files) {

		const FileName      = path.parse(file).name
		const FileExtension = path.extname(file)
		const sharp_img     = await loadSharpImage(path.join(IMG_PATH, file))

		const img_buf       = await sharp_img.image.toBuffer()
		const tensor        = getTensor(img_buf)
		const result        = await detect(tensor, optionsSSDMobileNet)
		const Faces         = result.map( f => getFormattedData(f, sharp_img.width, sharp_img.height))

		// print
		console.log('File: ' + file + ', numero di volti: '+ result.length)
		for (const face of Faces) {
			let str = ""
			str += "Confidenza " + face.confidence + "%, "
			str += "Età: " + face.age + ", "
			str += "Sesso: " + face.gender + " " + face.genderConfidence + "%, ",
			str += "Espressione: " + face.expression + " " + face.expressionConfidence + "%"
			console.log(str)
		}

		data.push({
			FileName,
			FileExtension,
			// ImageWidth  : sharp_img.md.width,
			// ImageHeight : sharp_img.md.height,
			Faces
		})

		if (SALVA_CROP) {
			let idx = 0
			for (const o of Faces) {
				const output_path = path.join(CROP_PATH, FileName + "_" + idx++ + ".jpg")
				cropAndSaveSharpImage(sharp_img.image, o.box, output_path, CROP_SIZE)
			}
		}

		num_volti_trovati += result.length

		tensor.dispose()
	}

	// ...fine cronometro
	const t1 = (new Date()).getTime()

	console.log()
	console.log("Tempo impiegato: " + (t1 - t0) + "ms")
	console.log("Numero di immagini analizzate: " + data.length)
	console.log("Numero di volti identificati: " + num_volti_trovati)
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

function getFormattedData(face, image_width, image_height) {
	const expressions = Object.entries(face.expressions).reduce((acc, val) => ((val[1] > acc[1]) ? val : acc), ['', 0])

	const box =  {
		left   : Math.max(0, Math.floor(face.alignedRect._box._x)), // correzione arrotondamenti
		top    : Math.max(0, Math.floor(face.alignedRect._box._y)), //
		width  : Math.floor(face.alignedRect._box._width),
		height : Math.floor(face.alignedRect._box._height),
	}

	// Fix per arrotondamenti misure (~ +/- 3px oltre i bordo)
	const dx = (box.left + box.width) - image_width
	if (dx > 0) box.width -= dx

	const dy =  (box.top + box.height) - image_height
	if (dy > 0) box.height -= dy

	return {
		box,
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
