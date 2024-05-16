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


### Links
[YOLOv8 object detection neural network](https://ultralytics.com/yolov8)
Modello: [yolov8m.onnx](https://huggingface.co/amd/yolov8m/resolve/main/yolov8m.onnx)
Basato sullo script di [AndreyGermanov/yolov8_onnx_nodejs](https://github.com/AndreyGermanov/yolov8_onnx_nodejs)
