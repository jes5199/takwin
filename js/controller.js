'use strict';

class TakwinController {
  constructor(canvas, use_audio) {
    this.canvas = canvas;

    this.receiver = new Receiver(id, canvas, "horizontal", 1024, 512, true);

    this.audializer = new Audializer(this.receiver);
    this.pixelizer = new FloatPixelizer(this.audializer);

    this.viewer = new Viewer(this.receiver);

    this.oscilloscope = new Oscilloscope(this.audializer, 100);
    // TODO spectrogram

    this.getTickPeriod = this.getTickPeriod.bind(this);
    this.renderGraphics = this.renderGraphics.bind(this);
    this.renderData = this.renderData.bind(this);
    this.initGraphics = this.initGraphics.bind(this);
    this.initData = this.initData.bind(this);

    this.use_audio = use_audio;
    if(use_audio) {
      this.driver = new AudioDriver(
        this.renderData, this.renderGraphics, this.getTickPeriod
      )
    } else {
      this.driver = new AnimateDriver(
        this.renderData, this.renderGraphics, this.getTickPeriod
      );
    }

    this.init();
  }

  init() {
    this.initData(0, function() {
      this.initGraphics(function() {
        this.startDriver();
      }.bind(this));
    }.bind(this));
  }

  run() {
    this.startDriver()
  }

  getTickPeriod() {
    return this.receiver.getTickPeriod();
  }

  audioNode() {
    if(!this.use_audio) {
      return;
    }
    return this.driver.audioNode();
  }

  audioCtx() {
    if(!this.use_audio) {
      return;
    }
    return this.driver.audioCtx();
  }

  initData(tick_count, f) {
    this.receiver.whenReady(function() {
      console.log("receiver ready");
      this.receiver.paint(tick_count);
      this.audializer.whenReady(function() {
        console.log("audializer ready");
        this.audializer.convert();
        this.pixelizer.whenReady(function() {
          console.log("pixelizer ready");
          this.pixelizer.convert();
          if(f) { f() };
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }

  initGraphics(f) {
    this.viewer.whenReady(function() {
      console.log("viewer ready");
      this.viewer.view();
      this.oscilloscope.whenReady(function() {
        console.log("oscilloscope ready");
        this.oscilloscope.view();
        if(f) { f() };
      }.bind(this));
    }.bind(this));
  }

  renderData(tick_count) {
    this.receiver.paint(tick_count);
    this.audializer.convert();
    this.pixelizer.convert();
    return this.pixelizer.getData();
  }

  renderGraphics() {
    this.viewer.view();
    this.oscilloscope.view();
  }

  startDriver() {
    this.driver.start();
  }

  connectAudio(audioDriver) {
    if(!this.use_audio) {
      return;
    }
    let ctx = this.audioCtx();
    let scriptNode = this.audioNode();

    scriptNode.connect(ctx.destination);
  }
}

