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
        <el-form-item label="岗位名">
          <el-input
            v-model="query.PostName"
            placeholder="请输入岗位名"
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
        row-key="sysPostId"
        border
        default-expand-all
        stripe
      >
        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column
          prop="sysPostCode"
          label="岗位编码"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="sysPostName"
          label="岗位名"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="postSort"
          label="排序"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
        ></el-table-column>
        <el-table-column prop="createdName" label="创建人"></el-table-column>
        <el-table-column
          prop="createdTime"
          label="创建时间"
          :formatter="formatTableColumnDate"
        >
        </el-table-column>
        <el-table-column prop="updatedName" label="修改人"></el-table-column>
        <el-table-column
          label="修改时间"
          prop="updatedTime"
          :formatter="formatTableColumnDate"
        >
        </el-table-column>
        <el-table-column label="操作">
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
                <el-form-item label="岗位编码" prop="sysPostCode">
                  <el-input v-model="form.sysPostCode"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="岗位名" prop="sysPostName">
                  <el-input v-model="form.sysPostName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="排序" prop="postSort">
                  <el-input v-model="form.postSort"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="form.remark"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup name="Post">
import {
  pageSysPost,
  selectSysPostById,
  addSysPost,
  updateSysPost,
  deleteSysPost,
} from "@/api/post";
import { ElMessageBox } from "element-plus";
import { ElMessage } from "element-plus";
import { ref, onMounted } from "vue";
import { formatTableColumnDate } from "@/utils/dateUtil";

let formValidate = ref();
let showEdit = ref(false);
let query = ref({ size: 10, current: 0, total: 1 });
let form = ref({});
let tableData = ref([]);
let rules = ref({
  sysPostCode: [{ required: true, message: "请输入岗位编码", trigger: "blur" }],
  sysPostName: [{ required: true, message: "请输入岗位名称", trigger: "blur" }],
});

function currentChange(current) {
  query.value.current = current;
  loadData();
}
function resetForm() {
  form.value = {};
  query.value.current = 1;
}
function loadData() {
  pageSysPost(query.value)
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
  form.value = {};
  showEdit.value = false;
}
function handleUpdate(row) {
  selectSysPostById(row.sysPostId)
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
  resetForm();
}
function handleDelete(row) {
  ElMessageBox.confirm("此操作将永久删除该记录, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteSysPost(row.sysPostId)
        .then((res) => {
          ElMessage.success("删除成功");
          loadData();
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
  formValidate.value.validate((valid) => {
    if (valid) {
      if (form.value.sysPostId != null) {
        updateSysPost(form.value)
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
        addSysPost(form.value)
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

onMounted(() => {
  loadData();
});
</script>

<style>
table {
  width: 100% !important;
}
</style>
