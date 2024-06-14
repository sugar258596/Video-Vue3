import videojs from "video.js";

const Component = videojs.getComponent("Component");

export class TouchOverlay extends Component {
  private seekNote: Element | undefined;
  private totalDuration: number | undefined;
  private touchStateActive: boolean = false;
  private totalWidth: number = 0;
  private startX: number = 0;
  private toSeconds: number = 0;

  constructor(player: any, options: any) {
    super(player, options);

    player.on("loadedmetadata", () => (this.totalDuration = player.duration()));
    player.on("dblclick", (event: any) =>
      player.paused() ? player.play() : player.pause()
    );
    this.handleTouchstart = this.handleTouchstart.bind(this);
    this.handleTouchmove = this.handleTouchmove.bind(this);
    this.handleTouchend = this.handleTouchend.bind(this);
    this.handleMousedown = this.handleMousedown.bind(this);
    this.handleMousemove = this.handleMousemove.bind(this);
    this.handleMouseup = this.handleMouseup.bind(this);

    player.on("touchstart", this.handleTouchstart);
    player.on("touchmove", this.handleTouchmove);
    player.on("touchend", this.handleTouchend);
    player.on("mousedown", this.handleMousedown);
    document.addEventListener("mousemove", this.handleMousemove);
    document.addEventListener("mouseup", this.handleMouseup);
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

  handleTouchstart(event: any) {
    this.startSeeking(event.touches[0].clientX);
  }

  handleTouchmove(event: any) {
    this.continueSeeking(event.touches[0].clientX);
  }

  handleTouchend() {
    this.stopSeeking();
  }

  handleMousedown(event: any) {
    this.startSeeking(event.clientX);
  }

  handleMousemove(event: any) {
    if (this.touchStateActive) {
      this.continueSeeking(event.clientX);
    }
  }

  handleMouseup() {
    if (this.touchStateActive) {
      this.stopSeeking();
    }
  }

  startSeeking(startX: number) {
    this.seekNote = document.getElementById("seekNote") as Element;
    if (this.totalDuration) {
      this.addClass("vjs-touch-active");
      this.touchStateActive = true;
      this.totalWidth = this.currentWidth();
      this.startX = startX;
    }
  }

  continueSeeking(currentX: number) {
    if (this.touchStateActive) {
      this.addClass("vjs-touch-moving");
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
  }

  stopSeeking() {
    this.touchStateActive = false;
    this.removeClass("vjs-touch-active");
    if (this.hasClass("vjs-touch-moving")) {
      this.removeClass("vjs-touch-moving");
      this.player().currentTime(this.toSeconds);
    }
  }

  formatTime(secondsTotal: number): string {
    secondsTotal = Math.floor(secondsTotal);
    const minutes = Math.floor(secondsTotal / 60);
    const seconds = secondsTotal % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
}
