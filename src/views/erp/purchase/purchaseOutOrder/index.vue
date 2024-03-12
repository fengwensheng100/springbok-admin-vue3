<template>
  <div>
    <div>
      <el-row v-show="!showEdit">
        <el-button type="primary" icon="Plus" @click="handleCreate"
          >新增
        </el-button>
      </el-row>
      <el-row v-show="showEdit">
        <el-button type="primary" icon="Back" @click="backTable">
          返回
        </el-button>
        <el-button
          v-show="isEdit"
          type="success"
          icon="Check"
          @click="submitForm"
          >保存
        </el-button>
      </el-row>
    </div>
    <el-divider></el-divider>
    <div v-show="!showEdit">
      <el-form :inline="true">
        <el-form-item label="订单状态">
          <el-select
            v-model="query.orderStatus"
            clearable
            placeholder="请选择"
            style="width: 120px"
          >
            <el-option
              v-for="option in orderStatusOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            >
            </el-option>
          </el-select>
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
        row-key="purchaseOutOrderId"
        border
        default-expand-all
        stripe
      >
        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column
          prop="orderNo"
          label="订单号"
          sortable
          width="180"
        ></el-table-column>
        <el-table-column
          prop="orderAmount"
          label="订单金额"
          sortable
          width="150"
        ></el-table-column>
        <el-table-column
          prop="orderStatus"
          :formatter="getOrderStatus"
          label="状态"
        >
          <template #default="scope">
            <el-tag
              :type="scope.row.orderStatus === 1 ? 'primary' : 'success'"
              disable-transitions
              >{{ getOrderStatus(scope.row) }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          width="150"
        ></el-table-column>
        <el-table-column prop="createdName" label="创建人"> </el-table-column>
        <el-table-column label="创建时间" prop="createdTime" :formatter="formatTableColumnDate">
        </el-table-column>
        <el-table-column prop="updatedName" label="修改人"> </el-table-column>
        <el-table-column label="修改时间" prop="updatedTime" :formatter="formatTableColumnDate">
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button
              size="small"
              icon="View"
              v-show="scope.row.orderStatus > 1"
              @click="handleView(scope.row)"
              >查看</el-button
            >
            <el-button
              size="small"
              icon="Check"
              v-show="scope.row.orderStatus == 1"
              @click="handleAudit(scope.row)"
              >审核</el-button
            >
            <el-button
              size="small"
              icon="Edit"
              v-show="scope.row.orderStatus == 1"
              @click="handleUpdate(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              icon="Delete"
              type="danger"
              v-show="scope.row.orderStatus == 1"
              @click="handleDelete(scope.row)"
              >删除</el-button
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

    <div v-show="showEdit">
      <el-tabs type="border-card">
        <el-tab-pane label="基本信息">
          <el-form
            ref="formValidate"
            :rules="rules"
            :model="form"
            label-width="80px"
          >
            <el-row>
              <el-col :span="5">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="form.remark"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-button type="primary" @click="addTableLine"
                  >添加明细</el-button
                >
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-table
                  :data="form.purchaseOutOrderLineList"
                  row-key="skuCode"
                  style="width: 100%"
                >
                  <el-table-column type="index" label="序号" width="60">
                  </el-table-column>
                  <el-table-column prop="itemCode" label="商品编码" width="150">
                    <template #default="scope">
                      <el-input
                        size="small"
                        prop="itemCode"
                        v-model="scope.row.itemCode"
                        @keyup.enter="showItemTable(scope.row)"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="itemName" label="商品名称" width="200">
                  </el-table-column>
                  <el-table-column prop="spec" label="规格" width="200">
                  </el-table-column>
                  <el-table-column prop="quantity" label="数量" width="100">
                    <template #default="scope">
                      <el-input
                        v-model="scope.row.quantity"
                        size="small"
                        maxlength="5"
                        type="number"
                        @input="currentTableChange(scope.row)"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="price" label="单价" width="100">
                    <template #default="scope">
                      <el-input
                        v-model="scope.row.price"
                        size="small"
                        maxlength="5"
                        type="number"
                        @input="currentTableChange(scope.row)"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="amount" label="总金额" width="150">
                    <template #default="scope">
                      {{ scope.row.amount }}
                    </template>
                  </el-table-column>
                  <el-table-column width="60">
                    <template #default="scope">
                      <el-button
                        size="small"
                        type="danger"
                        @click="handleDeleteLine(scope.$index)"
                        >删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>

    <ItemSaleSkuTable
      ref="itemSaleSkuTable"
      @onClick="handleClickItemSaleSku"
    ></ItemSaleSkuTable>
  </div>
</template>

<script setup name="PurchaseOutOrder">
import {
  pagePurchaseOutOrder,
  selectPurchaseOutOrderById,
  addPurchaseOutOrder,
  updatePurchaseOutOrder,
  deletePurchaseOutOrder,
  auditPurchaseOutOrder,
} from "@/api/purchaseOutOrder";
import { ElMessageBox } from "element-plus";
import { ElMessage } from "element-plus";
import { ref, onMounted } from "vue";
import ItemSaleSkuTable from "@/components/common/ItemSaleSkuTable.vue";
import { formatTableColumnDate } from "@/utils/dateUtil";

let itemSaleSkuTable = ref();
let formValidate = ref();
let showEdit = ref(false);
let isEdit = ref(true);
let query = ref({ size: 10, current: 0, total: 1 });
let form = ref({ purchaseOutOrderLineList: [] });
let tableData = ref([]);
let orderStatusOptions = ref([
  {
    value: 1,
    label: "制单",
  },
  {
    value: 2,
    label: "审核",
  },
]);

function addTableLine() {
  form.value.purchaseOutOrderLineList.push({
    quantity: 0,
    price: 0,
    amount: 0,
  });
}
function currentTableChange(row) {
  row.amount = row.quantity * row.price;
}
function showItemTable(row) {
  itemSaleSkuTable.value.dialogTableVisible = true;
}
function getOrderStatus(row) {
  if (row.orderStatus == 1) {
    return "制单";
  } else if (row.orderStatus == 2) {
    return "审核";
  }
}
function currentChange(current) {
  query.value.current = current;
  loadData();
}
function loadData() {
  pagePurchaseOutOrder(query.value)
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
function resetForm() {
  form.value = { purchaseOutOrderLineList: [] };
}
function backTable() {
  resetForm();
  showEdit.value = false;
}
function handleUpdate(row) {
  selectPurchaseOutOrderById(row.purchaseOutOrderId)
    .then((res) => {
      showEdit.value = true;
      form.value = JSON.parse(JSON.stringify(res.data));
    })
    .catch((err) => {
      console.log(err);
    });
}
function handleCreate() {
  showEdit.value = true;
  isEdit.value = true;
}
function handleDelete(row) {
  ElMessageBox.confirm("此操作将永久删除该记录, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deletePurchaseOutOrder(row.purchaseOutOrderId)
        .then((res) => {
          ElMessage.success("删除成功");
          currentChange(1);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      ElMessage.message({
        type: "info",
        message: "取消删除",
      });
    });
}
function handleDeleteLine(index) {
  form.value.purchaseOutOrderLineList.splice(index, 1);
}
function handleView(row) {
  selectPurchaseOutOrderById(row.purchaseOutOrderId)
    .then((res) => {
      console.log(res.data);
      showEdit.value = true;
      isEdit.value = false;
      form.value = JSON.parse(JSON.stringify(res.data));
    })
    .catch((err) => {
      console.log(err);
    });
}
function handleAudit(row) {
  ElMessageBox.confirm("是否确认审核？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      auditPurchaseOutOrder(row.purchaseOutOrderId)
        .then((res) => {
          ElMessage.success("审核成功");
          currentChange(1);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      ElMessage.message({
        type: "info",
        message: "取消审核",
      });
    });
}
function submitForm() {
  formValidate.value.validate((valid) => {
    if (valid) {
      //去除空行
      form.value.purchaseOutOrderLineList =
        form.value.purchaseOutOrderLineList.filter((line) => line.skuCode);
      if (form.value.purchaseOutOrderId != null) {
        updatePurchaseOutOrder(form.value)
          .then((res) => {
            showEdit.value = false;
            resetForm();
            query.value.current = 1;
            ElMessage.success("修改成功");
            loadData();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        addPurchaseOutOrder(form.value)
          .then((res) => {
            showEdit.value = false;
            resetForm();
            query.value.current = 1;
            ElMessage.success("保存成功");
            loadData();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  });
}
function handleClickItemSaleSku(selectionItems) {
  itemSaleSkuTable.value.dialogTableVisible = false;
  selectionItems.forEach((item) => {
    let filterItem = form.value.purchaseOutOrderLineList.filter(
      (element) => element.skuCode === item.skuCode
    );
    if (filterItem.length == 0) {
      item.quantity = 0;
      item.price = 0;
      item.amount = 0;
      form.value.purchaseOutOrderLineList.splice(
        form.value.purchaseOutOrderLineList.length - 1,
        0,
        item
      );
    }
  });
}

onMounted(() => {
  loadData();
});
</script>

<style></style>
