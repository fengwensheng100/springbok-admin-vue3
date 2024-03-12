<template>
  <div class="hamburger-div">
    <div class="nav-item-div">
      <el-icon size="20" @click="handleCollapse">
        <Fold v-show="!store.isCollapse" />
        <Expand v-show="store.isCollapse" />
      </el-icon>
    </div>
  </div>
</template>

<script setup name="Hamburger">
import { useStore } from "@/store";
import '@/assets/header.css'

let store = useStore();

function handleCollapse() {
  store.isCollapse = !store.isCollapse;
}
</script>

<style scoped>
.hamburger-div {
  height: 50px;
  display: flex;
  align-items: center;
}
</style>