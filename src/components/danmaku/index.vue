<template>
  <div class="danmaku-container" ref="container">
    <!-- <DanmakuItem :text="'32'"></DanmakuItem> -->
  </div>
  <div><button @click="handele1">发送</button></div>
  <div><button @click="handele2">暂停按钮</button></div>
  <div><button @click="handele3">播放按钮</button></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { danmus } from "./src/data";

// import Caves from "./src/Caves";
import Danmaku from "./src/create";
// import { DanmakuItem } from "./src";

const container = ref<HTMLDivElement>(); // 容器dom元素
const danmaku = ref();

onMounted(() => {
  danmaku.value = new Danmaku(container.value!, danmus);
});

const handele1 = () => {
  console.log("发送");
  danmaku.value?.sendDanmu("123");
};
const handele2 = () => {
  console.log("暂停按钮");
  danmaku.value?.pauseDanmu();
};

const handele3 = () => {
  console.log("播放按钮");
  danmaku.value?.resumeDanmu();
};
</script>

<style lang="scss" scoped>
.danmaku-container {
  position: absolute;
  top: 30px;
  left: 0;
  width: 80%;
  height: 100%;
  z-index: 1000;
  margin-left: 100px;
  background-color: aqua;
  overflow: hidden;
  :deep(.danmu) {
    --translateX: 0;
    position: absolute;
    font-size: 20px;
    cursor: pointer;
    white-space: nowrap;
  }
}
</style>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
@keyframes move {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(var(--translateX));
  }
}
</style>
