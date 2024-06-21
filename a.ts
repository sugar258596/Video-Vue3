private animate(timestamp: number = 0) {
    // 清除画布
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 填充半透明背景
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 更新和绘制每个弹幕
    this.danmus.forEach((danmu) => {
      // 绘制文字
      this.ctx.fillStyle = danmu.color;
      this.ctx.font = `${danmu.fontSize}px Arial`;
      this.ctx.fillText(danmu.text, danmu.x, danmu.y);

      // 如果弹幕没有被暂停，则更新位置
      if (!danmu.isPaused) {
        danmu.x -= danmu.speed;
      }

      // 如果弹幕移出画布，则重置位置到右侧
      if (danmu.x < -this.ctx.measureText(danmu.text).width) {
        danmu.x = this.width;
        danmu.y = Math.random() * (this.height - danmu.fontSize);

        // 尝试多次避免重叠
        let attempts = 0;
        const maxAttempts = 100;

        while (
          this.isOverlapping(danmu.x, danmu.y, danmu.fontSize) &&
          attempts < maxAttempts
        ) {
          danmu.y = Math.random() * (this.height - danmu.fontSize);
          attempts++;
        }

        // 如果尝试超过最大次数仍然重叠，则放弃
        if (attempts >= maxAttempts) {
          return;
        }
      }
    });

    // 控制弹幕的添加频率

    if (timestamp - this.lastAddTime > Math.random() * 2000 + 1000) {
      this.addDanmu();
      this.lastAddTime = timestamp;
    }
    // 请求下一帧
    requestAnimationFrame(() => this.animate());
  }