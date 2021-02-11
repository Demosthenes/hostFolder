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
    this.textListener(val, this.id);
  }
  get text() {
    return this.textInternal;
  }

  set image(val) {
    this.imageInternal = val;
    this.imageListener(val, this.id);
  }
  get image() {
    return this.imageInternal;
  }
}