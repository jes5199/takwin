class AnimateDriver {
  constructor(renderData, renderGraphics, tick_period, tick_count) {
    this.renderData = renderData;
    this.renderGraphics = renderGraphics;
    this.tick_period = tick_period;
    this.tick_count = tick_count || 0;

    this.animate = this.animate.bind(this);
  }

  animate() {
    this.renderData(this.tick_count);
    this.renderGraphics();
    this.tick_count += 1;
    if(this.tick_period) {
      this.tick_count %= this.tick_period;
    }
    requestAnimationFrame(this.animate);
  }

  start() {
    this.animate();
  }
}
