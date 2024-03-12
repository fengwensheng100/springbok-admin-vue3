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
        <el-form-item label="字典名称">
          <el-input
            v-model="query.dictName"
            placeholder="请输入字典名称或编码"
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
        v-loading="loading"
        :data="tableData"
        row-key="dictId"
        border
        default-expand-all
        stripe
      >
        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column prop="dictName" label="字典名称" sortable width="180">
        </el-table-column>
        <el-table-column prop="dictCode" label="字典编码">
          <template #default="scope">
            <el-tag
              type="primary"
              @click="showDictValue(scope.row.dictId)"
              class="dict-code-tag"
              >{{ scope.row.dictCode }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="dictType" label="字典类型">
          <template #default="scope">
            <el-tag :type="scope.row.dictType == 1 ? 'primary' : 'success'">
              {{ scope.row.dictType == 1 ? "系统字典" : "业务字典" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"> </el-table-column>
        <el-table-column prop="dictSort" label="排序"> </el-table-column>
        <el-table-column prop="createdName" label="创建人"> </el-table-column>
        <el-table-column
          prop="createdTime"
          label="创建时间"
          :formatter="formatTableColumnDate"
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
                <el-form-item label="字典编码" prop="dictCode">
                  <el-input v-model="form.dictCode"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="字典名称" prop="dictName">
                  <el-input v-model="form.dictName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="字典类型" prop="dictType">
                  <el-radio-group v-model="form.dictType">
                    <el-radio :label="1">系统字典</el-radio>
                    <el-radio :label="2">业务字典</el-radio>
                  </el-radio-group>
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
              <el-col :span="5">
                <el-form-item label="排序" prop="dictSort">
                  <el-input v-model="form.dictSort"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>

    <DictValueTable ref="dictValueTable"></DictValueTable>
  </div>
</template>

<script setup name="Dict">
import { ElMessageBox } from "element-plus";
import { ElMessage } from "element-plus";
import { pageDict, addDict, updateDict, deleteDict } from "@/api/dict";
import DictValueTable from "@/components/common/DictValueTable.vue";
import { onMounted, ref } from "vue";
import { formatTableColumnDate } from "@/utils/dateUtil";

let dictValueTable = ref();
let loading = ref(true);
let formValidate = ref();
let showEdit = ref(false);
let query = ref({ size: 10, current: 0, total: 1 });
let form = ref({ dictType: 1, dictSort: 0 });
let tableData = ref([]);
let rules = ref({
  dictCode: [{ required: true, message: "请输入字典编码", trigger: "blur" }],
  dictType: [{ required: true, message: "请输入字典类型", trigger: "blur" }],
  dictName: [{ required: true, message: "请输入字典名称", trigger: "blur" }],
});

function resetForm() {
  form.value = {
    dictType: 1,
    dictSort: 0,
  };
}
function currentChange(current) {
  query.value.current = current;
  loadData();
}
function loadData() {
  pageDict(query.value)
    .then((res) => {
      query.value.size = res.data.size;
      query.value.current = res.data.current;
      query.value.total = res.data.total;
      tableData.value = res.data.records;
      loading.value = false;
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
      deleteDict(row.dictId)
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
      if (form.value.dictId != null) {
        updateDict(form.value)
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
        addDict(form.value)
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
function showDictValue(dictId) {
  dictValueTable.value.dialogTableVisible = true;
  dictValueTable.value.loadDictValue(dictId);
}

onMounted(() => {
  loadData();
});
</script>

<style>
.dict-code-tag:hover {
  cursor: pointer;
  text-decoration: underline;
}
</style>
