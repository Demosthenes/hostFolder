/**
* A Javascript module to search and load text/images from a server folder
* The text is synchronous and images are asynchronous
* If a container is provided, the contents will also render there
*
* @author  Mikael Hellsen
* @version 0.9
* @since   2021-02-11 
*/

import Result from './result.js';
import * as loader from './loader.js';
import * as defaultRenderers from './defaultRenderers.js';

export default class HostFolder {
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
  
   // Load default renderers
  cardRenderer   = defaultRenderers.cardRenderer;
  textRenderer   = defaultRenderers.textRenderer;
  imageRenderer  = defaultRenderers.imageRenderer;
  textCompleted  = defaultRenderers.textCompleted;
  imageCompleted = defaultRenderers.imageCompleted;

  constructor({
    baseUrl = "/test/mapp",
    filename = {
      text: "text.txt",
      image: "image.jpg",
    },
    filepath = {
      loadingImage: "loadingImage.gif",
      backupImage: "noImage.gif",
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
    this.results = [];
    this.hasCompleted = 0;
  };

  // Search and return any content
  load(startId = 1, endId = false) {
    if(!this.loadingImage){ return this.getLoadingImage(()=>{this.load(startId,endId)}) } // Make sure the loading image has loaded
    let id = startId, index, result; this.foundAll = false;
    while (!this.foundAll) { // Loop until we no longer find a valid 200 response
      if(endId === false || endId !== (id - 1)){
        this.getText(this.textUrl(id), this.results[index = id - startId] = result = this.createResult(id));  // Attempt to get the text for this
      }
      if     (!this.foundAll && endId !== false && endId === (id - 1))  { this.endHandler(true);                    } 
      else if(!this.foundAll)                                           { this.getImage(this.imageUrl(id), result); }
      else                                                              { this.endHandler(false);                   };
      id++;
    }; return this.results;
  };

  // ***************** Helpers
  textUrl  = id => `${this.baseUrl}/${id}/${this.filename.text}`;
  imageUrl = id => `${this.baseUrl}/${id}/${this.filename.image}`;

  createResult = id => {
    let result = new Result(this.textHandler, this.imageHandler);
    result.id = id, result.text = this.loadingText, result.image = this.loadingImage;
    return result;
  }

  missingElement = query => document.querySelector(query) === null;

  // ***************** Handle listeners
  textHandler = (id, text) => {
    if (this.missingElement(`#${this.containerId}`)) return false;
    if (this.missingElement(`#${this.containerId} #hostFolder_${id}`)) {this.cardRenderer(id, this.containerId, this.container);};
    this.textRenderer(id, text, this.containerId, this.container);
  }

  imageHandler = (id, url) => {
    if (this.missingElement(`#${this.containerId}`)) return false;
    if (this.missingElement(`#${this.containerId} #hostFolder_${id}`)) {this.cardRenderer(id, this.containerId, this.container);};
    this.imageRenderer(id, url, this.containerId, this.container);
  };
  
  endHandler(forceStop = false) {
    this.results.pop();
    this.textCompleted(this.results, this.results.length, this.containerId, this.container);
    if(forceStop){ this.foundAll = true; };
  };

  // ***************** Data Loaders
  getText(url, result) {
    loader.requestText( url, 
      (text) => { result.text = text;   },
      ()     => { this.foundAll = true; }
    );
  };

  getImage(url, result) {
    loader.requestImage( url, 
      (base64) => { result.image = base64; },
      ()       => { result.image = this.getBackupImage((base64)=> {result.image = base64}); },
      ()       => { if(this.hasCompleted++ && this.results.length === this.hasCompleted) {
                      this.imageCompleted(this.results, this.hasCompleted, this.containerId, this.container);
                    };
                  }
      );
  };

  getLoadingImage = (callback = base64 => {}) => {
    if(this.loadingImage){ return this.loadingImage; }
    loader.requestImage(this.filepath.loadingImage, base64 => { this.loadingImage = base64; callback(base64);});
  };

  getBackupImage = (callback = base64 => {}) => {
    if(this.backupImage){ return this.backupImage; }
    loader.requestImage(this.filepath.backupImage, base64 => { this.backupImage = base64; callback(base64);});
    return this.getLoadingImage();
  };
}