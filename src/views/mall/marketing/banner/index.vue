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
        <el-form-item label="状态">
          <el-select
            v-model="query.status"
            clearable
            placeholder="请选择"
            style="width: 120px"
          >
            <el-option
              v-for="item in statusOptions"
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
      <el-table :data="tableData" row-key="bannerId" border stripe>
        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column prop="image" label="广告图片" width="200">
          <template #default="scope">
            <div>
              <el-image
                style="width: 180px; height: 70px"
                :src="scope.row.image"
              >
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="180">
        </el-table-column>
        <el-table-column prop="toPage" label="跳转页面" width="180">
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status == 1 ? 'success' : 'primary'">
              {{ scope.row.status == 1 ? "启用" : "停用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="180">
        </el-table-column>
        <el-table-column prop="createdName" label="创建人"> </el-table-column>
        <el-table-column label="创建时间" prop="createdTime" :formatter="formatTableColumnDate" width="180">
        </el-table-column>
        <el-table-column prop="updatedName" label="修改人"> </el-table-column>
        <el-table-column label="修改时间" prop="updatedTime" :formatter="formatTableColumnDate" width="180">
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
              ><i class="el-icon-delete"></i>删除</el-button
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
              <el-col>
                <el-form-item label="广告图片" prop="image">
                  <el-upload
                    class="icon-uploader"
                    action="http://localhost:9988/common/uploadImg?type=2"
                    :headers="headers"
                    :show-file-list="false"
                    :on-success="handleImgUploadSuccess"
                    :before-upload="beforeImgUpload"
                  >
                    <img v-if="form.image" :src="form.image" class="icon" />
                    <i v-else class="el-icon-plus icon-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="标题" prop="title">
                  <el-input v-model="form.title"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="跳转页面" prop="toPage">
                  <el-input v-model="form.toPage"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="状态" prop="status">
                  <el-radio-group v-model="form.status">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="2">停用</el-radio>
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
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup name="Banner">
import {
  pageBanner,
  addBanner,
  updateBanner,
  deleteBanner,
} from "@/api/banner";
import { ElMessageBox } from "element-plus";
import { ElMessage } from "element-plus";
import { ref, onMounted } from "vue";
import { formatTableColumnDate } from "@/utils/dateUtil";
import { useStore } from "@/store";

let formValidate = ref();
let showEdit = ref(false);
let query = ref({ size: 10, current: 0, total: 1 });
let form = ref({ status: 1, image: "" });
let tableData = ref([]);
let rules = ref({
  image: [{ required: true, message: "请选择广告图", trigger: "blur" }],
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
});
let statusOptions = ref([
  {
    value: 1,
    label: "启用",
  },
  {
    value: 2,
    label: "停用",
  },
]);
let store = useStore()
let headers = ref({
  "Springbok-Token": store.userInfo?.token,
});

function resetForm() {
  form.value = {
    status: 1,
    image: "",
  };
}
function currentChange(current) {
  query.value.current = current;
  loadData();
}
function loadData() {
  pageBanner(query.value)
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
function handleImgUploadSuccess(file) {
  form.value.image = file.data;
}
function beforeImgUpload(file) {
  const isJPG = file.type === "image/jpeg" || file.type === "image/png";
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isJPG) {
    ElMessage.error("上传图片只能是 JPG 格式!");
  }
  if (!isLt2M) {
    ElMessage.error("上传图片大小不能超过 2MB!");
  }
  return isJPG && isLt2M;
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
      deleteBanner(row.bannerId)
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
      if (form.value.bannerId != null) {
        updateBanner(form.value)
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
        addBanner(form.value)
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
.icon-uploader i {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.icon-uploader .el-upload:hover {
  border-color: #409eff;
}
.icon-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.icon-uploader .icon {
  width: 200px;
  height: 80px;
}
</style>
