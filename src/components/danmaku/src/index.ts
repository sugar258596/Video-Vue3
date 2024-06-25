class Danmaku {
  dom!: HTMLElement;
  domWidth!: number;
  endedDanmus: Set<HTMLElement> = new Set(); // 用于存储结束的 DOM 元素
  top: number = 20;
  constructor(dom: HTMLElement, data: any) {
    this.dom = dom;
    this.domWidth = dom.offsetWidth;
    setInterval(() => {
      this.addDanmu();
    }, 1000);
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
    }
    console.log(this.endedDanmus);
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
    dom.style.animation = `auto ease 0s 1 normal none running none`;
    const x = dom.offsetWidth + this.domWidth;
    dom.style.transform = `translateX(-${x}px)`;
    // 20-60 之间随机数
    let y = Math.floor(Math.random() * 10);
    dom.style.top = `${y * this.top}px`;
  }

  // 3.添加弹幕事件
  handleDanmu(dom: HTMLElement) {
    const transitionEndHandler = (e: Event) => {
      const event = e.target as HTMLElement;
      dom.style.transition = `-webkit-transform 0s linear 0s, transform 0s linear 0s`;
      dom.style.transform = `none`;
      dom.innerText = "";
      this.endedDanmus.add(event);
    };

    // 移除之前可能添加的相同类型的事件监听器，防止重复添加
    dom.removeEventListener("transitionend", (e: Event) =>
      transitionEndHandler(e)
    );

    dom.addEventListener("transitionend", transitionEndHandler);
  }

  //
}

export default Danmaku;
