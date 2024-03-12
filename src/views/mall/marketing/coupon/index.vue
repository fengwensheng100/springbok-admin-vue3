<template>
  <div>
    <div>
      <el-row v-show="!showEdit">
        <el-button type="primary" icon="Plus" @click="handleCreate"
          >新增
        </el-button>
      </el-row>
      <el-row v-show="showEdit">
        <el-button type="primary" icon="Back" @click="backTable"
          >返回
        </el-button>
        <el-button type="success" icon="Check" @click="submitForm"
          >保存
        </el-button>
      </el-row>
    </div>
    <el-divider></el-divider>
    <div v-show="!showEdit">
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="商品名称">
          <el-input
            v-model="query.couponName"
            placeholder="请输入券名称"
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
      <el-table :data="tableData" row-key="couponId" border stripe>
        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column prop="couponName" label="券名称" sortable width="180">
        </el-table-column>
        <el-table-column
          prop="couponType"
          :formatter="getCouponType"
          label="券类型"
        >
        </el-table-column>
        <el-table-column prop="couponLimit" label="使用门槛"> </el-table-column>
        <el-table-column prop="couponAmount" label="券面额"> </el-table-column>
        <el-table-column prop="usedItemSaleType" label="适用商品">
          <template #default="scope">
            {{
              scope.row.usedItemSaleType === 0
                ? "全部可用"
                : scope.row.usedItemSaleType === 1
                ? "指定商品可用"
                : "指定商品不可用"
            }}
          </template>
        </el-table-column>
        <el-table-column prop="createdName" label="创建人"> </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createdTime"
          :formatter="formatTableColumnDate"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="updatedName" label="修改人"> </el-table-column>
        <el-table-column
          label="修改时间"
          prop="updatedTime"
          :formatter="formatTableColumnDate"
          width="180"
        >
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" icon="Edit" @click="handleUpdate(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              icon="Delete"
              type="danger"
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
            label-width="100px"
          >
            <el-row>
              <el-col :span="5">
                <el-form-item label="券名称" prop="couponName">
                  <el-input v-model="form.couponName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="券描述" prop="couponDescription">
                  <el-input v-model="form.couponDescription"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="券门槛" prop="couponLimit">
                  <el-input
                    v-model="form.couponLimit"
                    placeholder="券使用门槛"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="券类型" prop="couponType">
                  <el-radio-group v-model="form.couponType">
                    <el-radio
                      :label="couponType.value"
                      v-for="couponType in couponTypeOptions"
                      :key="couponType.dictValueId"
                      >{{ couponType.label }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="抵扣金额" prop="couponAmount">
                  <el-input
                    v-model="form.couponAmount"
                    placeholder="折扣券填(0-1)区间的数字，例如0.88代表88折"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="适用商品" prop="usedItemSaleType">
                  <el-radio-group v-model="form.usedItemSaleType">
                    <el-radio :label="0">全部可用</el-radio>
                    <el-radio :label="1">指定商品可用</el-radio>
                    <el-radio :label="2">指定商品不可用</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-button
                  type="primary"
                  @click="addTableLine"
                  v-show="form.usedItemSaleType > 0"
                  >添加商品</el-button
                >
              </el-col>
            </el-row>
            <el-row>
              <el-table
                :data="form.couponItemSaleList"
                row-key="itemCode"
                style="width: 100%"
                v-show="form.usedItemSaleType > 0"
              >
                <el-table-column type="index" label="序号" width="60">
                </el-table-column>
                <el-table-column prop="itemCode" label="商品编码" width="150">
                  <template #default="scope">
                    <el-input
                      prop="itemCode"
                      v-model="scope.row.itemCode"
                      @keyup.enter="showItemTable(scope.row)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="商品图片" width="100">
                  <template #default="scope">
                    <div>
                      <el-image
                        style="width: 70px; height: 70px"
                        :src="getMainImage(scope.row.mainImage)"
                      >
                      </el-image>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="itemSaleName"
                  label="商品名称"
                  width="200"
                >
                </el-table-column>
                <el-table-column
                  prop="itemSalePrice"
                  label="销售价"
                  width="100"
                >
                </el-table-column>
                <el-table-column>
                  <template #default="scope">
                    <el-button
                      type="danger"
                      @click="handleDeleteLine(scope.$index)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>

    <ItemSaleTable
      ref="itemSaleTable"
      @onClick="handleClickItemSale"
    ></ItemSaleTable>
  </div>
</template>

<script setup name="Coupon">
import {
  pageCoupon,
  selectCouponById,
  addCoupon,
  updateCoupon,
  deleteCoupon,
} from "@/api/coupon";
import { listDictValueByDictCode } from "@/api/dictValue";
import ItemSaleTable from "@/components/common/ItemSaleTable.vue";
import { ElMessageBox } from "element-plus";
import { ElMessage } from "element-plus";
import { ref, onMounted } from "vue";
import { formatTableColumnDate } from "@/utils/dateUtil";

let itemSaleTable = ref();
let formValidate = ref();
let showEdit = ref(false);
let query = ref({ size: 10, current: 0, total: 1 });
let form = ref({
  couponType: 1,
  usedItemSaleType: 0,
  couponItemSaleList: [],
});
let tableData = ref([]);
let rules = ref({
  couponName: [{ required: true, message: "请输入券名称", trigger: "blur" }],
  couponDescription: [
    { required: true, message: "请输入券描述", trigger: "blur" },
  ],
  couponLimit: [{ required: true, message: "请填写券门槛", trigger: "blur" }],
  couponType: [{ required: true, message: "请输入券类型", trigger: "blur" }],
  couponAmount: [
    { required: true, message: "请填写券抵扣金额", trigger: "blur" },
  ],
});
let couponTypeOptions = ref([]);

function getCouponType(row) {
  let couponType = couponTypeOptions.value.filter(
    (couponType) => couponType.value == row.couponType
  );
  if (couponType) {
    return couponType[0].label;
  }
  return "";
}
function resetForm() {
  form.value = {
    couponType: 1,
    usedItemSaleType: 0,
    couponItemSaleList: [],
  };
}
function currentChange(current) {
  query.value.current = current;
  loadData();
}
function loadDictValue() {
  listDictValueByDictCode("coupon_type")
    .then((res) => {
      couponTypeOptions.value = res.data;
      couponTypeOptions.value.forEach(function (obj) {
        obj.value = parseInt(obj.value);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
function loadData() {
  pageCoupon(query.value)
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
function backTable() {
  resetForm();
  showEdit.value = false;
}
function handleUpdate(row) {
  selectCouponById(row.couponId)
    .then((res) => {
      form.value = res.data;
      showEdit.value = true;
    })
    .catch((res) => {
      console.log(res);
    });
}
function handleCreate() {
  showEdit.value = true;
}
function handleDelete(row) {
  ElMessageBox.confirm("此操作将永久删除该记录, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteCoupon(row.couponId)
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
function submitForm() {
  form.value.couponItemSaleList = form.value.couponItemSaleList.filter(
    (line) => line.itemCode
  );
  formValidate.value.validate((valid) => {
    if (valid) {
      if (form.value.couponId != null) {
        updateCoupon(form.value)
          .then((res) => {
            showEdit.value = false;
            resetForm();
            ElMessage.success("修改成功");
            loadData();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        addCoupon(form.value)
          .then((res) => {
            showEdit.value = false;
            resetForm();
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
function getMainImage(img) {
  return img ? img.split(",").map(String)[0] : "";
}
function showItemTable(row) {
  itemSaleTable.value.dialogTableVisible = true;
}
function addTableLine() {
  form.value.couponItemSaleList.push({});
}
function handleDeleteLine(index) {
  form.value.couponItemSaleList.splice(index, 1);
}
function handleClickItemSale(selectionItems) {
  itemSaleTable.value.dialogTableVisible = false;
  selectionItems.forEach((item) => {
    var filterItem = form.value.couponItemSaleList.filter(
      (element) => element.itemCode === item.itemCode
    );
    if (filterItem.length == 0) {
      form.value.couponItemSaleList.splice(
        form.value.couponItemSaleList.length - 1,
        0,
        item
      );
    }
  });
}

onMounted(() => {
  loadDictValue();
  loadData();
});
</script>

<style></style>
