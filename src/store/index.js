import { defineStore } from "pinia";

export const useStore = defineStore("store", {
  actions: {
    addTab(value) {
      let tab = this.tabList.filter((tab) => tab.name === value.name);
      if (tab.length == 0) {
        this.tabList.push(value);
      }
      this.activeTabName = value.name;
    },
    setUserInfo(value) {
      this.userInfo = value;
    },
    clearPersist() {
      this.userInfo = {};
      this.menuList = [];
      this.tabList = [];
      this.activeTabName = [];
    },
  },
  state() {
    return {
      userInfo: {}, // 登录用户信息
      tabList: [], // tab列表
      defaultTab: { title: "首页", name: "index" }, // 默认tab页
      activeTabName: "index", // 当前激活的tab页
      menuList: [], // 用户菜单列表
      routerList: [], // 动态路由列表
      isCollapse: false, // 控制侧边栏展开状态
      sideDrawerVisible: false, // 控制侧边抽屉显示状态
      theme: "light", // 当前主题
      themeMode: "light", // 主题模式，dark：暗黑模式 light：普通模式
      watermarkSwitch: false, // 水印开关
      watermarkText: ["Springbok"], // 水印文本，可多行
    };
  },
  getters: {},
  // 持久化配置
  persist: {
    enabled: true,
    strategies: [
      {
        key: "pinia", // 设置存储的key
        storage: localStorage, // 存储在localStorage
        paths: ["userInfo", "tabList", "activeTabName", "theme", "themeMode", "watermarkSwitch"], // 需要持久化的字段
      },
    ],
  },
});
