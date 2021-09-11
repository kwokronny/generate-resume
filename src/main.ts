import Vue from "vue";
import App from "./App.vue";
import "stylus-shortcut/src/shortcut.styl";
import "./stylus/index.styl";
import draggable from "vuedraggable";
import ElementUI from "element-ui";
import ElementUISaaSExtend from "element-ui-saas-extend";

if (process.env.NODE_ENV !== "production") {
  Vue.component("draggable", draggable);
  Vue.use(ElementUI);
  Vue.use(ElementUISaaSExtend);

  // import * as dayjs from "dayjs";
  // import "dayjs/locale/zh-cn"; // import locale
  // import relativeTime from "dayjs/plugin/relativeTime";
  // dayjs.extend(relativeTime); // use plugin
  // dayjs.locale("zh-cn");

  // if (window) {
  //   window.dayjs = dayjs;
  // }
}

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
