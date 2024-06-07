# Scripts e tools
Esempi di scripts per il data mining di grandi set di immagini


### Homebrew: package manager per macOS
- https://brew.sh  
- Aprire il terminale 
- Eseguire il codice presente sulla homepage di Homebrew
  
In caso di errore provare: 
```
echo "export PATH=/opt/homebrew/bin:$PATH" >> ~/.zshrc
```

### Imagemagick 
- https://imagemagick.org
- Aprire il terminale 
- Eseguire ```brew install Imagemagick```

### Node.js e NPM
- https://nodejs.org
- Scaricare e installare l’ultima versione di Node  




# Imagemagick

Ridmimensiona e converti le immagini di un’intera cartella,  
lato maggiore di 128px (ingrandisce e riduce)  
cartella di destinazione: img_128  
cartella sorgente: face_crop   

```
magick mogrify -verbose -resize 128x128 -format jpg -quality 80  -path ./img_128 ./face_crop/*.*
```   

Ridmimensiona e converti le immagini di un’intera cartella,  
lato maggiore di 128px (riduce solamente)    
cartella di destinazione: img_128_max  
cartella sorgente: face_crop 
```
magick mogrify -verbose -resize 128x128\> -format JPG -quality 80 -path ./img_128_max ./face_crop/*.*

```
