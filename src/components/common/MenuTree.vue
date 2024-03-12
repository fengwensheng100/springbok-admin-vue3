<template>
  <template v-for="(item, index) in props.menuList" :key="index">
    <el-menu-item
      v-if="!item.childrenList"
      :index="item.routerName"
      @click="addTab(item)"
    >
      <el-icon v-if="item.menuIcon">
        <component :is="item.menuIcon"></component>
      </el-icon>
      <template #title
        ><span>{{ item.menuName }}</span></template
      >
    </el-menu-item>
    <el-sub-menu v-if="item.childrenList" :index="item.sysMenuId + ''">
      <template #title>
        <el-icon v-if="item.menuIcon">
          <component :is="item.menuIcon"></component>
        </el-icon>
        <span>{{ item.menuName }}</span>
      </template>
      <MenuTree :menuList="item.childrenList"></MenuTree>
    </el-sub-menu>
  </template>
</template>

<script setup name="MenuTree">
import MenuTree from "./MenuTree.vue";
import { defineProps } from "vue";
import { useStore } from "@/store";

let store = useStore();
let props = defineProps(["menuList"]);

function addTab(menu) {
  let tab = {
    title: menu.menuName,
    name: menu.routerName,
  };
  store.addTab(tab);
}
</script>
