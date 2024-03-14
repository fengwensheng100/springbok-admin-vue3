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
        <el-form-item label="角色名">
          <el-input
            v-model="query.roleName"
            placeholder="请输入角色名"
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
        row-key="sysRoleId"
        border
        default-expand-all
        stripe
      >
        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="roleType"
          :formatter="getRoleType"
          label="角色类型"
        >
        </el-table-column>
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
                <el-form-item label="角色名" prop="roleName">
                  <el-input v-model="form.roleName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="角色类型" prop="roleType">
                  <el-select
                    v-model="form.roleType"
                    placeholder="请选择"
                    style="width: 265px"
                  >
                    <el-option
                      v-for="option in roleTypeOptions"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="菜单权限">
          <el-tree
            :data="menuList"
            show-checkbox
            default-expand-all
            node-key="sysMenuId"
            ref="tree"
            highlight-current
            :props="defaultProps"
          >
          </el-tree>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup name="Role">
import {
  pageSysRole,
  selectSysRoleById,
  addSysRole,
  updateSysRole,
  deleteSysRole,
} from "@/api/role";
import { listSysMenu } from "@/api/menu";
import { ElMessageBox } from "element-plus";
import { ElMessage } from "element-plus";
import { ref, onMounted } from "vue";
import { formatTableColumnDate } from "@/utils/dateUtil";

let tree = ref();
let formValidate = ref();
let showEdit = ref(false);
let query = ref({ size: 10, current: 0, total: 1 });
let form = ref({});
let tableData = ref([]);
let rules = ref({
  roleName: [{ required: true, message: "请输入角色名", trigger: "blur" }],
  roleType: [{ required: true, message: "请选择角色类型", trigger: "blur" }],
});
let roleTypeOptions = ref([
  {
    value: 1,
    label: "管理员",
  },
  {
    value: 2,
    label: "用户",
  },
]);
let menuList = ref([]);
let defaultProps = ref({
  children: "childrenList",
  label: "menuName",
});

function getRoleType(row) {
  let roleType = roleTypeOptions.value.filter(
    (roleType) => roleType.value == row.roleType
  );
  if (roleType.length > 0) {
    return roleType[0].label;
  }
  return "";
}
function currentChange(current) {
  query.value.current = current;
  loadData();
}
function setCheckedMenuIds() {
  let parentIds = tree.value.getHalfCheckedKeys();
  let childsIds = tree.value.getCheckedKeys();
  form.value.sysMenuIdList = parentIds.concat(childsIds);
}
function resetForm() {
  form.value = {};
  query.value.current = 1;
  tree.value.setCheckedKeys([]);
}
function loadSysMenuData() {
  listSysMenu()
    .then((res) => {
      menuList.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
function loadData() {
  pageSysRole(query.value)
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
  selectSysRoleById(row.sysRoleId)
    .then((res) => {
      form.value = res.data;
      showEdit.value = true;
      tree.value.setCheckedKeys([]);
      if (form.value.sysMenuIdList != null) {
        form.value.sysMenuIdList.forEach((menuId) => {
          tree.value.setChecked(menuId, true, false);
        });
      }
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
      deleteSysRole(row.sysRoleId)
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
  setCheckedMenuIds();
  formValidate.value.validate((valid) => {
    if (valid) {
      if (form.value.sysRoleId != null) {
        updateSysRole(form.value)
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
        addSysRole(form.value)
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
  loadSysMenuData();
});
</script>

<style>
table {
  width: 100% !important;
}
</style>
