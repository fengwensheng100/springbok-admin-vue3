<template>
  <div>
    <el-table
      :data="tableData"
      row-key="testId"
      border
      stripe
    >
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column prop="testId" label="主键id" sortable> </el-table-column>
      <el-table-column prop="testCol1" label="字段1"> </el-table-column>
      <el-table-column prop="testCol2" label="字段2"> </el-table-column>
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
</template>

<script setup name="User">
import { pageTest } from "@/api/test";
import { ref, onMounted } from "vue";

let query = ref({ size: 10, current: 0, total: 1 });
let tableData = ref([]);

function currentChange(current) {
  query.value.current = current;
  loadData();
}
function loadData() {
  pageTest(query.value)
    .then((res) => {
      query.value.size = res.data.size;
      query.value.current = res.data.current;
      query.value.total = res.data.total;
      tableData.value = res.data.records;
    })
    .catch((err) => {
      console.log(err);
    });
}

onMounted(() => {
  loadData();
});
</script>

<style></style>
