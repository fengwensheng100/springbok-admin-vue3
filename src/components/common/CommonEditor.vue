<template>
  <div>
    <div style="border: 1px solid #ccc; margin-top: 10px">
      <!-- 工具栏 -->
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        :defaultConfig="toolbarConfig"
      />
      <!-- 编辑器 -->
      <Editor
        style="height: 400px; overflow-y: hidden"
        :defaultConfig="editorConfig"
        v-model="html"
        @onChange="onChange"
        @onCreated="onCreated"
      />
    </div>
  </div>
</template>

<script setup name="CommonEditor">
import { uploadImg } from "../../api/common";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { ref, onUnmounted } from "vue";

let emit = defineEmits(["onSuccess"]);
let editor = ref(null);
let toolbarConfig = ref({});
let html = ref("");
let editorConfig = ref({
  placeholder: "请输入内容...",
  // 所有的菜单配置，都要在 MENU_CONF 属性下
  MENU_CONF: {
    uploadImage: {
      customUpload: async (file, insertFn) => {
        uploadImg(file, 1)
          .then((res) => {
            insertFn(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      },
    },
  },
});

function onCreated(e) {
  editor.value = Object.seal(e);
}
function onChange(editor) {
  emit("editorData", html.value);
}

defineExpose({html})
onUnmounted(() => {
  if (editor.value == null) return;
  editor.value.destroy(); // 销毁 editor
});
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
