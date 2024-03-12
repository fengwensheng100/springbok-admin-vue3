<template>
  <div>
    <el-dialog title="字典值" v-model="dialogTableVisible">
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
            <el-form-item label="字典标签">
              <el-input
                v-model="query.label"
                placeholder="请输入字典标签"
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
            row-key="dictValueId"
            border
            default-expand-all
            stripe
          >
            <el-table-column type="index" label="序号" width="60"> </el-table-column>
            <el-table-column prop="label" label="字典标签"> </el-table-column>
            <el-table-column prop="value" label="字典值"> </el-table-column>
            <el-table-column prop="remark" label="备注"> </el-table-column>
            <el-table-column prop="dictSort" label="排序"> </el-table-column>
            <el-table-column prop="createdName" label="创建人">
            </el-table-column>
            <el-table-column label="创建时间" width="150">
              <template #default="scope">{{ scope.createdTime }}</template>
            </el-table-column>

            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button icon="Edit" @click="handleUpdate(scope.row)"
                  >编辑</el-button
                >
                <el-button
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
          <el-form
            ref="formValidate"
            :rules="rules"
            :model="form"
            label-width="100px"
          >
            <el-row>
              <el-col :span="10">
                <el-form-item label="字典标签" prop="label">
                  <el-input v-model="form.label"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="字典值" prop="value">
                  <el-input v-model="form.value"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="form.remark"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="排序" prop="dictSort">
                  <el-input v-model="form.dictSort"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="DictValueTable">
import {
  pageDictValue,
  addDictValue,
  updateDictValue,
  deleteDictValue,
} from "@/api/dictValue";
import { ElMessageBox } from "element-plus";
import { ElMessage } from "element-plus";
import { ref, onMounted } from "vue";

let dialogTableVisible = ref(false);
let formValidate = ref();
let showEdit = ref(false);
let query = ref({ size: 10, current: 0, total: 1 });
let form = ref({ dictSort: 0 });
let tableData = ref([]);
let rules = {
  label: [{ required: true, message: "请输入字典标签", trigger: "blur" }],
  value: [{ required: true, message: "请输入字典值", trigger: "blur" }],
};

function resetForm() {
  form.value = {
    dictSort: 0,
  };
}
function currentChange(current) {
  query.value.current = current;
  loadData();
}
function loadData() {
  pageDictValue(query.value)
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
      deleteDictValue(row.dictValueId)
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
      form.value.dictId = query.value.dictId;
      if (form.value.dictValueId != null) {
        updateDictValue(form.value)
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
        addDictValue(form.value)
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
// 加载字典值列表
function loadDictValue(dictId) {
  query.value.dictId = dictId;
  tableData.value = [];
  loadData();
}
defineExpose({ dialogTableVisible, loadDictValue });
onMounted(() => {
  loadData();
});
</script>

<style scoped>
</style>