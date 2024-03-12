<template>
  <div>
    <el-divider></el-divider>
    <div>
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="日志标题">
          <el-input
            v-model="query.title"
            placeholder="请输入日志标题"
            @keyup.enter="currentChange(1)"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="currentChange(1)"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="tableData"
        row-key="sysLogId"
        border
        default-expand-all
        stripe
      >
        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column prop="title" label="日志标题" width="180">
        </el-table-column>
        <el-table-column
          prop="requestUrl"
          label="请求地址"
          sortable
          width="180"
        >
        </el-table-column>
        <el-table-column prop="status" label="请求状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'primary' : 'danger'">{{
              scope.row.status === 1 ? "正常" : "错误"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="requestTime"
          label="请求时间"
          :formatter="formatTableColumnDate"
        >
        </el-table-column>
        <el-table-column prop="requestSpend" label="请求耗时">
          <template #default="scope">{{ scope.row.requestSpend }}ms</template>
        </el-table-column>
        <el-table-column prop="requestIp" label="请求IP"> </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" icon="View" @click="handleView(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" class="row-bg" justify="end">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="query.current"
          :page-size="query.size"
          :total="query.total"
          @current-change="currentChange"
        >
        </el-pagination>
      </el-row>
    </div>
    <LogDetail ref="detail"></LogDetail>
  </div>
</template>

<script setup name="Log">
import { ref, onMounted } from "vue";
import { pageSysLog } from "@/api/log";
import LogDetail from "@/components/common/LogDetail.vue";
import { formatTableColumnDate } from "@/utils/dateUtil";

let loading = ref(true);
let query = ref({ size: 10, current: 0, total: 1 });
let tableData = ref([]);
let detail = ref();

function currentChange(current) {
  query.value.current = current;
  loadData();
}
function loadData() {
  pageSysLog(query.value)
    .then((res) => {
      query.value.size = res.data.size;
      query.value.current = res.data.current;
      query.value.total = res.data.total;
      tableData.value = res.data.records;
      loading.value = false;
    })
    .catch((err) => {
      console.log(err);
    });
}
function handleView(row) {
  detail.value.logDetailPropVisible = true;
  detail.value.log = row;
}

onMounted(() => {
  loadData();
});
</script>

<style>
.dict-code-tag:hover {
  cursor: pointer;
  text-decoration: underline;
}
</style>
