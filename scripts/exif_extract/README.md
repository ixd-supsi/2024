# Estrazione metadati da immagini


Aprire il terminale nella cartella ```exifr_extract```

### Prima esecuzione 
```
npm install
```
Assicurarsi che il file ```common/image_path.cfg``` contenga il percorso **assoluto** alla cartella delle immagini da analizzare


### Esecuzione script 
```
node index.js
```
Verrà creato un file ```data_exif.json```

### Risultato ottenuto
```
[
    {
        "ImageWidth": 1125,
        "ImageHeight": 1027,
        "FileExtension": ".jpg",
        "FileName": "_PHOTO-2024-02-28-14-28-44",
        "EXIF": {
            "ISO": 100,
            ...ecc
        }
    },
    ...ecc
]

```

