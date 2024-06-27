<template>
  <div class="danmaku-item-content">
    <div class="danmaku-item">
      <div class="danmaku-img">图标</div>
      <p class="danmaku-text">文字</p>
      <div>
        <span>点赞</span>
        <span>举报</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
<style lang="scss" scoped>
.danmaku-item-content {
  background-color: red;
  border-radius: 10px;
  overflow: hidden;
  padding: 10px;
  .danmaku-item {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .danmaku-img {
    height: 100%;
    aspect-ratio: 1/1;
    border-radius: 50%;
    background-color: aqua;
    overflow: hidden;
    object-fit: contain;
  }
  .danmaku-text {
    height: 1.5em;
    line-height: 1.5em;
    margin: 0;
    max-width: 650px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
