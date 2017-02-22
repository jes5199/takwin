class AudioDriver {
  constructor(renderData, renderGraphics, tick_period, tick_count) {
    this.renderData = renderData;
    this.renderGraphics = renderGraphics;
    this.tick_period = tick_period;
    this.tick_count = tick_count || 0;
    console.log(this.tick_count);

    this.animate = this.animate.bind(this);
    this.animating = false;

    this.audioProcess = this.audioProcess.bind(this);
    this.audioNode();
  }

  audioCtx() {
    if(! this._audioCtx ) {
      this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this._audioCtx;
  }

  audioNode() {
    if(! this._scriptNode) {
      this._scriptNode = this.audioCtx().createScriptProcessor(1024, 0, 1); // TODO configurable window
    }
    this._scriptNode.onaudioprocess = this.audioProcess;
    return this._scriptNode;
  }

  audioProcess(event) {
    var data = this.renderData(this.tick_count);

    var channelData = event.outputBuffer.getChannelData(0);
    channelData.set(data);

    this.tick_count += 1;

    var tick_period = this.tick_period;
    if(typeof tick_period == "function") {
      tick_period = tick_period();
    }
    if(tick_period) { this.tick_count %= tick_period; }

    if(!this.animating) {
      setTimeout(this.animate, 0);
    }
  }

  animate() {
    this.animating = true;
    this.renderGraphics();
    requestAnimationFrame(this.animate);
  }

  start() {
    this.animate();
  }
}
