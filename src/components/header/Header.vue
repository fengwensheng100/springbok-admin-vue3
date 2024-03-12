<template>
  <div>
    <el-row type="flex" class="header-row" justify="space-between">
      <el-col :span="1" type="flex" align="middle">
        <Hamburger></Hamburger>
      </el-col>
      <el-col :span="6">
        <div class="header-avatar-div">
          <div class="nav-item-div">
            <el-icon size="20" @click="fullScreen"><FullScreen /></el-icon>
          </div>
          <div class="nav-item-div">
            <el-icon size="20" @click="showSideDrawer"><Setting /></el-icon>
          </div>
          <div class="avatar-div">
            <el-avatar
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            ></el-avatar>
          </div>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ store.userInfo.nickName
              }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
    <SideDrawer></SideDrawer>
  </div>
</template>

<script setup name="Header">
import Hamburger from "./Hamburger.vue";
import SideDrawer from "./SideDrawer.vue";
import { logout } from "@/api/common";
import router from "@/router";
import { useStore } from "@/store";
import { ElMessage } from "element-plus";
import "@/assets/header.css";

let store = useStore();

function handleCommand(command) {
  if (command == "logout") {
    logout()
      .then((res) => {
        ElMessage.success("退出登录");
        store.clearPersist();
        router.replace({ name: "Login" });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
function isFullScreen() {
  return (
    document.fullscreenElement ||
    document.msFullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    false
  );
}
function fullScreen() {
  if (isFullScreen()) {
    let de = document;
    if (de.exitFullscreen) {
      de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
      de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
      de.webkitCancelFullScreen();
    }
    store.isCollapse = false;
  } else {
    let de = document.documentElement;
    if (de.requestFullscreen) {
      de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
      de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
      de.webkitRequestFullScreen();
    }
    store.isCollapse = true;
  }
}
function showSideDrawer() {
  store.sideDrawerVisible = true;
}
</script>

<style scoped>
.header-avatar-div {
  height: 100%;
  float: right;
  margin-right: 30px;
  display: flex;
  align-items: center;
}
.header-avatar-div .avatar-div {
  padding: 0 10px 0 10px;
}
</style>
