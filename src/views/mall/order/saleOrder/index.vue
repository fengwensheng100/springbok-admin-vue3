<template>
  <div>
    <div>
      <el-row v-show="showEdit">
        <el-button type="primary" icon="Back" @click="backTable"
          >返回
        </el-button>
      </el-row>
    </div>
    <el-divider></el-divider>
    <div v-show="!showEdit">
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="订单号">
          <el-input
            v-model="query.orderNo"
            placeholder="请输入订单号"
            @keyup.enter="currentChange(1)"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select
            v-model="query.orderStatus"
            clearable
            placeholder="请选择"
            style="width: 120px"
          >
            <el-option
              v-for="item in orderStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select
            v-model="query.payStatus"
            clearable
            placeholder="请选择"
            style="width: 120px"
          >
            <el-option
              v-for="item in payStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
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
      <el-table :data="tableData" row-key="saleOrderId" border stripe>
        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column prop="orderNo" label="订单号" width="180">
        </el-table-column>
        <el-table-column prop="nickname" label="会员昵称" width="100">
        </el-table-column>
        <el-table-column prop="saleChannel" label="订单来源" width="100">
          <template #default="scope">
            <el-tag :type="'primary'" disable-transitions>
              {{ scope.row.saleChannel === 1 ? "小程序" : "未知" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="订单金额" width="100">
        </el-table-column>
        <el-table-column prop="payAmount" label="实付金额" width="100">
        </el-table-column>
        <el-table-column prop="discountAmount" label="优惠金额" width="100">
        </el-table-column>
        <el-table-column prop="postFee" label="运费"> </el-table-column>
        <el-table-column prop="payStatus" label="支付状态" width="100">
          <template #default="scope">
            <el-tag
              :type="scope.row.payStatus === 2 ? 'success' : 'danger'"
              disable-transitions
            >
              {{ scope.row.payStatus === 2 ? "已支付" : "未支付" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" width="100">
          <template #default="scope">
            <el-tag
              :type="getOrderStatusTag(scope.row.orderStatus)"
              disable-transitions
              >{{ getOrderStatus(scope.row.orderStatus) }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="180">
          <template #default="scope">{{ scope.createdTime }}</template>
        </el-table-column>
        <el-table-column prop="memberRemark" label="用户备注" width="100">
        </el-table-column>
        <el-table-column prop="receiverName" label="收货人"> </el-table-column>
        <el-table-column prop="receiverTel" label="联系方式" width="150">
        </el-table-column>
        <el-table-column prop="receiverAddress" label="收货人地址" width="200">
        </el-table-column>
        <el-table-column prop="cancelReason" label="取消原因" width="100">
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" icon="View" @click="handleView(scope.row)"
              >查看</el-button
            >
            <el-button
              size="small"
              v-show="scope.row.orderStatus === 2"
              icon="Promotion"
              @click="showLogisticDialog(scope.row.saleOrderId)"
              >发货</el-button
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
      <el-descriptions title="订单信息" :column="3">
        <el-descriptions-item label="订单号">{{
          form.orderNo
        }}</el-descriptions-item>
        <el-descriptions-item label="用户昵称">{{
          form.nickname
        }}</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{
          form.createdTime
        }}</el-descriptions-item>
        <el-descriptions-item label="订单金额">{{
          form.amount
        }}</el-descriptions-item>
        <el-descriptions-item label="实付金额">{{
          form.payAmount
        }}</el-descriptions-item>
        <el-descriptions-item label="优惠金额">{{
          form.discountAmount
        }}</el-descriptions-item>
        <el-descriptions-item label="运费">{{
          form.postFee
        }}</el-descriptions-item>
        <el-descriptions-item label="订单来源">
          <el-tag :type="'primary'" disable-transitions>
            {{ form.saleChannel === 1 ? "小程序" : "未知" }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag
            :type="getOrderStatusTag(form.orderStatus)"
            disable-transitions
          >
            {{ form.orderStatusLabel }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="支付状态">
          <el-tag
            :type="form.payStatus === 2 ? 'success' : 'danger'"
            disable-transitions
          >
            {{ form.payStatus === 2 ? "已支付" : "未支付" }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="支付时间">{{
          form.payTime
        }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="margin-top" title="收货信息" :column="2" border>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <User />
              </el-icon>
              收货人
            </div>
          </template>
          {{ form.receiverName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Iphone />
              </el-icon>
              联系方式
            </div>
          </template>
          {{ form.receiverTel }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <OfficeBuilding />
              </el-icon>
              收货地址
            </div>
          </template>
          {{ form.receiverAddress }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="margin-top" title="订单商品" :column="1" border>
      </el-descriptions>
      <el-table :data="form.saleOrderLines" row-key="couponId" border>
        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column prop="image" label="商品图片" width="180">
          <template #default="scope">
            <div>
              <el-image
                style="width: 70px; height: 70px"
                :src="scope.row.image"
              >
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="itemSaleName"
          label="商品名称"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="attrsText"
          label="规格"
          width="200"
        ></el-table-column>
        <el-table-column prop="skuCode" label="规格编码"></el-table-column>
        <el-table-column prop="price" label="单价"></el-table-column>
        <el-table-column prop="quantity" label="数量"></el-table-column>
        <el-table-column prop="amount" label="小计"></el-table-column>
        <el-table-column prop="payAmount" label="实付小计"></el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="订单发货"
      :visible="dialogLogisticFormVisible"
      width="30%"
    >
      <el-form :model="form">
        <el-form-item label="物流单号">
          <el-input
            v-model="form.logisticNumber"
            autocomplete="off"
            placeholder="请输入物流单号"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="dialogLogisticFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDeliver">发 货</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="SaleOrder">
import {
  pageSaleOrder,
  selectSaleOrderById,
  deliverSaleOrder,
} from "@/api/saleOrder";
import { listDictValueByDictCode } from "@/api/dictValue";
import { ElMessage } from "element-plus";
import { ref, onMounted } from "vue";

let showEdit = ref(false);
let query = ref({ size: 10, current: 0, total: 1 });
let form = ref({});
let dialogLogisticFormVisible = ref(false);
let tableData = ref([]);
let orderStatusOptions = ref([]);
let payStatusOptions = ref([
  {
    value: 1,
    label: "未支付",
  },
  {
    value: 2,
    label: "已支付",
  },
]);

function getOrderStatusTag(orderStatus) {
  let tagType = "info";
  if (orderStatus == 1) {
    tagType = "danger";
  } else if (orderStatus == 2) {
    tagType = "warning";
  } else if (orderStatus == 3) {
    tagType = "primary";
  } else if (orderStatus == 4 || orderStatus == 5) {
    tagType = "success";
  }
  return tagType;
}
function getOrderStatus(status) {
  let orderStatus = orderStatusOptions.value.filter(
    (orderStatus) => orderStatus.value == status
  );
  if (orderStatus) {
    return orderStatus[0].label;
  }
  return "";
}
function currentChange(current) {
  this.query.current = current;
  this.loadData();
}
function loadDictValue() {
  listDictValueByDictCode("order_status")
    .then((res) => {
      orderStatusOptions.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
function loadData() {
  pageSaleOrder(query.value)
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
  showEdit.value = false;
}
function showLogisticDialog(id) {
  saleOrderId.value = id;
  dialogLogisticFormVisible.value = true;
}
function handleView(row) {
  selectSaleOrderById(row.saleOrderId)
    .then((res) => {
      showEdit.value = true;
      form.value = JSON.parse(JSON.stringify(res.data));
      form.value.orderStatusLabel = getOrderStatus(this.form.orderStatus);
    })
    .catch((err) => {
      console.log(err);
    });
}
function handleDeliver() {
  deliverSaleOrder(saleOrderId.value)
    .then((res) => {
      ElMessage.success("操作成功");
      dialogLogisticFormVisible.value = false;
      loadData();
    })
    .catch((err) => {
      console.log(err);
    });
}

onMounted(() => {
  loadDictValue();
  loadData();
});
</script>

<style>
.margin-top {
  margin-top: 30px;
}
</style>
