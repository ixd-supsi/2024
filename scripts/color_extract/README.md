# Ridimensionare immagini (batch)

Aprire il terminale nella cartella ```resize```  


### Prima esecuzione
```
npm install
```   
Assicurarsi che il file ```common/image_path.cfg``` contenga il percorso **assoluto** alla cartella delle immagini da analizzare.


### Esecuzione script
```
node index.js
```
Verrà creato un file ```data_images.json```

### Risultato ottenuto
```
[
    {
        "ImageWidth": 384,
        "ImageHeight": 512,
        "FileExtension": ".jpg",
        "FileName": "_AWJF1281",
    },
    ...ecc
]
```
