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
      <el-table
        :data="tableData"
        :tree-props="{ children: 'childrenList' }"
        row-key="itemSaleClassId"
        border
        stripe
      >
        <el-table-column type="index" label="序号" width="60"> </el-table-column>
        <el-table-column
          prop="itemSaleClassName"
          label="营销分类名称"
          sortable
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="itemSaleClassCode"
          label="营销分类编码"
          sortable
          width="180"
        >
        </el-table-column>
        <el-table-column prop="createdName" label="创建人"> </el-table-column>
        <el-table-column label="创建时间" prop="createdTime" :formatter="formatTableColumnDate">
        </el-table-column>
        <el-table-column prop="updatedName" label="修改人"> </el-table-column>
        <el-table-column label="修改时间" prop="updatedTime" :formatter="formatTableColumnDate">
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button icon="Edit" size="small" @click="handleUpdate(scope.row)"
              >编辑</el-button
            >
            <el-button
              icon="Plus"
              size="small"
              @click="handleCreate(scope.row.itemSaleClassId)"
              >新增下级分类</el-button
            >
            <el-button
              icon="Delete"
              size="small"
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
          <el-form ref="formValidate" :rules="rules" :model="form" label-width="120px">
            <el-row>
              <el-col :span="5">
                <el-form-item label="营销分类编码" prop="itemSaleClassCode">
                  <el-input v-model="form.itemSaleClassCode"></el-input>
                </el-form-item>
                <el-form-item label="营销分类名称" prop="itemSaleClassName">
                  <el-input v-model="form.itemSaleClassName"></el-input>
                </el-form-item>
                <el-form-item label="营销分类图标" prop="classIcon">
                  <el-upload
                    class="icon-uploader"
                    action="http://localhost:8082/common/uploadImg?type=2"
                    :show-file-list="false"
                    :on-success="handleImgUploadSuccess"
                    :before-upload="beforeImgUpload"
                  >
                    <img
                      v-if="form.classIcon"
                      :src="form.classIcon"
                      class="icon"
                    />
                    <i v-else class="el-icon-plus icon-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
                <el-form-item label="是否首页展示" prop="startNow">
                  <el-switch
                    v-model="form.showIndex"
                    active-text="是"
                    inactive-text="否"
                  >
                  </el-switch>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup name="ItemSaleClass">
import {
  pageItemSaleClass,
  addItemSaleClass,
  updateItemSaleClass,
  deleteItemSaleClass,
} from "@/api/itemSaleClass";
import { ElMessageBox } from "element-plus";
import { ElMessage } from "element-plus";
import { ref, onMounted } from "vue";
import { formatTableColumnDate } from "@/utils/dateUtil";

let formValidate = ref();
let showEdit = ref(false);
let query = ref({ size: 10, current: 0, total: 1 });
let form = ref({ showIndex: 0 });
let tableData = ref([]);
let rules = ref({
  itemSaleClassName: [
    { required: true, message: "请输入营销分类名称", trigger: "blur" },
  ],
  itemSaleClassCode: [
    { required: true, message: "请输入营销分类编码", trigger: "blur" },
  ],
});

function currentChange(current) {
  query.value.current = current;
  loadData();
}
function loadData() {
  pageItemSaleClass(query.value)
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
  form.value = {
    showIndex: 1,
  };
}
function backTable() {
  resetForm();
  showEdit.value = false;
}
function handleUpdate(row) {
  showEdit.value = true;
  form.value = JSON.parse(JSON.stringify(row));
}
function handleCreate(id) {
  if (id > 0) {
    form.value.parentId = id;
  }
  showEdit.value = true;
}
function handleImgUploadSuccess(file) {
  form.value.classIcon = file.data;
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
function handleDelete(row) {
  ElMessageBox.confirm("此操作将永久删除该记录, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteItemSaleClass(row.itemSaleClassId)
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
      if (form.value.itemSaleClassId != null) {
        updateItemSaleClass(form.value)
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
        addItemSaleClass(form.value)
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
</style>
