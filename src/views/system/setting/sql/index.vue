<template>
  <div class="sql-minitor-div">
    <iframe :src="url"></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const url = ref(import.meta.env.VITE_BASE_API + "druid");
</script>

<style scoped>
.sql-minitor-div {
  width: 100%;
  height: 100vh;
}
.sql-minitor-div iframe {
  width: 100%;
  height: 100vh;
  border: none;
}
</style>
