<template>
  <div>
    <el-dialog title="规格列表" v-model="dialogTableVisible">
      <div>
        <el-form :inline="true" @submit.prevent>
          <el-form-item label="属性名称">
            <el-input
              v-model="query.specName"
              placeholder="请输入属性名称"
              size="small"
              @keyup.enter="currentChange(1)"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="currentChange(1)"
              size="small"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="success" size="small" @click="submitForm"
              ><i class="el-icon-check"></i> 保存
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-table
          ref="specTable"
          :data="tableData"
          row-key="specId"
          border
          default-expand-all
          size="small"
          stripe
          @select="handleSelection"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号"> </el-table-column>
          <el-table-column prop="specName" label="属性名称" width="180">
          </el-table-column>
          <el-table-column prop="skuStr" label="规格项" width="180">
          </el-table-column>
          <el-table-column prop="remark" label="备注"> </el-table-column>
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
    </el-dialog>
  </div>
</template>

<script setup name="SpecTable">
import { pageSpec, selectSpecByIds } from "../../api/spec";
import { ref, onMounted } from "vue";

let emit = defineEmits(["onClick"]);
let dialogTableVisible = ref(false);
let tableData = ref([]);
let query = ref({ size: 10, current: 0, total: 1 });
let selectionSpecList = ref([]);

function loadData() {
  pageSpec(query.value)
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
function currentChange(current) {
  query.value.current = current;
  loadData();
}
function handleSelection(selection, row) {
  var index = selectionSpecList.value.findIndex((item) => {
    return item.specId == row.specId;
  });
  if (index == -1) {
    selectionSpecList.value.push(row);
  } else {
    selectionSpecList.value.splice(index, 1);
  }
}
function submitForm() {
  let ids = selectionSpecList.value.map((p) => p.specId).join(",");
  selectSpecByIds(ids)
    .then((res) => {
      emit("onClick", res.data)
    })
    .catch((err) => {
      console.log(err);
    });
}

defineExpose({dialogTableVisible})
onMounted(() => {
  loadData();
});
</script>

<style scoped>
</style>