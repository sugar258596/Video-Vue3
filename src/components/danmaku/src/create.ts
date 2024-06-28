import { h, createApp } from "vue";
import { DanmakuItem } from "./index";

class Danmaku {
  private dom!: HTMLElement;
  private domWidth!: number;
  private danmus: Set<HTMLElement> = new Set(); // 当前活跃的弹幕
  private endedDanmus: Map<string, HTMLElement> = new Map(); // 用于存储结束的 DOM 元素
  private isPaused: boolean = false; // 是否暂停
  private top: number = 20;
  private data: any;
  private index: number = 0;
  constructor(dom: HTMLElement, data: any) {
    this.data = data;
    this.dom = dom;
    this.domWidth = dom.offsetWidth;
    // setInterval(() => {
    //   this.addDanmu(this.data[this.index]);
    //   this.index++;
    // }, 1000);
  }

  // 1.创建弹幕
  createDanmu(text: string = "") {
    let div: HTMLElement;
    if (this.endedDanmus.size > 0) {
      const iterator = this.endedDanmus.entries();
      const [id, element] = iterator.next().value!;
      div = element;
      this.endedDanmus.delete(id); // 根据 ID 删除元素
    } else {
      div = this.createDanmakuItem(text);
      this.dom.appendChild(div);
    }
    this.danmus.add(div);
    return div;
  }

  // 2.添加样式
  addDanmu(text: string = "") {
    const dom = this.createDanmu(text);
    this.handleDanmu(dom);
    dom.id = `danmu-${new Date().getTime()}`;
    dom.classList.add("danmu");
    dom.style.left = this.domWidth + "px";
    const time = Math.random() * 5000 + 5000;
    dom.style.transition = `-webkit-transform ${time}ms linear 0s, transform ${time}ms linear 0s`;
    dom.style.animation = `identifier ease 0s 1 normal none running none`;
    const x = dom.offsetWidth + this.domWidth;
    dom.style.transform = `translateX(-${x}px)`;
    // 20-60 之间随机数
    let y = Math.floor(Math.random() * 10);
    dom.style.top = `${y * this.top}px`;
  }

  // 3.添加事件
  handleDanmu(dom: HTMLElement) {
    let transition: string;
    let transform: string;
    const mouseenter = (e: Event) => {
      const event = e.target as HTMLElement;
      transition = dom.style.transition;
      transform = dom.style.transform;
      const childRect = event.getBoundingClientRect().left; // 获取当前元素到左边的距离
      const parentRect = this.dom.getBoundingClientRect().left; // 获取父元素到左边的距离
      const leftDistance = Number((childRect - parentRect).toFixed(3)); // 获取当前元素到父级左边的距离
      const x = leftDistance - this.domWidth;
      event.style.transform = `matrix(1, 0, 0, 1, ${x}, 0)`;
      event.style.transition = "none";
    };

    const mouseleave = (e: Event) => {
      const event = e.target as HTMLElement;
      event.style.transform = transform;
      event.style.transition = transition;
    };

    const transitionEndHandler = (e: Event) => {
      const event = e.target as HTMLElement;
      const id = event.id;
      event.style.transition = `-webkit-transform 0s linear 0s, transform 0s linear 0s`;
      event.style.transform = `none`;
      this.danmus.delete(event);
      this.endedDanmus.set(id, event);
      dom.removeEventListener("mouseenter", mouseenter);
      dom.removeEventListener("mouseleave", mouseleave);
    };

    // 移除之前可能添加的相同类型的事件监听器，防止重复添加
    dom.removeEventListener("transitionend", transitionEndHandler);

    dom.addEventListener("transitionend", transitionEndHandler);
    dom.addEventListener("mouseenter", mouseenter);
    dom.addEventListener("mouseleave", mouseleave);
  }

  // 5.添加发送弹幕功能
  sendDanmu(text: string) {
    this.addDanmu(text);
  }

  // 6.添加清除弹幕功能
  clearDanmu() {
    this.dom.innerHTML = "";
    console.log("添加清除弹幕功能");
  }
  // 7.添加暂停弹幕功能
  pauseDanmu() {
    if (this.isPaused) return; // 如果已经暂停，直接返回
    this.isPaused = true; // 设置标志位为 true
    this.danmus.forEach((danmu) => {
      const computedStyle = window.getComputedStyle(danmu);
      danmu.dataset.transform = danmu.style.transform; // 保持当前 transform 状态
      danmu.dataset.transition = danmu.style.transition; // 保持当前 transition 状态
      danmu.style.transform = computedStyle.transform; // 设置 transform 状态
      danmu.style.transition = "none"; // 取消 transition
    });
  }
  // 8.添加恢复弹幕功能
  resumeDanmu() {
    if (!this.isPaused) return; // 如果没有暂停，直接返回
    this.isPaused = false; // 设置标志位为 false
    this.danmus.forEach((danmu) => {
      danmu.style.transform = danmu.dataset.transform!; // 恢复 transform 状态
      danmu.style.transition = danmu.dataset.transition!; // 恢复 transition 状态
    });
  }

  createDanmakuItem(text: string) {
    const app = createApp({
      render() {
        return h(
          DanmakuItem,
          {
            text,
          },
          {
            "danmaku-header": () => h("div", "This is the header slot content"),
          }
        );
      },
    });
    const vm = app.mount(document.createElement("div"));
    return vm.$el;
  }
}

export default Danmaku;
