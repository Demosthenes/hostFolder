/**
* A Javascript module to search and load text/images from a server folder
* The text is synchronous and images are asynchronous
* If a container is provided, the contents will also render there
*
* @author  Mikael Hellsen
* @version 0.9
* @since   2021-02-11 
*/

import result from './result.js';

export default class hostFolder {
     /**
   * This is the main class to use the module
   * @param {string} baseUrl This url will be used as a base location when creating paths
   * @param {string} filename.text  The name of your text files
   * @param {string} filename.image  The name of your image files
   * @param {string} filepath.loadingImage  The path to your loading image, relative to baseUrl
   * @param {string} filepath.backupImage  The path to your not found image, relative to baseUrl
   * @param {string} loadingText  What should the text say while loading new results?
   * @param {Object} container  A reference to a jquery selector for the container you want the content in
   */

  constructor({
    baseUrl = "/test/mapp",
    filename = {
      text: "text.txt",
      image: "image.jpg",
    },
    filepath = {
      loadingImage: "loadingImage.jpg",
      backupImage: "noImage.jpg",
    },
    loadingText = "Checking for more posts...",
    container = null
  }) {
    this.baseUrl = baseUrl;
    this.filename = filename;
    this.filepath = filepath;
    this.loadingText = loadingText;
    this.containerId = container;
    this.container = document.getElementById(container);
    this.backupImage = false;
    this.loadingImage = false;
  }

  // Search and return any content
  load(startId = 1, endId = false) {
    if(!this.loadingImage){ return this.getLoadingImage(()=>{this.load(startId,endId)}) } // Make sure the loading image has loaded
    let id = startId; id--;
    this.reset(this.container);
    while (!this.foundAll && ++id) {
      // Loop until we no longer find a valid 200 response
      let index = id - startId; // Make sure the array starts at 0 and offsets from start
      this.results[index] = new result(id, this.textHandler, this.imageHandler);
      this.results[index].text = this.loadingText;
      this.results[index].image = this.loadingImage;

      // Attempt to get the text for this
      this.requestText(`${this.baseUrl}/${id}/${this.filename.text}`, index); 
      if (!this.foundAll && endId !== false && endId === (id - 1)) 
      { this.reachedEnd(true);  } 
      else if(!this.foundAll) 
      { this.getImage(`${this.baseUrl}/${id}/${this.filename.image}`, index); }
      else 
      { this.reachedEnd(false); }
    }
    return this.results;
  }
  
  // ***************** Helpers
  noContainer = () => this.container === null

  reset = (container) => {
    this.results = [];
    this.hasCompleted = 0;
    this.foundAll = false;
    while (container.firstChild) {
      container.removeChild(container.lastChild);
    }
  }

  reachedEnd(forceStop = false) {
    this.results.pop();
    this.textCompleted(this.results, this.results.length, this.containerId, this.container);
    if(forceStop){ this.foundAll = true; }
  }

  // ***************** Renderers
  
  textHandler = (id, text) => {
    if (this.noContainer()) return false;
    if (document.getElementById(`hostFolder_${id}`) === null) {
      this.cardRenderer(id, this.containerId, this.container);
    }
    this.textRenderer(id, text, this.containerId, this.container);
  }

  imageHandler = (id, url) => {
    if (this.noContainer()) return false;
    if (document.getElementById(`hostFolder_${id}`) === null) {
      this.cardRenderer(id, this.containerId, this.container);
    }
    this.imageRenderer(id, url, this.containerId, this.container);
  }

  defaultCardRenderer = (id, containerId, container) => {
    let card = document.createElement("div");
    card.id = `hostFolder_${id}`
    card.className = `col-md-3`
    card.innerHTML = `<p class="host-folder-text"></p><img style="display:none;" class="host-folder-image img-fluid">`
    container.appendChild(card)
  }

  defaultTextRenderer = (id, text, containerId, container) => {
    document.querySelector(`#hostFolder_${id} .host-folder-text`).innerText = text
  }

  defaultImageRenderer = (id, url, containerId, container) => {
    let img = document.querySelector(`#hostFolder_${id} .host-folder-image`);
    img.src = url;
    img.style.display = "";
  }

  defaultTextCompleted = (results, total, containerId, container) => {
    let textContainer = document.getElementById(`hostFolder_${results[total-1].id + 1}`);
    textContainer.parentNode.removeChild(textContainer);
  }

  defaultImageCompleted = (results, total, containerId, container) => {
  }

  cardRenderer   = this.defaultCardRenderer;
  textRenderer   = this.defaultTextRenderer;
  imageRenderer  = this.defaultImageRenderer;
  textCompleted  = this.defaultTextCompleted;
  imageCompleted = this.defaultImageCompleted;

  // ***************** Loaders

  getLoadingImage = (callback = (base64) => {}) => {
    if(this.loadingImage){ return this.loadingImage; }
    this.requestImage( this.filepath.loadingImage, (base64) => {
      this.loadingImage = base64
      callback(base64);
    })
  }

  getBackupImage = (callback = (base64) => {}) => {
    if(this.backupImage){ return this.backupImage; }
    this.requestImage( this.filepath.backupImage, (base64) => {
      this.backupImage = base64
      callback(base64);
    })
    return this.getLoadingImage();
  }

  getImage(url, index) {
    this.requestImage( url, 
      (base64) => { this.results[index].image = base64 },
      () => { this.results[index].image = this.getBackupImage((base64)=> {this.results[index].image = base64}) },
      () => {
        this.hasCompleted++;
      if(this.results.length === this.hasCompleted){
        this.imageCompleted(this.results, this.hasCompleted, this.containerId, this.container);
      }
    })
  }

  requestText(url, index) {
    let request = new XMLHttpRequest();
    request.open("GET", url, false) // Request the text file, sync to keep with the while loop
    request.onreadystatechange = () => {
      if(request.readyState === 4 && request.status === 200) {
        this.results[index].text = request.responseText // It exists, add it to result with backup image
      } else if (request.readyState === 4 && request.status !== 200){
        this.foundAll = true // The server did not give a 200, no more content discovered
      }
    };
    request.send();
  }
  
  requestImage = (url, success = (data) => {}, error = () => {}, always = () => {}) => {
    let request = new XMLHttpRequest();
    request.responseType = 'arraybuffer';
    request.open("GET", url) // Request the text file, sync to keep with the while loop
    request.onreadystatechange = () => {
      if (request.readyState === 4 ) { 
        if(request.status === 200)       { success(this.binaryToBase64(request.response)) } 
        else if (request.status !== 200) { error(); }
        always(); 
      }
    };
    request.send();
  }

  binaryToBase64 = (bin) => {
    let uInt8Array = new Uint8Array(bin), i = uInt8Array.length, biStr = new Array(i);
    while (i--) { biStr[i] = String.fromCharCode(uInt8Array[i]); }
    return `data:image/jpg;base64,${btoa(biStr.join(''))}`;
  } 
}