import { tidy } from '@tensorflow/tfjs-node' // in nodejs environments tfjs-node is required to be loaded before face-api
import { tf as TF, detectAllFaces, version, nets, SsdMobilenetv1Options } from '@vladmandic/face-api' // use this when face-api is installed as module (majority of use cases)
import fs from 'fs'
import path from 'path'

const MIN_CONFIDENCE_THRESHOLD = 0.15
const MAX_RESULTS = 50

// Nome del file per il salvataggio dei dati
const OUTPUT = "data_faces.json"

// Percorso delle cartella delle immagini (relativo a questo script)
// const IMG_PATH = "../img_orig/"
const IMG_PATH = "/Users/andreas/Desktop/img_512_sel/"

// Files da ignorare:
const FILES_DA_IGNORARE = ['.DS_Store', '.AppleDouble', '.LSOverride']

// Elenco di tutti i files nella cartella PATH
const files = fs.readdirSync(IMG_PATH).filter( e => FILES_DA_IGNORARE.indexOf(e) == -1)

const MODEL_PATH = './model/'

run(files, IMG_PATH, MODEL_PATH)

async function run(files, img_path, model_path) {

	await TF.setBackend('tensorflow')
	await TF.ready()

	console.log(`Version: TensorFlow/JS ${TF?.version_core} FaceAPI ${version} Backend: ${TF?.getBackend()}`)
	console.log('Loading FaceAPI models')

	await nets.ssdMobilenetv1.loadFromDisk(model_path)
	await nets.ageGenderNet.loadFromDisk(model_path)
	await nets.faceLandmark68Net.loadFromDisk(model_path)
	await nets.faceRecognitionNet.loadFromDisk(model_path)
	await nets.faceExpressionNet.loadFromDisk(model_path)
	const optionsSSDMobileNet = new SsdMobilenetv1Options({ MIN_CONFIDENCE_THRESHOLD, MAX_RESULTS })

	const data = []
	let num_volti_trovati = 0

	// Inizio cronometro...
	const t0 = (new Date()).getTime()

	for (const file of files) {
		// if (!img.toLocaleLowerCase().endsWith('.jpg')) continue
		const tensor = await image(path.join(img_path, file))
		const result = await detect(tensor, optionsSSDMobileNet)
		const Faces = result.map(getFormattedData)

		console.log(tensor.shape)

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
			ImageWidth : tensor.shape[2],
			ImageHeight : tensor.shape[1],
			FileExtension : path.extname(file),
			FileName : path.parse(file).name,
			Faces
		})
		num_volti_trovati += result.length

		tensor.dispose()
	}

	// ...fine cronometro
	const t1 = (new Date()).getTime()

	console.log()
	console.log("Tempo impiegato: " + (t1 - t0) + "ms")
	console.log("Numero di immagini analizzate: " + data.length)
	console.log("Numero di volti identificati: " + num_volti_trovati)
	console.log("Scrivo dati nel file: " + OUTPUT + "...")
	fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 4), 'utf8')
	console.log("Fatto!")
	console.log(":)")

}

async function image(input) {
	console.log('Loading image:', input)
	const buffer = fs.readFileSync(input)

	if (!buffer) return {}
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
			x1 : Math.floor(face.alignedRect._box._x),
			y1 : Math.floor(face.alignedRect._box._y),
			x2 : Math.floor(face.alignedRect._box._x + face.alignedRect._box._width),
			y2 : Math.floor(face.alignedRect._box._y + face.alignedRect._box._height),
			w  : Math.floor(face.alignedRect._box._width),
			h  : Math.floor(face.alignedRect._box._height),
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
