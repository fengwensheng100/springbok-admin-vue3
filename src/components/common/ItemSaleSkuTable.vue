<template>
  <div>
    <el-dialog title="商品列表" width="60%" v-model="dialogTableVisible">
      <div>
        <el-form :inline="true" @submit.prevent>
          <el-form-item label="商品名称">
            <el-input
              v-model="query.itemName"
              placeholder="请输入商品名称"
              @keyup.enter="currentChange(1)"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="currentChange(1)"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="success" icon="Check" @click="submitForm"
              >保存
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-table
          ref="itemTable"
          :data="tableData"
          row-key="itemSaleSkuId"
          border
          default-expand-all
          stripe
          @select="handleSelection"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号" width="60"> </el-table-column>
          <el-table-column prop="itemCode" label="商品编码" width="150">
          </el-table-column>
          <el-table-column prop="itemName" label="商品名称" width="400">
          </el-table-column>
          <el-table-column prop="spec" label="规格" width="300">
          </el-table-column>
          <el-table-column prop="quantity" label="当前库存">
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
    </el-dialog>
  </div>
</template>

<script setup name="ItemSaleSkuTable">
import { pageItemSaleSku } from "../../api/itemSaleSku";
import { ref, onMounted } from "vue";

let emit = defineEmits(["onClick"]);
let dialogTableVisible = ref(false);
let itemTable = ref();
let query = ref({ size: 10, current: 0, total: 1 });
let selectionItems = ref([]);
let tableData = ref([])

function loadData() {
  pageItemSaleSku(query.value)
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
  selectionItems.value = selection;
}
function submitForm() {
  itemTable.value.clearSelection();
  emit("onClick", selectionItems.value);
}

defineExpose({dialogTableVisible});
onMounted(() => {
  loadData();
});
</script>

<style scoped>
</style>