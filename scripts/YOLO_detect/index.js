// TODO: caricare il modell dinamicamente
// https://huggingface.co/amd/yolov8m/resolve/main/yolov8m.onnx

import OnnxRuntime from 'onnxruntime-node'
import fs from 'fs'
import path from 'path'
import { scanFolder, getImagePath, loadSharpImage, cropAndSaveSharpImage } from './common.js'

const IMG_PATH       = getImagePath()    // percorso delle cartella delle immagini (relativo a questo script)
const CROP_PATH      = path.join(IMG_PATH, "..", "yolo_crop")
const JSON_PATH      = path.join(IMG_PATH, "..", "data_yolo.json") // Nome del file per il salvataggio dei dati
const SALVA_CROP     = true              // salvare le immagini croppate?
const CROP_SIZE      = 256               // ridimensiona crop (lasciare “null” per dimensione originale)

const PROB_THRESHOLD = 0.5               // thresold per detect di un oggetto
const YOLO_IMAGE_W   = 640               // non cambiare (per ora)
const YOLO_IMAGE_H   = 640               // non cambiare (per ora)

run()

async function run() {

	const SESSION_OPTS = { executionProviders: ['cpu'] }
	const MODEL = await OnnxRuntime.InferenceSession.create("model/yolov8m.onnx", SESSION_OPTS)
	if (SALVA_CROP && !fs.existsSync(CROP_PATH)) fs.mkdirSync(CROP_PATH)
	const files = scanFolder(IMG_PATH)
	const data = []
	let num_oggetti_trovati = 0

	// Inizio cronometro...
	const t0 = (new Date()).getTime()

	for (const file of files) {

		const FileName       = path.parse(file).name
		const FileExtension  = path.extname(file)

		const sharp_img      = await loadSharpImage(path.join(IMG_PATH, file))

		const input          = await prepare_input(sharp_img.image)
		const output         = await run_model(MODEL, input)
		const Objects        = process_output(output, sharp_img.width, sharp_img.height)

		console.log("File: " + file + " " + Objects.map( o => o.label).join(', '))

		data.push({
			FileName,
			FileExtension,
			Objects
		})

		if (SALVA_CROP) {
			let idx = 0
			for (const o of Objects) {
				const output_path = path.join(CROP_PATH, FileName + "_" + idx++ + ".jpg")
				cropAndSaveSharpImage(sharp_img.image, o.box, output_path, CROP_SIZE)
			}
		}

		num_oggetti_trovati += Objects.length
	}

	// ...fine cronometro
	const t1 = (new Date()).getTime()

	console.log()
	console.log("Tempo impiegato: " + (t1 - t0) + "ms")
	console.log("Numero di immagini analizzate: " + data.length)
	console.log("Numero di oggetti identificati: " + num_oggetti_trovati)
	console.log("Scrivo dati nel file: " + JSON_PATH + "...")
	fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 4), "utf8")
	console.log("Fatto!")
	console.log(":)")
}

async function prepare_input(sharp_img) {
	const pixels = await sharp_img.clone().removeAlpha()
		.resize({width:YOLO_IMAGE_W, height:YOLO_IMAGE_H, fit:'fill'})
		.raw()
		.toBuffer()
	const r = []
	const g = []
	const b = []
	for (let i=0; i<pixels.length; i+=3) {
		r.push( pixels[i  ]/255.0 )
		g.push( pixels[i+1]/255.0 )
		b.push( pixels[i+2]/255.0 )
	}
	return [...r, ...g, ...b]
}

async function run_model(model, input) {
	const t = new OnnxRuntime.Tensor(Float32Array.from(input),[1, 3, YOLO_IMAGE_W, YOLO_IMAGE_H])
	const outputs = await model.run({images:t})
	return outputs
}

function process_output(output, img_width, img_height) {
	let boxes = []

	const data = output.output0.data
	const dim = output.output0.dims[2]

	for (let index=0; index<dim; index++) {
		const [class_id, prob] = [...Array(YOLO_CLASSES.length).keys()]
			.map(col => [col, data[dim * (col + 4) + index]])
			.reduce((accum, item) => item[1]>accum[1] ? item : accum, [0,0]);
		if (prob < PROB_THRESHOLD) continue

		const label = YOLO_CLASSES[class_id]
		const xc = data[index]
		const yc = data[    dim + index]
		const w  = data[2 * dim + index]
		const h  = data[3 * dim + index]
		const x1 = Math.max(0, Math.floor((xc-w/2)/YOLO_IMAGE_W*img_width))
		const y1 = Math.max(0, Math.floor((yc-h/2)/YOLO_IMAGE_H*img_height))
		const x2 = Math.min(img_width - 1, Math.floor((xc+w/2)/YOLO_IMAGE_W*img_width))
		const y2 = Math.min(img_height - 1, Math.floor((yc+h/2)/YOLO_IMAGE_H*img_height))


		const box = {
			left   : x1,
			top    : y1,
			width  : x2 - x1,
			height : y2 - y1,
		}

		boxes.push({
			box,
			label,
			prob : Math.round(prob * 1000) / 10
		})
	}

	boxes = boxes.sort((box1, box2) => box2.prob - box1.prob)
	const result = []
	while (boxes.length > 0) {
		result.push(boxes[0])
		boxes = boxes.filter(box => iou(boxes[0].box, box.box) < 0.7) // Threshold
	}
	return result
}

/**
 * Function calculates "Intersection-over-union" coefficient for specified two boxes
 * https://pyimagesearch.com/2016/11/07/intersection-over-union-iou-for-object-detection/.
 * @returns Intersection over union ratio as a float number
 */
function iou(box1, box2) {
	return intersection(box1, box2) / union(box1, box2)
}

/**
 * Function calculates union area of two boxes.
 * @returns Area of the boxes union as a float number
 */
function union(box1, box2) {
	const box1_area = box1.width * box1.height
	const box2_area = box2.width * box2.height
	return box1_area + box2_area - intersection(box1, box2)
}

/**
 * Function calculates intersection area of two boxes
 * @returns Area of intersection of the boxes as a float number
 */
function intersection(box1,box2) {
	const x1 = Math.max(box1.left, box2.left)
	const y1 = Math.max(box1.top, box2.top)
	const x2 = Math.min(box1.left + box1.width, box2.left + box2.width)
	const y2 = Math.min(box1.top + box1.height, box2.top + box2.height)
	return (x2-x1) * (y2-y1)
}

const YOLO_CLASSES = [
	'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat',
	'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat',
	'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack',
	'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball',
	'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket',
	'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
	'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair',
	'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse',
	'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator',
	'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
]
