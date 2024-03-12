<template>
  <el-drawer
    class="side-drawer"
    v-model="store.sideDrawerVisible"
    :show-close="false"
    size="13%"
  >
    <template #header="{ titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">主题设置</h4>
    </template>
    <div class="side-drawer-item-div">
      <el-text>主题</el-text>
      <ul class="theme-ul">
        <el-tooltip content="蓝色(默认)" placement="top">
          <li
            style="background-color: #409eff"
            @click="changeTheme('default')"
          ></li>
        </el-tooltip>
        <el-tooltip content="金黄" placement="top">
          <li
            style="background-color: #ffb13c"
            @click="changeTheme('auratus')"
          ></li>
        </el-tooltip>
        <el-tooltip content="橘黄" placement="top">
          <li
            style="background-color: #fc6e3f"
            @click="changeTheme('orange')"
          ></li>
        </el-tooltip>
        <el-tooltip content="青色" placement="top">
          <li
            style="background-color: #04c9b5"
            @click="changeTheme('cyan')"
          ></li>
        </el-tooltip>
        <el-tooltip content="深蓝" placement="top">
          <li
            style="background-color: #2b4edb"
            @click="changeTheme('blue')"
          ></li>
        </el-tooltip>
        <el-tooltip content="紫色" placement="top">
          <li
            style="background-color: #722ed1"
            @click="changeTheme('purple')"
          ></li>
        </el-tooltip>
      </ul>
    </div>
    <div class="side-drawer-item-div">
      <el-text>暗夜模式</el-text>
      <el-switch
        v-model="store.themeMode"
        active-value="dark"
        inactive-value="light"
        @change="themeMode"
      />
    </div>
    <div class="side-drawer-item-div">
      <el-text>开启水印</el-text>
      <el-switch v-model="watermarkSwitch" @click="enableWatermark($event)" />
    </div>
  </el-drawer>
</template>

<script setup name="SideDrawer">
import { ref } from "vue";
import { ElDrawer } from "element-plus";
import { useStore } from "@/store";
import colorUtil from "@/utils/colorUtil";

let store = useStore();

// 启用水印
let watermarkSwitch = ref(store.watermarkSwitch);
function enableWatermark() {
  store.watermarkSwitch = !store.watermarkSwitch;
}

function themeMode(mode) {
  document.documentElement.className = mode;
  store.themeMode = mode;
}

let themeList = [
  { name: "default", color: [["primary", "#409eff"]] },
  { name: "auratus", color: [["primary", "#ffb13c"]] },
  { name: "orange", color: [["primary", "#fc6e3f"]] },
  { name: "cyan", color: [["primary", "#04c9b5"]] },
  { name: "blue", color: [["primary", "#2b4edb"]] },
  { name: "purple", color: [["primary", "#722ed1"]] },
];
function changeTheme(themeName) {
  let theme = themeList.filter((theme) => theme.name == themeName);
  if (theme.length > 0) {
    store.theme = themeName;
    let _namespace = "el";
    theme[0].color.forEach((colorItem) => {
      setPropertyColor(`--${_namespace}-color-${colorItem[0]}`, colorItem[1]);
      themeColorGradient(
        `--${_namespace}-color-${colorItem[0]}-light-#level#`,
        "lighten",
        colorItem[1]
      );
      setPropertyColor(
        `--${_namespace}-color-${colorItem[0]}-dark-2`,
        colorItem[1],
        "darken"
      );
    });
  }
}
/**
 * 将css3变量设置到document中方便全局调用
 */
function setPropertyColor(varName, color, funName, level) {
  level = level ? level : 0;
  funName = funName ? funName : "lighten";
  document.documentElement.style.setProperty(
    varName,
    colorUtil[funName](color, level / 10)
  );
}
/**
 * 生成主色的其余渐变色并修改对应CSS3变量值
 */
function themeColorGradient(varName, funName, themeColor, themeLevel) {
  themeColor = themeColor ? themeColor : "#409eff";
  themeLevel = themeLevel ? themeLevel : [3, 5, 7, 8, 9];

  themeLevel.forEach(function (level) {
    setPropertyColor(
      varName.replace("#level#", level),
      themeColor,
      funName,
      level
    );
  });
}
</script>

<style scoped>
.side-drawer-item-div {
  display: flex;
  justify-content: space-between;
  padding: 0 0 5px 0;
}
.theme-ul {
  width: 140px;
  list-style-type: none;
  justify-content: space-between;
}
.theme-ul li {
  width: 30px;
  height: 30px;
  float: left;
  background-color: aquamarine;
  margin: 5px;
  cursor: pointer;
  border-radius: 5px;
}
</style>
