import videojs from "video.js";

const Component = videojs.getComponent("Component");
const Button = videojs.getComponent("Button");

class TouchOverlay extends Component {
  private seekNote: Element | undefined;
  private totalDuration: number | undefined;
  private touchStateActive: boolean = false;
  private totalWidth: number = 0;
  private startX: number = 0;
  private toSeconds: number = 0;

  constructor(player: any, options: any) {
    super(player, options);
    const el = player.el();
    player.on("loadedmetadata", () => (this.totalDuration = player.duration()));
    player.on("dblclick", (event: any) => {
      if (this.handleClick(event)) return;
      player.paused() ? player.play() : player.pause();
    });
    this.handleTouchstart = this.handleTouchstart.bind(this);
    this.handleTouchmove = this.handleTouchmove.bind(this);
    this.handleTouchend = this.handleTouchend.bind(this);
    //
    player.on("touchstart", this.handleTouchstart);
    player.on("touchmove", this.handleTouchmove);
    player.on("touchend", this.handleTouchend);

    player.on("mousedown", this.handleTouchstart);
    player.on("mousemove", this.handleTouchmove);
    player.on("mouseup", this.handleTouchend);
  }

  createEl() {
    const overlay = videojs.dom.createEl("div", {
      className: "vjs-touch-overlay",
      tabIndex: -1,
    });
    let seekNote = videojs.dom.createEl("span", {
      className: "vjs-touch-seek-note",
      id: "seekNote",
    });
    videojs.dom.appendContent(overlay, seekNote);
    return overlay;
  }

  // 开始按下
  handleTouchstart(event: any) {
    if (this.handleClick(event)) return;
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    this.startSeeking(clientX);
  }

  // 移动中
  handleTouchmove(event: any) {
    if (!this.touchStateActive) return;
    if (this.handleClick(event)) return;
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    this.continueSeeking(clientX);
  }

  // 抬起
  handleTouchend() {
    if (!this.touchStateActive) return;
    this.stopSeeking();
  }

  // 计算当前宽度
  startSeeking(startX: number) {
    this.seekNote = document.getElementById("seekNote") as Element;
    if (this.totalDuration) {
      this.addClass("vjs-touch-active");
      this.touchStateActive = true;
      this.totalWidth = this.currentWidth();
      this.startX = startX;
    }
  }

  // 计算移动宽度
  continueSeeking(currentX: number) {
    if (!this.touchStateActive) return;
    this.addClass("vjs-touch-moving");
    this.touchStateActive = true;
    const dx = currentX - this.startX;
    const deltaX = dx / this.totalWidth;
    const currentSeconds = this.player().currentTime();
    let toSeconds = currentSeconds! + deltaX * this.totalDuration!;

    if (toSeconds < 0) {
      toSeconds = 0;
    } else if (toSeconds > this.totalDuration!) {
      toSeconds = this.totalDuration!;
    }

    const toTime = this.formatTime(toSeconds);
    videojs.dom.insertContent(this.seekNote!, toTime);
    this.toSeconds = toSeconds;
  }

  stopSeeking() {
    this.touchStateActive = false;
    this.removeClass("vjs-touch-active");
    if (this.hasClass("vjs-touch-moving")) {
      this.removeClass("vjs-touch-moving");
      this.player().currentTime(this.toSeconds);
    }
  }
  // 计算当前 时间
  formatTime(secondsTotal: number): string {
    secondsTotal = Math.floor(secondsTotal);
    const minutes = Math.floor(secondsTotal / 60);
    const seconds = secondsTotal % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
  //判断点击的位置是否在 controlBar上，
  //如果点击的位置在controlBar上，就返回true，否则返回false
  handleClick(event: any): boolean {
    const target = event.target;
    if (target.closest(".vjs-control-bar")) return true;
    return false;
  }
}

class CustomButton extends Button {
  private obj: any;
  constructor(player: any, options: any) {
    super(player, options);
    const el = this.el();
    this.obj = options;
    this.setAttribute("title", options.title);
    const svg = el.querySelector(".vjs-icon-placeholder");
    svg!.classList.add("vjs-iconfont", options.svg);
    svg!.setAttribute("aria-hidden", "true");
    const text = el.querySelector(".vjs-control-text");
    text!.innerHTML = options.title;
  }
  buildCSSClass() {
    return `vjs-control vjs-button vjs-menu-button ${super.buildCSSClass()}`;
  }
  // 自定义点击事件处理函数
  handleClick(event: Event) {
    // 禁止事件冒泡
    event.stopPropagation();
    this.player_.trigger(this.obj.fn);
  }
}

export { TouchOverlay, CustomButton };
