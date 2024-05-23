# Inferenza Face-API

### Struttura cartelle
```
/img_orig    # cartella con le immagini da analizzare
/face_detect # cartella con questo script
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
                    "x1": 382,
                    "y1": 132,
                    "x2": 516,
                    "y2": 263,
                    "w": 134,
                    "h": 130
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
