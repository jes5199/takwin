class Receiver {
  constructor(storageKey, canvas, orientation, width, height, render_to_texture) {
    this.painter = new Painter(canvas, orientation, width, height, render_to_texture);
    this.storageKey = storageKey;

    this.load();

    this.subscribe();
  }

  getCanvas() {
    return this.painter.getCanvas();
  }

  getHeight() {
    return this.painter.getHeight();
  }

  getWidth() {
    return this.painter.getWidth();
  }

  output_texture_number() {
    return this.painter.output_texture_number();
  }

  load() {
    try {
      var key = "takwin_data_" + this.storageKey;
      var json = localStorage[key];
      if(json) {
        this.data = JSON.parse(json);
        if(! this.data['received']) {
          this.data['received'] = true;
          localStorage.setItem(key, JSON.stringify(this.data, null, "  "));
        }
      }
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
