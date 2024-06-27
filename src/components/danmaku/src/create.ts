class Danmaku {
  private dom!: HTMLElement;
  private domWidth!: number;
  private endedDanmus: Set<HTMLElement> = new Set(); // 用于存储结束的 DOM 元素
  private top: number = 20;
  constructor(dom: HTMLElement, data: any) {
    this.dom = dom;
    this.domWidth = dom.offsetWidth;
    setInterval(() => {
      this.addDanmu();
    }, 100);
  }

  // 1.创建弹幕
  createDanmu() {
    let div: HTMLElement;
    if (this.endedDanmus.size > 0) {
      const iterator = this.endedDanmus.values();
      div = iterator.next().value!;
      this.endedDanmus.delete(div); // 根据 ID 删除元素
      div.innerText = new Date().getTime().toString();
    } else {
      div = document.createElement("div");
      div.className = "danmu";
      div.innerText = "hello world";
      this.dom.appendChild(div);
      console.log("---------------------------------", this.endedDanmus);
    }
    return div;
  }
  // 2.添加弹幕样式
  addDanmu() {
    const dom = this.createDanmu();
    this.handleDanmu(dom);
    dom.id = `danmu-${new Date().getTime()}`;
    dom.classList.add("danmu");
    dom.style.left = this.domWidth + "px";
    const time = Math.random() * 5000 + 5000;
    dom.style.transition = ` -webkit-transform ${time}ms linear 0s, transform ${time}ms linear 0s`;
    dom.style.animation = `identifier ease 0s 1 normal none running none`;
    const x = dom.offsetWidth + this.domWidth;
    dom.style.transform = `translateX(-${x}px)`;
    // 20-60 之间随机数
    let y = Math.floor(Math.random() * 10);
    dom.style.top = `${y * this.top}px`;
  }
  // 3.添加弹幕事件
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
      event.style.transition = `-webkit-transform 0s linear 0s, transform 0s linear 0s`;
      event.style.transform = `none`;
      event.innerText = "";
      this.endedDanmus.add(event);
      dom.removeEventListener("mouseenter", mouseenter);
      dom.removeEventListener("mouseleave", mouseleave);
    };

    // 移除之前可能添加的相同类型的事件监听器，防止重复添加
    dom.removeEventListener("transitionend", transitionEndHandler);

    dom.addEventListener("transitionend", transitionEndHandler);
    dom.addEventListener("mouseenter", mouseenter);
    dom.addEventListener("mouseleave", mouseleave);
  }
}

export default Danmaku;
