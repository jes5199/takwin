class Receiver {
  constructor(storageKey, canvas, orientation, width, height, render_to_texture) {
    this.painter = new Painter(canvas, orientation, width, height, render_to_texture);
    this.storageKey = storageKey;

    this.load();

    this.subscribe();
  }

  load() {
    try {
      this.data = JSON.parse(localStorage["takwin_data_" + this.storageKey]);
    } catch (e) {
      console.log(e);
    }
  }

  subscribe() {
    window.addEventListener('storage', function (event) {
      this.load();
    }.bind(this));
  }

  paint(tick_count) {
    this.painter.paint(this.data, tick_count);
  }

  setImage(n, img) {
    this.painter.setImage(n, img);
  }

  whenReady(f) {
    this.painter.whenReady(f);
  }

}
