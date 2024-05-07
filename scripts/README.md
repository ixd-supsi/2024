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
- brew install Imagemagick

### Node.js e NPM
- https://nodejs.org
- Scaricare e installare l’ultima versione di Node  




# Imagemagick

Ridmimensiona e converti le immagini di un’intera cartella: 
```
magick mogrify -verbose -resize 512x512 -format JPG -quality 80 -path ../img_512 *.*
```

