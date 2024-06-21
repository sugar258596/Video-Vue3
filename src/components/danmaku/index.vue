<template>
  <div class="danmaku-container" ref="container"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
const container = ref<HTMLDivElement>();
const track = ref(28); // 轨道数量
const trackHight = ref(0); // 轨道高度

onMounted(() => {
  getContainer();
});

const createDan = reactive<{
  [key: string]: number;
}>({});

const createTrack = () => {
  const nuber = Math.floor(Math.random() * track.value) + 1;
  return nuber.toString();
};

/**
 * @description - 获取容器
 */
const getContainer = () => {
  trackHight.value = Math.floor(container.value!.offsetHeight / track.value);
  const width = container.value?.offsetWidth! * 2;
  container.value!.style.setProperty("--danmaku-stop", -width! + "px");
  for (let index = 0; index < 15; index++) {
    createDanmaku();
  }
};

/**
 * @description - 创建弹幕
 */
const createDanmaku = () => {
  const div = document.createElement("div");
  div.className = "danmaku-item";
  div.innerHTML = "弹幕 ";
  div.addEventListener("animationend", handleAnimationEnd);
  container.value?.appendChild(div);
  // 弹幕宽度
  const width = div.offsetWidth;
  // 距离顶部距离和左边的距离
  div.style.right = -width + "px";
  div.dataset.line = createTrack();
  div.style.setProperty("--animation-delay", createTrack() + "s");
  if (createDan[div.dataset.line]) {
    div.style.right = -(width + createDan[div.dataset.line] + 30) + "px";
  } else {
    div.style.right = -width + "px";
    createDan[div.dataset.line] = width;
  }
};

/**
 * @description - 处理动画结束事件
 * @param {Event} e - 事件对象
 */
const handleAnimationEnd = (e: Event) => {
  const target = e.target as HTMLElement;
  container.value?.removeChild(target);
  // createDanmaku();
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: aqua;
  overflow: hidden;
  :deep(.danmaku-item) {
    --top: 0; // 距离顶部距离
    --animation-duration: 8s; // 动画时长
    --animation-delay: 0; // 动画延迟时间
    --animation-iteration-count: "reverse"; // 播放方向 normal 正向 reverse  反向 alternate
    position: absolute;
    top: var(--top);
    right: 0;
    background-color: red;
    cursor: pointer;
    animation-name: alternate;
    animation-duration: var(--animation-duration);
    animation-timing-function: linear;
    animation-delay: var(--animation-delay);
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    animation-iteration-count: var(--animation-iteration-count);
    // transform: translateX(100%);

    &:hover {
      animation-play-state: paused;
    }

    @for $i from 1 through 50 {
      &[data-line="#{$i}"] {
        top: calc(#{$i} * var(--track-height));
      }
    }
  }
  @keyframes alternate {
    100% {
      transform: translateX(var(--danmaku-stop));
    }
  }
}
</style>
