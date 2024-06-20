import videoModel from "./Video/index.vue";
import dammaku from "./danmaku/index.vue";
import { withInstall } from "@/uitls/index";

export const BasicVideo = withInstall(videoModel);
export const BasicDanmaku = withInstall(dammaku);
