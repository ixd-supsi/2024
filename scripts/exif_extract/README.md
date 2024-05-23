# Estrazione metadati da immagini

### Struttura cartelle 
```
/img_orig  # cartella con le immagini originali 
/img_512   # cartella con le immagini ridimensionate 
/exifr     # cartella con questo script 
```

Aprire il terminale nella cartella ```exifr```

### Prima esecuzione 
```
npm install
```

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

