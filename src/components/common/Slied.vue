<template>
  <el-dialog v-model="dialogTableVisible" show-close="false" width="0" top="35vh">
    <SlideVerify
    class="silde"
    ref="block"
    slider-text="向右滑动->"
    :accuracy="accuracy"
    @again="onAgain"
    @success="onSuccess"
    @fail="onFail"
    @refresh="onRefresh"
  ></SlideVerify>
  </el-dialog>
  
</template>
 
<script setup name="Slied">
import { ref } from "vue";
import SlideVerify from "vue3-slide-verify";
import "vue3-slide-verify/dist/style.css";

let emit = defineEmits(["onSuccess"]);
let dialogTableVisible = ref(false);
let block = ref();

function onAgain() {
  block.value?.refresh();
}
function onSuccess() {
  dialogTableVisible.value = false;
  emit("onSuccess");
}
function onFail() {}
function onRefresh() {}
function showSlied() {
  dialogTableVisible.value = true;
  onAgain();
}

defineExpose({ showSlied });
</script>

<style scoped>
.silde {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>