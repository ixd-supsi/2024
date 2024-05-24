# Inferenza Face-API


Aprire il terminale nella cartella ```YOLO_detect```

### Prima esecuzione
```
npm install
```

Assicurarsi che il file ```common/image_path.cfg``` contenga il percorso **assoluto** alla cartella delle immagini da analizzare.

### Esecuzione script
```
node index.js
```
Verrà creato un file ```data_faces.json```


### Risultato ottenuto
```
[
    {
        "ImageWidth": 1125,
        "ImageHeight": 1027,
        "FileExtension": ".jpg",
        "FileName": "_PHOTO-2024-02-28-14-28-44",
        "Faces": [
            {
                "box": {
                    "left": 156,
                    "top": 143,
                    "width": 84,
                    "height": 368
                },
                "confidence": 94.8,
                "gender": "female",
                "genderConfidence": 85.8,
                "age": 23.7,
                "expression": "neutral",
                "expressionConfidence": 52.8
            },
            ...ecc
        ]
    },
    ...ecc
]

```


### Links

Basato sullo script: [vladmandic/face-api](https://github.com/vladmandic/face-api)
