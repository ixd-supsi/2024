

// https://huggingface.co/amd/yolov8m/resolve/main/yolov8m.onnx

import OnnxRuntime from "onnxruntime-node"
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const PROB_THRESHOLD = 0.5 // thresold per detect di un oggetto
const IMAGE_W = 640        // non cambiare per ora
const IMAGE_H = 640        // non cambiare per ora

// Nome del file per il salvataggio dei dati
const OUTPUT = "data_yolo.json"

// Percorso delle cartella delle immagini (relativo a questo script)
const PATH = "../img_orig/


// Files da ignorare:
const FILES_DA_IGNORARE = ['.DS_Store', '.AppleDouble', '.LSOverride']

// Elenco di tutti i files nella cartella PATH
const files = fs.readdirSync(PATH).filter( e => FILES_DA_IGNORARE.indexOf(e) == -1);

// Boot...
run(files, PATH)

async function run(files, dir) {
	const SESSION_OPTS = { executionProviders: ['cpu'] }
	const MODEL = await OnnxRuntime.InferenceSession.create("yolov8m.onnx", SESSION_OPTS)

	const data = []
	let num_oggetti_trovati = 0

	for (const file of files) {
		const detected_objs = await detect_objects_on_image(MODEL, dir + file)
		const objs = detected_objs.map( o => o.label).join(', ')
		console.log("File: " + file + " " + objs)
		data.push({
			FileExtension : path.extname(file),
			FileName : path.parse(file).name,
			Objects : detected_objs
		})
		num_oggetti_trovati += detected_objs.length
	}

	console.log()
	console.log("Numero di immagini analizzate: " + data.length)
	console.log("Numero di oggetti identificati: " + num_oggetti_trovati)
	console.log("Scrivo dati YOLO nel file: " + OUTPUT + "...")
	fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 4), 'utf8')
	console.log("Fatto!")
	console.log(":)")
}

async function detect_objects_on_image(model, buf) {
	const [input, img_width, img_height] = await prepare_input(buf);
	const output = await run_model(model, input);
	return process_output(output, img_width, img_height);
}

/**
 * Function used to convert input image to tensor,
 * required as an input to YOLOv8 object detection
 * network.
 * @param buf Content of uploaded file
 * @returns Array of pixels
 */

async function prepare_input(buf) {
	const img = sharp(buf)
	const md = await img.metadata()
	const [img_width, img_height] = [md.width, md.height]
	const pixels = await img.removeAlpha()
		.resize({width:IMAGE_W, height:IMAGE_H, fit:'fill'})
		.raw()
		.toBuffer()
	const red = [], green = [], blue = []
	for (let index=0; index<pixels.length; index+=3) {
		red.push(pixels[index]/255.0);
		green.push(pixels[index+1]/255.0);
		blue.push(pixels[index+2]/255.0);
	}
	const input = [...red, ...green, ...blue];
	return [input, img_width, img_height];
}

/**
 * Function used to pass provided input tensor to YOLOv8 neural network and return result
 * @param input Input pixels array
 * @returns Raw output of neural network as a flat array of numbers
 */

async function run_model(model, input) {
	const t = new OnnxRuntime.Tensor(Float32Array.from(input),[1, 3, IMAGE_W, IMAGE_H])
	const outputs = await model.run({images:t})
	return outputs
}

/**
 * Function used to convert RAW output from YOLOv8 to an array of detected objects.
 * Each object contain the bounding box of this object, the type of object and the probability
 * @param output Raw output of YOLOv8 network
 * @param img_width Width of original image
 * @param img_height Height of original image
 * @returns Array of detected objects
 */
function process_output(output, img_width, img_height) {
	let boxes = [];

	const data = output.output0.data
	const dim = output.output0.dims[2]

	for (let index=0; index<dim; index++) {
		const [class_id, prob] = [...Array(YOLO_CLASSES.length).keys()]
			.map(col => [col, data[dim * (col + 4) + index]])
			.reduce((accum, item) => item[1]>accum[1] ? item : accum, [0,0]);
		if (prob < PROB_THRESHOLD) continue

		const label = YOLO_CLASSES[class_id]
		const xc = data[index]
		const yc = data[  dim+index]
		const w  = data[2*dim+index]
		const h  = data[3*dim+index]
		const x1 = Math.floor((xc-w/2)/IMAGE_W*img_width)
		const y1 = Math.floor((yc-h/2)/IMAGE_H*img_height)
		const x2 = Math.floor((xc+w/2)/IMAGE_W*img_width)
		const y2 = Math.floor((yc+h/2)/IMAGE_H*img_height)
		boxes.push({x1, y1, x2, y2, w:x2-x1, h: y2-y1, label, prob})
	}

	boxes = boxes.sort((box1, box2) => box2.prob - box1.prob)
	const result = []
	while (boxes.length>0) {
		result.push(boxes[0]);
		boxes = boxes.filter(box => iou(boxes[0], box)<0.7);
	}
	return result
}

/**
 * Function calculates "Intersection-over-union" coefficient for specified two boxes
 * https://pyimagesearch.com/2016/11/07/intersection-over-union-iou-for-object-detection/.
 * @returns Intersection over union ratio as a float number
 */
function iou(box1, box2) {
	return intersection(box1, box2) / union(box1, box2);
}

/**
 * Function calculates union area of two boxes.
 * @returns Area of the boxes union as a float number
 */
function union(box1, box2) {
	const box1_area = (box1.x2-box1.x1) * (box1.y2-box1.y1)
	const box2_area = (box2.x2-box2.x1) * (box2.y2-box2.y1)
	return box1_area + box2_area - intersection(box1, box2)
}

/**
 * Function calculates intersection area of two boxes
 * @returns Area of intersection of the boxes as a float number
 */
function intersection(box1,box2) {
	const x1 = Math.max(box1.x1, box2.x1)
	const y1 = Math.max(box1.y1, box2.y1)
	const x2 = Math.min(box1.x2, box2.x2)
	const y2 = Math.min(box1.y2, box2.y2)
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
];
