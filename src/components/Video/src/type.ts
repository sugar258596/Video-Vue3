type OneRequired<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;

/**
 * autoplay - muted | play | any
 * muted:  静音播放
 * play:  播放
 * any:  先执行play，再执行muted
 */

type autoplay = "muted" | "play" | "any";

/**
 *  预加载 - auto | metadata | none
 * auto:  立即下载视频资源（如果浏览器支持的话），有些手机浏览器节省带宽，会禁止提前下载。
 * metadata: 预加载视频的元数据
 * none: 不预加载视频
 */
type Preload = "auto" | "metadata" | "none";

type Sources = {
  src: string;
  type: string;
};

/**
 * ControlBarBtn 是一个联合类型，描述了控制栏中可能存在的所有按钮类型。
 */
type ControlBarBtn =
  /**
   * 播放/暂停切换按钮
   */
  | "PlayToggle"
  /**
   * 音量面板，包括音量条和静音按钮
   */
  | "VolumePanel"
  /**
   * 当前播放时间显示
   */
  | "CurrentTimeDisplay"
  /**
   * 时间分隔符，一般用于当前时间和总时间之间
   */
  | "TimeDivider"
  /**
   * 总时长显示
   */
  | "DurationDisplay"
  /**
   * 播放进度控制，包括拖动条
   */
  | "ProgressControl"
  /**
   * 拖动条，用于调整播放进度
   */
  | "SeekBar"
  /**
   * 加载进度条，显示缓冲进度
   */
  | "LoadProgressBar"
  /**
   * 鼠标悬停时间显示，显示鼠标当前位置对应的时间
   */
  | "MouseTimeDisplay"
  /**
   * 播放进度条，显示已播放的进度
   */
  | "PlayProgressBar"
  /**
   * 直播显示，指示当前播放的是直播内容
   */
  | "LiveDisplay"
  /**
   * 跳转到实时按钮，用于直播中跳转到最新的实时进度
   */
  | "SeekToLive"
  /**
   * 剩余时间显示，显示剩余的播放时间
   */
  | "RemainingTimeDisplay"
  /**
   * 自定义控制间隔器，用于调整控制栏布局
   */
  | "CustomControlSpacer"
  /**
   * 播放速度菜单按钮，用于选择播放速度
   */
  | "PlaybackRateMenuButton"
  /**
   * 章节按钮，用于跳转到视频的不同章节
   */
  | "ChaptersButton"
  /**
   * 描述按钮，用于选择视频描述轨道
   */
  | "DescriptionsButton"
  /**
   * 字幕按钮，用于选择字幕轨道
   */
  | "SubtitlesButton"
  /**
   * 标题按钮，用于选择标题轨道
   */
  | "CaptionsButton"
  /**
   * 字幕和标题按钮，用于选择字幕和标题轨道
   */
  | "SubsCapsButton"
  /**
   * 音轨按钮，用于选择音频轨道
   */
  | "AudioTrackButton"
  /**
   * 画中画切换按钮，用于启用或禁用画中画模式
   */
  | "PictureInPictureToggle"
  /**
   * 全屏切换按钮，用于启用或退出全屏模式
   */
  | "FullscreenToggle";

type Children = {
  name: ControlBarBtn | string;
  [key: string]: any;
};

export type ControlBar = {
  [key in ControlBarBtn]?: boolean | object;
} & {
  children: Children[];
};

export type Viode = {
  // 是否自动播放
  autoplay: boolean | autoplay;

  // 是否显示控制条 - true
  controls: boolean;

  // 视频的宽度 - 1280px
  width: string;

  // 视频的高度 - 720px
  height: string;

  // 是否循环播放 - false
  loop: boolean;

  // 是否静音播放 - false
  muted: boolean;

  // 视频地址 - ''
  src: string;

  // 视频类型 - video/mp4
  type: string;

  // 视频封面地址 - ''
  poster: string;

  // 播放速度
  playbackRates: number[];

  // 提前下载视频 - auto
  preload: Preload;

  //视频来源，由对象组成的数组，相当于video 元素拥有多个 scource 元素。对象应该拥有src和type两个属性。
  sources: Sources[];

  // 视频的宽高比 - 16:9 (设置后，宽高比会自动调整)
  aspectRatio: string;

  //是否允许使用video的data-setup属性启动播放器
  // DTO:videojs.options.autoSetup = false 全局设置才能生效。
  autoSetup: boolean;

  // 是否自适应
  fluid: boolean;

  // 多少毫秒用户不操作，播放器将进入非活动状态。
  inactivityTimeout: number;

  // 语言
  language: string;

  // 可以使用的语言列表
  languages: object;

  // 是否允许播放器使用新的直播ui界面 - false
  liveui: boolean;

  //控制UI元素是否可以有title属性 - true
  noUITitleAttributes: boolean;

  controlBar: ControlBar;
};

export type ViodeOption = Partial<Viode>;
