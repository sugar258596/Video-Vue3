<template>
  <div class="danmaku-container" ref="container">
    <!-- <DanmakuItem></DanmakuItem> -->
  </div>
  <canvas></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from "vue";
import { danmus } from "./src/data";

// import Caves from "./src/Caves";
import Danmaku from "./src/create";
import { DanmakuItem } from "./src";

const container = ref<HTMLDivElement>(); // 容器dom元素

onMounted(() => {
  new Danmaku(container.value!, danmus);
  console.log("=========");
});
onUnmounted(() => {
  console.log("////////////////////////");
});
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
}
</style>

<style>
.danmu {
  position: absolute;
  font-size: 20px;
  cursor: pointer;
  white-space: nowrap;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
