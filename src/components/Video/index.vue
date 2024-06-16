<template>
  <video ref="video" class="video-js"></video>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted } from "vue";
import mp4Url from "../../assets/IronMan.mp4";
import OIP from "../../assets/OIP.jpg";
import videojs from "video.js";
import zhCN from "video.js/dist/lang/zh-CN.json";
import { TouchOverlay, CustomButton } from "./TouchOverlay";
import { ViodeOption } from "./type";

videojs.addLanguage("zh-CN", zhCN);

defineOptions({
  name: "Basievideo",
});
const video = ref(null);
const videoInstance = shallowRef(); //提高性能
const potions: ViodeOption = {
  sources: [
    {
      type: "video/mp4",
      src: mp4Url,
    },
  ],
  autoplay: "any", //是否自动播放
  loop: false, //是否循环播放
  controls: true, //控制器
  preload: "metadata", //是否预加载
  language: "zh-CN", //显示的语言 中文
  poster: OIP, //封面图
  playbackRates: [0.5, 1, 1.5, 2], //播放速度
  fluid: true,
  // 设置控制条组件
  controlBar: {
    children: [
      {
        name: "CustomButton",
        title: "上一个",
        svg: "vjs-icon-zuo",
        fn: "previous",
      },
      { name: "PlayToggle" }, // 播放/暂停按钮
      {
        name: "CustomButton",
        title: "下一个",
        svg: "vjs-icon-you",
        fn: "next",
      },
      { name: "ProgressControl" }, // 播放进度条
      { name: "currentTimeDisplay" }, // 当前播放时间
      { name: "timeDivider" }, // 分隔符
      { name: "DurationDisplay" }, // 视频总时间
      { name: "PlaybackRateMenuButton" }, // 倍数按钮
      { name: "VolumePanel", inline: false }, // 音量按钮
      { name: "PictureInPictureToggle" }, // 小窗按钮
      { name: "FullscreenToggle" }, // 全屏按钮
    ],
  },
};
videojs.hook("beforesetup", (_el: Element, options: any) => {
  // 注册自定义按钮组件
  videojs.registerComponent("CustomButton", CustomButton);
  videojs.registerComponent("TouchOverlay", TouchOverlay as any);
  return options;
});

onMounted(() => {
  initVideo();

  if (!video.value) return;
});

/**
 * 初始化video
 */
const initVideo = () => {
  if (!video.value) return;
  // videojs第一个参数可以使video标签的id或者目标标签元素，第二个参数为配置项。
  videoInstance.value = videojs(video.value, potions);

  videoInstance.value.on("previous", () => {
    console.log("previous 上一集");
  });

  videoInstance.value.on("next", () => {
    console.log("next 下一集");
  });

  // ready
  videoInstance.value.on("ready", () => {
    videoInstance.value.volume(0);
    getComponent();
  });
  // 监听播放事件
  videoInstance.value.on("play", () => {
    console.log("play 开始播放");
  });

  videoInstance.value.on("ended", () => {
    console.log("ended 播放结束");
  });

  // 监听暂停事件
  videoInstance.value.on("pause", () => {
    console.log("pause 暂停播放");
  });

  // 监听播放结束事件
  videoInstance.value.on("ended", () => {
    console.log("ended 播放结束");
  });

  // 播放位置改变的时候触发
  videoInstance.value.on("timeupdate", () => {
    // console.log('timeupdate 视频断点');
  });

  // 监听操作声音事件
  videoInstance.value.on("volumechange", () => {
    console.log("volumechange 音量改变");
  });

  // 监听浏览器获取数据
  videoInstance.value.on("suspend", () => {
    console.log("suspend 浏览器获取数据");
  });

  // 监听浏览器获取数据失败
  videoInstance.value.on("stalled", () => {
    console.log("stalled 浏览器获取数据失败");
  });

  // 视频跳到一个新的时间都会触发
  videoInstance.value.on("seeking", () => {
    console.log("seeking 视频跳到一个新的时间都会触发");
  });

  // 视频播放结束，跳转到一个新的地方开始播放的时候触发
  videoInstance.value.on("seeked", () => {
    console.log("seeked 视频播放结束，跳转到一个新的地方开始播放的时候触发");
  });

  // 监听播放错误事件
  videoInstance.value.on("error", () => {
    console.log("error 播放错误");
  });

  // 点击全屏
  videoInstance.value.on("fullscreenchange", () => {
    console.log("fullscreenchange 点击全屏");
  });
};

// 获取控件
const getComponent = () => {
  const touchOptions = {};
  const properIndex = videoInstance.value
    .children()
    .indexOf(videoInstance.value.getChild("BigPlayButton"));
  videoInstance.value.addChild("TouchOverlay", touchOptions, properIndex);
};
</script>
<style scoped lang="scss">
:deep(.video-js) {
  .vjs-current-time {
    display: block;
  }

  .vjs-time-control {
    display: block;
  }

  .vjs-time-control {
    min-width: 0;
    padding-left: 0.2em;
    padding-right: 0.2em;
  }

  .my-custom-button {
    background-color: #007bff;
    color: #fff;
  }

  .my-custom-button:hover {
    background-color: #0056b3;
  }

  .vjs-touch-overlay {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
    pointer-events: none;
  }

  &.vjs-has-started .vjs-touch-overlay {
    pointer-events: auto;
  }

  .vjs-touch-seek-note {
    display: none;
    justify-content: center;
    align-items: center;
    margin: auto;
    padding: 10px 15px;
    border-radius: 2px;
    background: rgba(#000, 0.3);
    color: #fff;
    font-size: 16px;
  }

  .vjs-touch-overlay.vjs-touch-active.vjs-touch-moving .vjs-touch-seek-note {
    display: flex;
  }
  .vjs-zuo-svg {
    width: 100%;
    height: 100%;
    background: url(../../../assets/zuo.svg) no-repeat center center;
  }
  .vjs-you-sgv {
    width: 100%;
    height: 100%;
    background: url(../../../assets/you.svg) no-repeat center center;
  }
}
</style>
