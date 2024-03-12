<template>
  <div>
    <div v-show="!showEdit">
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="商品名称">
          <el-input
            v-model="query.itemName"
            placeholder="请输入商品名称或商品编码"
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
    <div v-show="!showEdit">
      <el-table
        :data="tableData"
        row-key="stockId"
        border
        default-expand-all
        stripe
      >
        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column
          prop="itemCode"
          label="商品编码"
          sortable
          width="120"
        ></el-table-column>
        <el-table-column
          prop="skuCode"
          label="规格编码"
          sortable
          width="150"
        ></el-table-column>
        <el-table-column
          prop="itemName"
          label="商品名称"
          width="150"
        ></el-table-column>
        <el-table-column prop="spec" label="规格" width="150"></el-table-column>
        <el-table-column
          prop="quantity"
          label="剩余库存"
          sortable
          width="120"
        ></el-table-column>
        <el-table-column prop="createdName" label="创建人"> </el-table-column>
        <el-table-column
          prop="createdTime"
          label="创建时间"
          :formatter="formatTableColumnDate"
        >
        </el-table-column>
        <el-table-column prop="updatedName" label="修改人"> </el-table-column>
        <el-table-column label="修改时间" prop="updatedTime" :formatter="formatTableColumnDate">
        </el-table-column>
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

    <StockLineTable ref="stockLineTable"></StockLineTable>
  </div>
</template>

<script setup name="Stock">
import StockLineTable from "@/components/common/StockLineTable.vue";
import { pageStock } from "@/api/stock";
import { ref, onMounted } from "vue";
import { formatTableColumnDate } from "@/utils/dateUtil";

let stockLineTable = ref();
let showEdit = ref(false);
let query = ref({ size: 10, current: 0, total: 1 });
let tableData = ref([]);

function currentChange(current) {
  query.value.current = current;
  loadData();
}
function loadData() {
  pageStock(query.value)
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
function handleView(row) {
  stockLineTable.value.dialogTableVisible = true;
  stockLineTable.value.loadStockLine(row.stockId);
}

onMounted(() => {
  loadData();
});
</script>

<style></style>
