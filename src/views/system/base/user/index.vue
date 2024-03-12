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
      <el-form :inline="true">
        <el-form-item label="用户名">
          <el-input
            v-model="query.username"
            placeholder="请输入用户名或昵称"
            @keyup.enter="currentChange(1)"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="query.mobile"
            placeholder="请输入手机号"
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
        row-key="sysUserId"
        border
        default-expand-all
        stripe
      >
        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column prop="username" label="用户名" sortable width="180">
        </el-table-column>
        <el-table-column prop="nickName" label="昵称"> </el-table-column>
        <el-table-column prop="mobile" label="手机号"> </el-table-column>
        <el-table-column prop="createdName" label="创建人"> </el-table-column>
        <el-table-column
          prop="createdTime"
          label="创建时间"
          :formatter="formatTableColumnDate"
        >
        </el-table-column>
        <el-table-column prop="updatedName" label="修改人"> </el-table-column>
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
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="form.username"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="角色" prop="sysRoleId">
                  <el-select v-model="form.sysRoleId" placeholder="请选择">
                    <el-option
                      v-for="sysRole in sysRoleOptions"
                      :key="sysRole.sysRoleId"
                      :label="sysRole.roleName"
                      :value="sysRole.sysRoleId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="密码" prop="userPassword">
                  <el-input v-model="form.userPassword"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="昵称" prop="nickName">
                  <el-input v-model="form.nickName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="手机号">
                  <el-input v-model="form.mobile"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup name="User">
import {
  pageSysUser,
  addSysUser,
  updateSysUser,
  deleteSysUser,
} from "@/api/user";
import { listSysRole } from "@/api/role";
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
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  userPassword: [{ required: true, message: "请输入密码", trigger: "blur" }],
  nickName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  sysRoleId: [{ required: true, message: "请选择角色", trigger: "blur" }],
});
let sysRoleOptions = ref([]);

function currentChange(current) {
  query.value.current = current;
  loadData();
}
function loadSysRoleOptions() {
  listSysRole()
    .then((res) => {
      sysRoleOptions.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
function loadData() {
  pageSysUser(query.value)
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
  form.value = {};
}
function backTable() {
  resetForm();
  showEdit.value = false;
}
function handleUpdate(row) {
  showEdit.value = true;
  form.value = JSON.parse(JSON.stringify(row));
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
      deleteSysUser(row.sysUserId)
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
  formValidate.value.validate((valid) => {
    if (valid) {
      if (form.value.sysUserId != null) {
        updateSysUser(form.value)
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
        addSysUser(form.value)
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
  loadSysRoleOptions();
});
</script>

<style>
table {
  width: 100% !important;
}
</style>
