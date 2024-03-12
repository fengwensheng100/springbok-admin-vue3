<template>
  <div>
    <el-dialog title="库存记录" v-model="dialogTableVisible" width="70%">
      <div>
        <el-form :inline="true" @submit.prevent>
          <el-form-item label="商品名称">
            <el-input
              v-model="query.orderNo"
              placeholder="请输入订单号"
              @keyup.enter="currentChange(1)"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="Search"
              @click="currentChange(1)"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-table
          :data="tableData"
          row-key="stockLineId"
          border
          default-expand-all
          stripe
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="orderNo" label="订单号" width="180">
          </el-table-column>
          <el-table-column
            prop="orderType"
            :formatter="getBillType"
            label="订单类型"
          >
          </el-table-column>
          <el-table-column prop="itemCode" label="商品编码" width="100">
          </el-table-column>
          <el-table-column
            prop="skuCode"
            label="规格编码"
            width="150"
          ></el-table-column>
          <el-table-column prop="itemName" label="商品名称" width="180">
          </el-table-column>
          <el-table-column prop="quantity" label="出入库数量" width="100">
          </el-table-column>
          <el-table-column prop="createdName" label="操作人"> </el-table-column>
          <el-table-column prop="createdTime" label="出入库时间" width="180" :formatter="formatTableColumnDate">
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

<script setup name="StockLineTable">
import { pageStockLine } from "@/api/stock";
import { listDictValueByDictCode } from "@/api/dictValue";
import { ref, onMounted } from "vue";
import { formatTableColumnDate } from "@/utils/dateUtil";

let dialogTableVisible = ref(false);
let query = ref({ size: 10, current: 0, total: 1 });
let tableData = ref([]);
let billTypeOptions = ref([]);

function loadDictValue() {
  listDictValueByDictCode("bill_type")
    .then((res) => {
      billTypeOptions.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
function getBillType(row) {
  let billType = billTypeOptions.value.filter(
    (billType) => billType.value == row.orderType
  );
  if (billType.length > 0) {
    return billType[0].label;
  }
  return "";
}
function loadData() {
  pageStockLine(query.value)
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
function loadStockLine(stockId) {
  query.value.stockId = stockId;
  loadData();
}

defineExpose({ dialogTableVisible, loadStockLine });

onMounted(()=>{
  loadDictValue()
})
</script>

<style scoped></style>
