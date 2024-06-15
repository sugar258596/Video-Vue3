import videojs from "video.js";

const Button = videojs.getComponent("Button");

export class CustomButton extends Button {
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
