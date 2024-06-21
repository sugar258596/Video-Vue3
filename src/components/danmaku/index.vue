<template>
  <button @click="handleClick">停止</button>
  <button @click="handleClick2(false)">暂停</button>
  <button @click="handleClick2(true)">启动</button>
  <div class="danmaku-container" ref="container"></div>
  <canvas></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import { danmus } from "./src/data";

import Caves from "./src/Caves";

const container = ref<HTMLDivElement>(); // 容器dom元素
const containerWidth = ref(0); // 容器宽度
const track = ref(20); // 轨道数量
const trackHight = ref(0); // 轨道高度
const safeDistance = ref(50); // 安全距离
const isRunning = ref(false); // 是否绘制弹幕
const index = ref(0);

const trackStatus = reactive<Map<string, boolean>>(new Map()); // 轨道状态
const trackDelay = reactive<Map<string, number>>(new Map()); // 轨道延迟/
const lastTrack = ref<string>(); // 存储上一个轨道数

const handleClick = () => {
  isRunning.value = true;
};
const handleClick2 = (boolean: boolean) => {
  const danmakuElements = document.querySelectorAll(".danmaku-item");
  if (boolean) {
    isRunning.value = false;
    drawDanmaku();
    danmakuElements.forEach((element: any) => {
      element.style.animationPlayState = "running"; // 暂停弹幕的动画效果
    });
    return;
  }
  handleClick();
  // 停止所有的弹幕
  danmakuElements.forEach((element: any) => {
    element.style.animationPlayState = "paused"; // 暂停弹幕的动画效果
  });
};

onMounted(() => {
  // getContainer();
  new Caves({
    dom: container.value!,
    data: danmus,
  });
});

/**
 * @description - 获取容器
 */
const getContainer = () => {
  trackHight.value = Math.floor(container.value!.offsetHeight / track.value);
  containerWidth.value = container.value?.offsetWidth! + safeDistance.value; // 容器宽度 加 安全移动距离
  container.value!.style.setProperty(
    "--danmaku-stop",
    -containerWidth.value! + "px"
  );
  drawDanmaku();
};

// 弹幕绘制
const drawDanmaku = () => {
  let lastTime = performance.now(); // 记录上一次时间
  const loop = () => {
    if (index.value > danmus.length) isRunning.value = true;
    if (isRunning.value) return;
    const currentTime = performance.now(); // 当前时间
    const deltaTime = currentTime - lastTime; // 时间差
    if (deltaTime > 400) {
      createDanmaku(danmus[index.value]);
      lastTime = currentTime; // 更新时间]
      index.value++;
    }
    requestAnimationFrame(loop);
  };
  loop();
};

/**
 * @description - 创建弹幕
 */
const createDanmaku = (text: string = "弹幕12312312321") => {
  const div = document.createElement("div");
  div.className = "danmaku-item animation";
  div.innerHTML = text;
  div.addEventListener("animationend", handleAnimationEnd);
  container.value?.appendChild(div);
  handleDanmaku(div);
};

/**
 * @description -  轨道业务处理
 * @param Dom - 轨道dom元素
 */
const handleDanmaku = (Dom: HTMLDivElement) => {
  const width = Dom.offsetWidth;
  const time = Math.ceil((containerWidth.value + width) / width / 8) + 0.5;
  let line = createTrack();
  // 判断轨道是否被占用
  if (trackStatus.get(line)) {
    // 判断是否为连续轨道
    if (line == lastTrack.value) {
      let currentDelay = trackDelay.get(line) || 1;
      currentDelay += 1;
      Dom.style.setProperty("--animation-delay", time * currentDelay + "s");
      trackDelay.set(line, currentDelay);
      // 判断是否超过4个连续,超过的话进行轨道置换
      if (currentDelay > 4) line = createTrack();
    } else {
      Dom.style.setProperty("--animation-delay", time + "s");
      trackDelay.set(line, 1);
    }
  } else {
    trackStatus.set(line, true);
    trackDelay.set(line, 1);
  }
  lastTrack.value = line;
  Dom.dataset.line = line; // 设置line属性
};

/**
 * @description - 处理动画结束事件
 * @param {Event} e - 事件对象
 */
const handleAnimationEnd = (e: Event) => {
  const target = e.target as HTMLElement;
  container.value?.removeChild(target);
};

/**
 * @description - 创建轨道
 * @return {string} - 返回轨道数
 */
const createTrack = () => {
  const nuber = Math.floor(Math.random() * track.value) + 1;
  return nuber.toString();
};
</script>

<style lang="scss" scoped>
.danmaku-container {
  /* 定义弹幕的起始位置和结束位置 */
  --danmaku-start: 100%;
  --danmaku-stop: -900px;
  /* 轨道高度 */
  --track-height: 25px;

  position: absolute;
  top: 30px;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: aqua;
  // margin-left: 100px;
  overflow: hidden;
  :deep(.danmaku-item) {
    --top: 0; // 距离顶部距离
    --animation-duration: 5s; // 动画时长
    --animation-delay: 0; // 动画延迟时间
    --animation-iteration-count: "reverse"; // 播放方向 normal 正向 reverse  反向 alternate
    position: absolute;
    top: var(--top);
    right: 0;
    cursor: pointer;
    transform: translateX(100%);
    &:hover {
      animation-play-state: paused;
      z-index: 9999999;
    }

    @for $i from 1 through 50 {
      &[data-line="#{$i}"] {
        top: calc(#{$i} * var(--track-height));
      }
    }
  }
  :deep(.animation) {
    animation-name: alternate;
    animation-duration: var(--animation-duration);
    animation-timing-function: linear;
    animation-delay: var(--animation-delay);
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    animation-iteration-count: var(--animation-iteration-count);
  }
  @keyframes alternate {
    100% {
      transform: translateX(var(--danmaku-stop));
    }
  }
}
</style>
