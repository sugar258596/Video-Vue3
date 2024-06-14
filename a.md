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

    // 确保事件处理函数中的 `this` 指向当前实例
    this.handleTouchstart = this.handleTouchstart.bind(this);
    this.handleTouchmove = this.handleTouchmove.bind(this);
    this.handleTouchend = this.handleTouchend.bind(this);

    // 添加到 DOM 树中

    player.on("loadedmetadata", () => {
      this.totalDuration = player.duration();
    });

    this.on("touchstart", this.handleTouchstart);
    this.on("touchmove", this.handleTouchmove);
    this.on("touchend", this.handleTouchend);

}

createEl() {
const overlay = videojs.dom.createEl("div", {
className: "vjs-touch-overlay",
tabIndex: -1,
});
return overlay;
}

handleTouchstart(event: any) {
if (this.totalDuration) {
this.addClass("vjs-touch-active");
this.touchStateActive = true;
this.totalWidth = this.currentWidth();
this.startX = event.touches[0].clientX;
}
}

handleTouchend() {
this.touchStateActive = false;
this.removeClass("vjs-touch-active");

    if (this.hasClass("vjs-touch-moving")) {
      this.removeClass("vjs-touch-moving");
      this.player().currentTime(this.toSeconds);
    }

}

handleTouchmove(event: any) {
if (this.touchStateActive) {
this.addClass("vjs-touch-moving");
const currentX = event.touches[0].clientX;
const dx = currentX - this.startX;
const deltaX = dx / this.totalWidth;
const currentSeconds = this.player().currentTime();
let toSeconds = currentSeconds! + deltaX \* this.totalDuration!;

      if (toSeconds < 0) {
        toSeconds = 0;
      } else if (toSeconds > this.totalDuration!) {
        toSeconds = this.totalDuration!;
      }

      const toTime = this.formatTime(toSeconds);
      // videojs.dom.insertContent(this.seekNote!, toTime);
      // this.seekNote!.innerHTML = "123123";
      this.toSeconds = toSeconds;
    }

}

formatTime(secondsTotal: number): string {
secondsTotal = Math.floor(secondsTotal);
const minutes = Math.floor(secondsTotal / 60);
const seconds = secondsTotal % 60;
return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
}
