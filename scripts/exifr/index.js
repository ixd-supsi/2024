import exifr from 'exifr'
import fs from 'fs'


const PATH = "../img_orig/"

// immagine singola
exifr.parse(PATH + 'IMG_2845.JPG').then(output => {
	console.log(output)
})


// folder
// fs.readdir("../img_orig/", (err, files) => {
// 	files.forEach(file => {
// 		exifr.parse(file).then(output => {
// 			console.log(output)
// 		})
//   	})
// })