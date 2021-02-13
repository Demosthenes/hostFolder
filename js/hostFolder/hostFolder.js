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
   * @param {Object} $container  A reference to a jquery selector for the container you want the content in
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
    $container = null
  }) {
    this.baseUrl = baseUrl;
    this.filename = filename;
    this.filepath = filepath;
    this.loadingText = loadingText;
    this.$container = $container;
    this.prefetchLoadingImage();
  }

  prefetchLoadingImage = () => $.get({ url: this.filepath.loadingImage, async: false})

  noContainer = () => this.$container === null || !this.$container.length

  textRenderer = (id, text) => {
    if (this.noContainer()) return false;
    if ($(`#hostFolder_${id}`).length) {
      $(`#hostFolder_${id} .host-folder-text`).text(text).removeClass('d-none')
    } else {
      this.$container.append(`
        <div class="col-md-3" id="hostFolder_${id}">
          <p class="host-folder-text">${text}</p>
          <img class="host-folder-image d-none img-fluid">
        </div>`)
    }
  }

  imageRenderer = (id, url) => {
    if (this.noContainer()) return false;
    $(`#hostFolder_${id} .host-folder-image`).attr('src', url).removeClass('d-none')
  }

  textCompleted = (results, total) => {
    if (this.noContainer()) return false;
    $(`#hostFolder_${results[total-1].id + 1}`).remove();
  }

  imageCompleted = (results, total) => {
    if (this.noContainer()) return false;
  }

  reset = ($container) => {
    this.results = [];
    this.hasCompleted = 0;
    this.foundAll = false;
    $container.children().remove();
  }

  getText(url, index) {
    $.get({
      url,
      async: false, // Request the text file, sync to keep with the while loop
      success: (data) => (this.results[index].text = data), // It exists, add it to result with backup image
      error: () => (this.foundAll = true), // The server did not give a 200, no more content discovered
    })
  }

  getImage(url, index) {
    $.get({
      url, // Request the image file asych with filler until downlaoded
      success: () => (this.results[index].image = url), // Image found on server, add it
      error: () => (this.results[index].image = this.filepath.backupImage), // Image not found, use backup image
    }).always(()=>{
      this.hasCompleted++;
      if(this.results.length === this.hasCompleted) this.imageCompleted(this.results, this.hasCompleted);
    })
  }

  reachedEnd(forceStop = false) {
    this.results.pop();
    this.textCompleted(this.results, this.results.length);
    if(forceStop){ this.foundAll = true; }
  }

  // Search and return any content
  load(startId = 1, endId = false) {
    let id = startId;
    id--;
    this.reset(this.$container);
    while (!this.foundAll && ++id) {
      // Loop until we no longer find a valid 200 response
      let index = id - startId; // Make sure the array starts at 0 and offsets from start
      this.results[index] = new result(id, this.textRenderer, this.imageRenderer);
      this.results[index].text = this.loadingText;
      this.results[index].image = this.filepath.loadingImage;

      // Attempt to get the text for this
      this.getText(`${this.baseUrl}/${id}/${this.filename.text}`, index); 
      if (!this.foundAll && endId !== false && endId === (id - 1)) 
      { this.reachedEnd(true);  } 
      else if(!this.foundAll) 
      { this.getImage(`${this.baseUrl}/${id}/${this.filename.image}`, index); }
      else 
      { this.reachedEnd(false); }
    }
    return this.results;
  }
}

