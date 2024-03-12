<template>
  <div>
    <el-container>
      <el-aside
        :width="store.isCollapse ? '64px' : '200px'"
        class="el-aside-menu"
      >
        <el-scrollbar>
          <el-menu
            style="border-right-width: 0"
            class="aside-menu"
            :collapse="store.isCollapse"
            background-color="#303133"
            text-color="#fff"
            :default-active="menuActiveIndex"
            router
          >
            <MenuTree :menuList="store.menuList"></MenuTree>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <el-header class="app-header">
          <Header></Header>
        </el-header>
        <ul
          v-show="tabMenuVisible"
          :style="{ left: tabMenuLeft + 'px', top: tabMenuTop + 'px' }"
          class="contextmenu"
        >
          <li @click="removeTab(currentContextTabName, 'all')">关闭所有</li>
          <li @click="removeTab(currentContextTabName, 'other')">关闭其他</li>
          <li @click="removeTab(currentContextTabName, 'left')">关闭左边</li>
          <li @click="removeTab(currentContextTabName, 'right')">关闭右边</li>
        </ul>
        <el-tabs
          class="el-tabs-nav"
          v-model="store.activeTabName"
          type="card"
          closable
          @tab-remove="
            (val) => {
              removeTab(val, 'current');
            }
          "
          @tab-change="tabChange"
          @contextmenu.prevent.native="openTabMenu($event)"
        >
          <el-tab-pane
            v-for="tab in store.tabList"
            :key="tab.name"
            :label="tab.title"
            :name="tab.name"
          >
          </el-tab-pane>
        </el-tabs>
        <el-watermark
          :font="{ fontSize: store.watermarkSwitch ? '16' : '1' }"
          :content="store.watermarkText"
        >
          <el-main>
            <el-scrollbar style="height: 100%">
              <router-view></router-view>
            </el-scrollbar>
          </el-main>
        </el-watermark>
      </el-container>
    </el-container>
  </div>
</template>

<script setup name="Main">
import Header from "./header/Header.vue";
import MenuTree from "./common/MenuTree.vue";
import {useRoute} from 'vue-router'
import { ref, onMounted, watch } from "vue";
import router from "@/router";
import { useStore } from "@/store";

let route = useRoute()
let store = useStore();
let tabMenuVisible = ref(false);
let tabMenuLeft = ref();
let tabMenuTop = ref();
let currentContextTabName = ref();
let menuActiveIndex = ref();

function openTabMenu(e) {
  if (e.srcElement.id) {
    currentContextTabName.value = e.srcElement.id.split("-")[1];
    tabMenuVisible.value = true;
    tabMenuLeft.value = e.clientX;
    tabMenuTop.value = e.clientY + 10;
  }
}
function tabChange(tabName) {
  if (tabName == router.currentRoute.name) {
    return;
  }
  router.replace({ name: tabName });
}
function removeTab(targetName, type) {
  let tabs = store.tabList;
  let activeName = targetName;
  if (type == "current") {
    if (store.activeTabName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.name === targetName) {
          let nextTab = tabs[index + 1] ? tabs[index + 1] : tabs[index - 1];
          if (nextTab) {
            activeName = nextTab.name;
            return;
          }
        }
      });
    } else {
      activeName = store.activeTabName;
    }
    tabs = tabs.filter((tab) => tab.name !== targetName);
  } else if (type == "all") {
    tabs = [];
  } else if (type == "other") {
    tabs = tabs.filter((tab) => tab.name == targetName);
  } else if (type == "left") {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        tabs = tabs.slice(index);
      }
    });
  } else if (type == "right") {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        tabs = tabs.slice(0, index + 1);
      }
    });
  }
  router.replace({
    name: activeName,
  });
  store.activeTabName = activeName;
  store.tabList = tabs;
  if (tabs.length === 0) {
    router.replace({
      name: store.defaultTab.name,
    });
    store.addTab(store.defaultTab);
  }
}

function closeTabMenu() {
  tabMenuVisible.value = false;
}
watch(tabMenuVisible, (newValue, oldValue) => {
  if (tabMenuVisible.value) {
    document.body.addEventListener("click", closeTabMenu);
  } else {
    document.body.removeEventListener("click", closeTabMenu);
  }
});
onMounted(() => {
  menuActiveIndex.value = route.name
});

watch(route, () => {
  menuActiveIndex.value = route.name
});
</script>

<style scoped>
.el-main {
  padding-top: 10px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
  height: calc(100vh - 116px);
}
.app-header {
  padding: 0px;
  height: 50px;
}
.el-aside-menu {
  height: 100vh;
  background-color: #303133;
}
.el-tabs-nav {
  height: 40px;
}
.contextmenu {
  width: 100px;
  margin: 0;
  border: 1px solid #ccc;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.2);
}
.contextmenu li {
  margin: 0;
  padding: 7px 16px;
}
.contextmenu li:hover {
  background: #f2f2f2;
  cursor: pointer;
}
/* tabs */
::v-deep().el-tabs--card > .el-tabs__header .el-tabs__nav {
  border-radius: 0;
  border-top: 0;
}
::v-deep().el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom-color: var(--el-color-primary);
  border-bottom: 2px solid var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}
::v-deep().el-tabs--card > .el-tabs__header {
  border-top: 1px solid var(--el-border-color-light);
}
</style>
