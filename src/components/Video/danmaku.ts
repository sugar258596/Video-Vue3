type Direction = "right" | "left" | "top" | "bottom";

interface Option {
  container: HTMLElement;
  direction?: Direction;
  time?: number;
  texts: string[];
}

class Danmaku {
  private container: HTMLElement;
  private direction: Direction = "right";
  private time: number = 240;
  private ctx: CanvasRenderingContext2D | undefined;
  private animationFrameId: number | undefined;
  private width: number;
  private height: number;
  private textPositions: { x: number; y: number; text: string }[] = [];
  private stepBy: number = 2; // 步进
  private texts: string[];

  constructor(option: Option) {
    const { container, direction, time, texts } = option;
    this.container = container;
    this.width = container!.offsetWidth;
    this.height = container!.offsetHeight;
    this.direction = direction ?? this.direction;
    this.time = time ?? this.time;
    this.texts = texts;
    this.stepBy = Math.ceil(480 / this.time);
    this.start();
  }

  start() {
    // 创建canvas
    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    this.ctx = canvas.getContext("2d")!;
    // 设置文本样式
    this.ctx.font = "26px Arial";
    this.ctx.fillStyle = "blue";

    // 初始化文本位置
    this.texts.forEach((text) => {
      let textPositionX = 0;
      if (this.direction === "right") {
        textPositionX = this.width;
      } else if (this.direction === "left") {
        textPositionX = -this.ctx!.measureText(text).width;
      }
      const num = Math.floor(Math.random() * 10 + 1);
      const textPositionY = this.height / num;
      this.textPositions.push({ x: textPositionX, y: textPositionY, text });
    });

    // 将canvas附加到容器
    this.container.appendChild(canvas);

    // 开始动画循环
    this.animate();
  }

  animate() {
    // 清除上一帧
    this.ctx!.clearRect(0, 0, this.width, this.height);

    this.textPositions.forEach((pos, index) => {
      // 更新文本位置
      if (this.direction === "right") {
        pos.x -= this.stepBy; // 从右往左
        if (pos.x < -this.ctx!.measureText(pos.text).width) {
          // 重置位置
          pos.x = this.width;
        }
      } else if (this.direction === "left") {
        pos.x += this.stepBy; // 从左往右
        if (pos.x > this.width) {
          // 重置位置
          pos.x = -this.ctx!.measureText(pos.text).width;
        }
      }

      // 绘制文本
      this.ctx!.fillText(pos.text, pos.x, pos.y);
    });

    // 请求下一帧
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.ctx!.clearRect(0, 0, this.width, this.height);
  }
}

export default Danmaku;
