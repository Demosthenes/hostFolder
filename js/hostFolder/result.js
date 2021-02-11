/**
* The class for a hostFolder result
* Required to listen for mutations in variables
*
* @author  Mikael Hellsen
* @version 0.9
* @since   2021-02-11 
*/

export default class result {
  constructor(id, textCallback, imageCallback) {
    this.id = id;
    this.textInternal = "";
    this.imageInternal = "";
    this.textListener = textCallback;
    this.imageListener = imageCallback;
  }

  textChanged(listener) {
    this.textListener = listener;
  }
  imageChanged(listener) {
    this.imageListener = listener;
  }

  set text(val) {
    this.textInternal = val;
    this.textListener(this.id, val);
  }
  get text() {
    return this.textInternal;
  }

  set image(val) {
    this.imageInternal = val;
    this.imageListener(this.id, val);
  }
  get image() {
    return this.imageInternal;
  }
}