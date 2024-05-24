# Inferenza YOLOv8

Aprire il terminale nella cartella ```yolo_detect```   



### Prima esecuzione
```
npm install
```

Assicurarsi che il file ```common/image_path.cfg``` contenga il percorso **assoluto** alla cartella delle immagini da analizzare.

### Esecuzione script
```
node index.js
```
Verrà creato un file ```data_yolo.json```

### Risultato ottenuto
```
[
    {
        "ImageWidth": 384,
        "ImageHeight": 512,
        "FileExtension": ".jpg",
        "FileName": "_AWJF1281",
        "Objects": [
            {
                "box": {
                    "left": 156,
                    "top": 143,
                    "width": 84,
                    "height": 368
                },
                "label": "person",
                "prob": 90.2
            },
            ...ecc
        ]
    },
    ...ecc
]
```


### Links
[YOLOv8 object detection neural network](https://ultralytics.com/yolov8)
Modello: [yolov8m.onnx](https://huggingface.co/amd/yolov8m/resolve/main/yolov8m.onnx)
Basato sullo script: [AndreyGermanov/yolov8_onnx_nodejs](https://github.com/AndreyGermanov/yolov8_onnx_nodejs)
