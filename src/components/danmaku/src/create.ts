import { h, VNode, render } from "vue";
import { DanmakuItem } from "./index";

type LastTrack = { element: HTMLElement; time: number };

class Danmaku {
  private dom: HTMLElement;
  private data: any; // 弹幕数据
  private index: number = 0; // 当前弹幕索引
  private domWidth: number; // dom 宽度
  private danmus: Set<HTMLElement> = new Set(); // 当前活跃的弹幕
  private lastDanmuInTrack: Map<number, LastTrack> = new Map(); // 存储每个轨道最后一个弹幕及其运动时间
  private endedDanmus: HTMLElement[] = []; // 用于存储结束的 DOM 元素
  private tracks: number = 15; // 弹幕轨道数
  private isPaused: boolean = false; // 是否暂停
  private isPausedManually: boolean = false; // 标志是否是手动暂停
  private trackTop: number = 25; // 弹幕轨道高度
  private gap: number = 50; // 弹幕轨道间距

  constructor(dom: HTMLElement, data: any) {
    this.dom = dom;
    this.data = data;
    this.domWidth = dom.offsetWidth;
    this.initDanmaku();
  }

  private initDanmaku() {
    setInterval(() => {
      if (!this.isPaused && this.index < this.data.length) {
        this.addDanmu(this.data[this.index]);
        this.index++;
      }
    }, 1000);
  }

  // 创建弹幕元素
  private createDanmakuItem(text: string): HTMLElement {
    const vnode = h(DanmakuItem, { text }) as VNode;
    const container = document.createElement("div");
    // 手动渲染 VNode 并挂载到容器上
    render(vnode, container);

    return container.firstChild as HTMLElement;
  }

  // 创建弹幕容器
  private createDanmu(text: string = "") {
    let div: HTMLElement;
    if (this.endedDanmus[0]) {
      div = this.endedDanmus.pop()!;
      const element = div.querySelector(".danmaku-text") as HTMLElement;
      element.innerText = text;
    } else {
      div = this.createDanmakuItem(text);
      this.dom.appendChild(div);
    }
    this.danmus.add(div);
    return div;
  }

  // 添加样式
  private addDanmu(text: string = "") {
    const dom = this.createDanmu(text);
    this.handleDanmu(dom);
    dom.id = `danmu-${Date.now()}`;
    dom.classList.add("danmu");
    dom.style.left = this.domWidth + "px";

    const y = Math.floor(Math.random() * this.tracks) + 1;
    dom.style.top = `${y * this.trackTop}px`;

    let time = Math.random() * 5000 + 5000;
    const lastDanmuInfo = this.lastDanmuInTrack.get(y);
    if (lastDanmuInfo) {
      const lastDanmuRight =
        parseFloat(lastDanmuInfo.element.style.left) -
        lastDanmuInfo.element.offsetWidth;
      const newLeft = Math.max(this.domWidth, lastDanmuRight + this.gap);
      dom.style.left = `${newLeft}px`;
    }

    dom.style.animation = `move ${time}ms linear`;
    const x = dom.offsetWidth + this.domWidth;
    dom.style.setProperty("--translateX", `-${x}px`);
    this.lastDanmuInTrack.set(y, { element: dom, time });
  }

  // 处理弹幕事件
  private handleDanmu(dom: HTMLElement) {
    const pauseAnimation = (e: Event) => {
      e.stopPropagation();
      (e.target as HTMLElement).style.animationPlayState = "paused";
    };

    const resumeAnimation = (e: Event) => {
      e.stopPropagation();
      if (!this.isPausedManually) {
        (e.target as HTMLElement).style.animationPlayState = "running";
      }
    };

    const animationEndHandler = (e: Event) => {
      const event = e.target as HTMLElement;
      event.style.animation = "none";
      const element = event.querySelector(".danmaku-text") as HTMLElement;
      element.innerText = "";
      this.danmus.delete(event);
      this.endedDanmus.push(event);
      dom.removeEventListener("animationend", animationEndHandler);
      dom.removeEventListener("mouseenter", pauseAnimation);
      dom.removeEventListener("mouseleave", resumeAnimation);
    };

    dom.removeEventListener("animationend", animationEndHandler);
    dom.addEventListener("animationend", animationEndHandler);
    dom.addEventListener("mouseenter", pauseAnimation);
    dom.addEventListener("mouseleave", resumeAnimation);
  }

  // 发送弹幕
  sendDanmu(text: string) {
    this.addDanmu(text);
  }

  // 清除弹幕
  clearDanmu() {
    this.dom.innerHTML = "";
    this.danmus.clear();
    this.endedDanmus = [];
    this.lastDanmuInTrack.clear();
    console.log("清除所有弹幕");
  }

  // 暂停弹幕
  pauseDanmu() {
    if (this.isPaused) return;
    this.isPausedManually = true;
    this.isPaused = true;
    this.danmus.forEach((danmu) => {
      danmu.style.animationPlayState = "paused";
    });
  }

  // 恢复弹幕
  resumeDanmu() {
    if (!this.isPaused) return;
    this.isPausedManually = false;
    this.isPaused = false;
    this.danmus.forEach((danmu) => {
      danmu.style.animationPlayState = "running";
    });
  }
}

export default Danmaku;
