<template>
  <div>
    <el-dialog title="日志详情" width="70%" v-model="logDetailPropVisible">
      <el-descriptions direction="horizontal" :column="1" border>
        <el-descriptions-item label="日志标题">{{
          log.title
        }}</el-descriptions-item>
        <el-descriptions-item label="请求状态">
          <el-tag
            :type="log.status === 1 ? 'primary' : 'danger'"
            >{{
              log.status === 1 ? "正常" : "错误"
            }}</el-tag
          >
        </el-descriptions-item>
        <el-descriptions-item label="请求时间">{{
          formatYYYYMMDDhhmmss(log.requestTime)
        }}</el-descriptions-item>
        <el-descriptions-item label="请求耗时"
          >{{ log.requestSpend }}ms</el-descriptions-item
        >
        <el-descriptions-item label="请求IP">{{
          log.requestIp
        }}</el-descriptions-item>
        <el-descriptions-item label="请求参数">{{
          log.requestParam
        }}</el-descriptions-item>
        <el-descriptions-item label="错误信息">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 12 }"
            v-model="log.errorMsg"
          >
          </el-input>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup name="LogDetail">
import { ref } from "vue";
import { formatYYYYMMDDhhmmss } from "@/utils/dateUtil";
let log = ref({});
let logDetailPropVisible = ref(false);
defineExpose({ log, logDetailPropVisible });
</script>

<style scoped>
</style>