import result from './result.js';

export default class hostFolder {
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
    this.results = [];
    this.foundAll = false;
    //this.prefetchLoadingImage();
  }

  textCallback = (id, text) => {
    if (this.$container === null || !this.$container.length) return false;
    if ($(`#contentFolder_${id}`).length) {
      $(`#contentFolder_${id} .content-folder-text`).text(text).removeClass('d-none')
    } else {
      this.$container.append(`<div id="contentFolder_${id}"><p class="content-folder-text">${text}</p><img class="content-folder-image img-fluid d-none"></div><br>`)
    }
  }

  textFallback = (id) => {
    if (this.$container === null || !this.$container.length) return false;
    $(`#contentFolder_${id}`).remove();
  }

  imageCallback = (id, url) => {
    if (this.$container === null || !this.$container.length) return false;
    $(`#contentFolder_${id} .content-folder-image`).attr('src', url).removeClass('d-none')
  }

  prefetchLoadingImage = () => {
    $.get({ url: this.filepath.loadingImage, async: false})
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
    })
  }

  // Search and return any content
  load(startId = 1) {
    let id = startId;
    this.foundAll = false;

    while (!this.foundAll) {
      // Loop until we no longer find a valid 200 response
      let index = id - startId; // Make sure the array starts at 0 and offsets from start

      this.results[index] = new result(id, this.textCallback, this.imageCallback);
      this.results[index].text = this.loadingText;
      this.results[index].image = this.filepath.loadingImage;

      this.getText(`${this.baseUrl}/${id}/${this.filename.text}`, index); // Attempt to get the text for this

      if (!this.foundAll) {
        this.getImage(`${this.baseUrl}/${id}/${this.filename.image}`, index);
      } 
      else {
        this.textFallback(id);
        this.results.pop();
      }
      id++; 
    }
    return this.results;
  };
}

