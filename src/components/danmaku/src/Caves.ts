class Danmu {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private danmus: DanmuItem[] = [];
  private data: any[] = [];
  private lastAddTime: number = 0;
  private lastMouseX: number = -1;
  private lastMouseY: number = -1;

  constructor(option: { dom: HTMLElement; data: any }) {
    const { dom } = option;
    this.width = dom.offsetWidth;
    this.height = dom.offsetHeight;
    this.data = option.data;

    // 创建canvas
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d")!;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // 初始填充背景颜色
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 将canvas添加到DOM中
    dom.appendChild(this.canvas);

    // 监听鼠标移动事件
    this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));

    // 开始动画
    this.animate();
  }

  private addDanmu() {
    const speed = Math.random() * 3 + 1; // 随机速度
    const fontSize = Math.random() * 20 + 15; // 随机字号
    const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    })`; // 随机颜色
    const text = this.data[this.danmus.length % this.data.length]; // 循环使用弹幕文本

    const x = this.width;
    const y = Math.random() * (this.height - fontSize);

    const danmuItem: DanmuItem = {
      text: text,
      x: x,
      y: y,
      fontSize: fontSize,
      color: color,
      speed: speed,
      isPaused: false,
    };

    this.danmus.push(danmuItem);
  }

  private isOverlapping(_x: number, y: number, fontSize: number): boolean {
    for (const danmu of this.danmus) {
      if (y < danmu.y + danmu.fontSize && y + fontSize > danmu.y) {
        return true;
      }
    }
    return false;
  }

  private handleMouseMove(event: MouseEvent) {
    if (true) return;
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // 检查鼠标是否移动，如果没有移动则不进行任何操作
    if (mouseX === this.lastMouseX && mouseY === this.lastMouseY) {
      return;
    }

    this.lastMouseX = mouseX;
    this.lastMouseY = mouseY;

    for (const danmu of this.danmus) {
      const textWidth = this.ctx.measureText(danmu.text).width;
      if (
        mouseX > danmu.x &&
        mouseX < danmu.x + textWidth &&
        mouseY > danmu.y - danmu.fontSize &&
        mouseY < danmu.y
      ) {
        danmu.isPaused = true;
      } else {
        danmu.isPaused = false;
      }
    }
  }

  private animate(timestamp: number = 0) {
    // 清除画布
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 填充半透明背景
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 更新和绘制每个弹幕
    this.danmus.forEach((danmu) => {
      this.ctx.fillStyle = danmu.color;
      this.ctx.font = `${danmu.fontSize}px Arial`;
      this.ctx.fillText(danmu.text, danmu.x, danmu.y);

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
    if (timestamp - this.lastAddTime > Math.random() * 1500 + 10) {
      this.addDanmu();
      this.lastAddTime = timestamp;
    }

    // 请求下一帧动画
    requestAnimationFrame((t) => this.animate(t));
  }
}

interface DanmuItem {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  speed: number;
  isPaused: boolean;
}

export default Danmu;
