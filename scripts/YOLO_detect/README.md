# Inferenza YOLOv8

### Struttura cartelle
```
/img_orig    # cartella con le immagini da analizzare
/YOLO_detect # cartella con questo script
```

Aprire il terminale nella cartella ```YOLO_detect```

### Prima esecuzione
```
npm install
```

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
                    "x1": 156,
                    "y1": 143,
                    "x2": 240,
                    "y2": 511,
                    "w": 84,
                    "h": 368
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
