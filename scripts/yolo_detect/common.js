import fs from 'fs'
import sharp from 'sharp'

const DEFAULT_CFG_PATH_LOCATION = "../common/image_path.cfg"
const FILES_DA_IGNORARE = ['.DS_Store', '.AppleDouble', '.LSOverride']

export function getImagePath() {
	try {
		return fs.readFileSync(DEFAULT_CFG_PATH_LOCATION, 'utf8').trim()
	} catch (e) {
		console.log("Percorso immagine default non trovato/errato.")
		console.log("Verifica il file " + DEFAULT_CFG_PATH_LOCATION)
	}
}

export function scanFolder(path) {
	return fs.readdirSync(path).filter( e => FILES_DA_IGNORARE.indexOf(e) == -1)
}

export async function loadSharpImage(image_path) {
	const image = sharp(image_path).rotate()
	// TODO: molto lento? (metdati non rispecchiano totazione JPG!)
	const { info } = await image.toBuffer({ resolveWithObject: true })
	return {
		image,
		width : info.width,
		height : info.height,
 	}
}

export async function cropAndSaveSharpImage(img, box, savePath, cropSize = null) {
	try {
		if (cropSize) {
			await img
				.clone()
				.extract(box)
				.resize(cropSize, cropSize, { fit: 'inside' })
				.rotate()
				.toFile(savePath)

		} else {
			await img
				.clone()
				.extract(box)
				.rotate()
				.toFile(savePath)
		}
	} catch (e) {
		console.log("Errore nel file: " + savePath)
		console.log(e)
	}
}