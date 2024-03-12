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
        <el-form-item label="规格名称">
          <el-input
            v-model="query.specName"
            placeholder="请输入规格名称"
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
        row-key="itemClassId"
        border
        default-expand-all
        stripe
      >
        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column prop="specName" label="规格名称" sortable width="180">
        </el-table-column>
        <el-table-column prop="skuStr" label="规格项" width="180">
        </el-table-column>
        <el-table-column prop="remark" label="备注"> </el-table-column>
        <el-table-column prop="createdName" label="创建人"> </el-table-column>
        <el-table-column label="创建时间" prop="createdTime" :formatter="formatTableColumnDate">
        </el-table-column>
        <el-table-column prop="updatedName" label="修改人"> </el-table-column>
        <el-table-column label="修改时间" prop="updatedTime" :formatter="formatTableColumnDate">
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
            label-width="120px"
          >
            <el-row>
              <el-col :span="5">
                <el-form-item label="规格名称" prop="specName">
                  <el-input v-model="form.specName"></el-input>
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
            <el-row>
              <el-col>
                <el-form-item label="规格项">
                  <el-tag
                    :key="skuName"
                    v-for="skuName in form.specValueNameList"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(skuName)"
                  >
                    {{ skuName }}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="skuNameInputVisible"
                    v-model="inputSkuNameValue"
                    ref="saveSkuNameInput"
                    @keyup.enter="handleSkuNameInputConfirm"
                    @blur="handleSkuNameInputConfirm"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" @click="showInput"
                    >+ 规格项</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup name="Spec">
import {
  pageSpec,
  selectSpecById,
  addSpec,
  updateSpec,
  deleteSpec,
} from "@/api/spec";
import { ElMessageBox } from "element-plus";
import { ElMessage } from "element-plus";
import { ref, onMounted, nextTick } from "vue";
import { formatTableColumnDate } from "@/utils/dateUtil";

let formValidate = ref();
let showEdit = ref(false);
let query = ref({ size: 10, current: 0, total: 1 });
let form = ref({ specValueNameList: [] });
let tableData = ref([]);
let rules = ref({
  specName: [{ required: true, message: "请输入规格名称", trigger: "blur" }],
});
let saveSkuNameInput = ref();
let inputSkuNameValue = ref("");
let skuNameInputVisible = ref(false);

function resetForm() {
  form.value = { specValueNameList: [] };
}
function handleClose(value) {
  form.value.specValueNameList.pop(value);
}
function showInput() {
  skuNameInputVisible.value = true;
  nextTick(() => {
    saveSkuNameInput.value.focus();
  });
}
function handleSkuNameInputConfirm() {
  if (inputSkuNameValue.value) {
    form.value.specValueNameList.push(inputSkuNameValue.value);
  }
  skuNameInputVisible.value = false;
  inputSkuNameValue.value = "";
}
function currentChange(current) {
  query.value.current = current;
  loadData();
}
function loadData() {
  pageSpec(query.value)
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
  selectSpecById(row.specId)
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
      deleteSpec(row.specId)
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
      if (form.value.specId != null) {
        updateSpec(form.value)
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
        addSpec(form.value)
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

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
../../../api/spec
