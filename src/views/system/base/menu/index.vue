<template>
  <div>
    <div>
      <el-row v-show="!showEdit">
        <el-button type="primary" icon="Plus" @click="handleCreate(0)"
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
      <el-scrollbar :height="scrollbarHeight">
        <el-table
          :data="tableData"
          row-key="sysMenuId"
          border
          default-expand-all
          :tree-props="{ children: 'childrenList' }"
        >
          <el-table-column label="菜单名称" sortable width="180">
            <template #default="scope">
              <el-icon>
                <component :is="scope.row.menuIcon"></component>
              </el-icon>
              {{ scope.row.menuName }}
            </template>
          </el-table-column>
          <el-table-column
            prop="routerName"
            label="路由名称"
            sortable
            width="180"
          ></el-table-column>
          <el-table-column prop="routerPath" label="路由地址" width="260">
          </el-table-column>
          <el-table-column prop="routerComponent" label="组件路径" width="300">
          </el-table-column>
          <el-table-column prop="permissionCode" label="权限标识" width="100">
          </el-table-column>
          <el-table-column prop="menuSort" label="排序" width="100"> </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                size="small"
                icon="Edit"
                @click="handleUpdate(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="small"
                icon="Plus"
                @click="handleCreate(scope.row.sysMenuId)"
                >新增下级菜单</el-button
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
      </el-scrollbar>
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
                <el-form-item label="菜单名称" prop="menuName">
                  <el-input v-model="form.menuName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="路由名称" prop="routerName">
                  <el-input v-model="form.routerName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="路由地址" prop="routerPath">
                  <el-input v-model="form.routerPath"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="组件路径" prop="routerComponent">
                  <el-input v-model="form.routerComponent"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="权限标识" prop="permissionCode">
                  <el-input v-model="form.permissionCode"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="2">
                <el-form-item label="排序">
                  <el-input v-model="form.menuSort"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup name="Menu">
import {
  listSysMenu,
  addSysMenu,
  updateSysMenu,
  deleteSysMenu,
} from "@/api/menu";
import { ElMessageBox } from "element-plus";
import { ElMessage } from "element-plus";
import { ref, onMounted } from "vue";

let formValidate = ref();
let showEdit = ref(false);
let form = ref({});
let tableData = ref([]);
let rules = ref({
  menuName: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
});
let parentId = ref(0);
let scrollbarHeight = ref("0px");

function resetForm() {
  form.value = {};
}
function loadData() {
  listSysMenu()
    .then((res) => {
      tableData.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
function backTable() {
  showEdit.value = false;
}
function handleUpdate(row) {
  showEdit.value = true;
  form.value = JSON.parse(JSON.stringify(row));
}
function handleCreate(id) {
  resetForm();
  if (id > 0) {
    parentId.value = id;
  }
  showEdit.value = true;
}
function handleDelete(row) {
  ElMessageBox.confirm("此操作将永久删除该记录, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteSysMenu(row.sysMenuId)
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
      if (form.value.sysMenuId != null) {
        updateSysMenu(form.value)
          .then((res) => {
            showEdit.value = false;
            form.value = {};
            ElMessage.success("修改成功");
            loadData();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        form.value.parentId = parentId.value > 0 ? parentId.value : 0;
        addSysMenu(form.value)
          .then((res) => {
            showEdit.value = false;
            parentId.value = 0;
            form.value = {};
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
  scrollbarHeight.value = document.documentElement.clientHeight * 0.7 + "px";
  window.onresize = () => {
    if (scrollbarHeight.value)
      scrollbarHeight.value =
        document.documentElement.clientHeight * 0.7 + "px";
  };
});
</script>

<style>
table {
  width: 100% !important;
}
</style>
