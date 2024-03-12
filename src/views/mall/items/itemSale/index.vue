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
        <el-form-item label="商品名称">
          <el-input
            v-model="query.itemSaleName"
            placeholder="请输入商品编码或商品名称"
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
        row-key="itemSaleId"
        border
        default-expand-all
        stripe
      >
        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column label="主图" width="100">
          <template #default="scope">
            <div>
              <el-image
                style="width: 70px; height: 70px"
                :src="getMainImage(scope.row.mainImage)"
              >
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="itemCode"
          label="商品编码"
          sortable
          width="120"
        ></el-table-column>
        <el-table-column
          prop="itemName"
          label="商品名称"
          sortable
          width="180"
        ></el-table-column>
        <el-table-column
          prop="itemSaleName"
          label="销售商品名称"
          sortable
          width="180"
        ></el-table-column>
        <el-table-column
          prop="itemSalePrice"
          label="销售价格"
          width="120"
        ></el-table-column>
        <el-table-column label="创建人" prop="createdName" width="100"> </el-table-column>
        <el-table-column label="创建时间" prop="createdTime" :formatter="formatTableColumnDate" width="180">
        </el-table-column>
        <el-table-column label="修改人" prop="updatedName" width="100"> </el-table-column>
        <el-table-column label="修改时间" prop="updatedTime" :formatter="formatTableColumnDate" width="180">
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
      <el-form
        ref="formValidate"
        :rules="rules"
        :model="form"
        label-width="120px"
      >
        <el-tabs type="border-card">
          <el-tab-pane label="基本信息">
            <el-row>
              <el-col :span="10">
                <el-form-item label="商品编码" prop="itemCode">
                  <el-input v-model="form.itemCode"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="商品名称" prop="itemName">
                  <el-input v-model="form.itemName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="销售商品名称" prop="itemSaleName">
                  <el-input v-model="form.itemSaleName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="营销分类" prop="itemSaleClassCode">
                  <el-select
                    v-model="form.itemSaleClassCode"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="itemSaleClass in itemSaleClassOptions"
                      :key="itemSaleClass.itemSaleClassCode"
                      :label="itemSaleClass.itemSaleClassName"
                      :value="itemSaleClass.itemSaleClassCode"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="销售商品主图" prop="mainImage">
                  <el-upload
                    action="http://localhost:9988/common/uploadImg?type=1"
                    list-type="picture-card"
                    :file-list="imgList"
                    :before-upload="beforeImgUpload"
                    :on-preview="handleImgPreview"
                    :on-success="handleImgUploadSuccess"
                    :on-remove="handleImgRemove"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible="dialogImgVisible">
                    <img width="100%" :src="previewImage" alt="" />
                  </el-dialog>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="商品标签" prop="tagIds">
                  <el-select
                    v-model="form.tagIds"
                    multiple
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="option in tagList"
                      :key="option.tagId"
                      :label="option.tagName"
                      :value="option.tagId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="规格">
                  <el-button type="text" @click="showSkuTable"
                    >选择规格</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="规格明细" prop="itemSaleSkuList">
                  <el-table :data="form.specList" style="width: 50%">
                    <el-table-column
                      prop="specName"
                      label="规格名称"
                      width="150"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="specValueList"
                      label="规格项"
                      width="150"
                    >
                      <template #default="scope">
                        <el-tag
                          class="spec-tag"
                          v-for="specValue in scope.row.specValueNameList"
                          :key="specValue"
                          >{{ specValue }}</el-tag
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="规格项">
                  <el-table :data="form.itemSaleSkuList" style="width: 100%">
                    <el-table-column prop="spec" label="规格名称" width="260">
                    </el-table-column>
                    <el-table-column prop="image" label="规格图片" width="100">
                      <template #default="scope">
                        <el-upload
                          class="sku-uploader"
                          action="http://localhost:9988/common/uploadImg?type=1"
                          :show-file-list="false"
                          :on-success="
                            function (res, file) {
                              return handleSkuImgSuccess(res, scope.row);
                            }
                          "
                          :before-upload="beforeImgUpload"
                        >
                          <img
                            v-if="scope.row.image"
                            :src="scope.row.image"
                            class="sku"
                          />
                          <i v-else class="el-icon-plus sku-uploader-icon"></i>
                        </el-upload>
                      </template>
                    </el-table-column>
                    <el-table-column prop="price" label="规格编码" width="150">
                      <template #default="scope">
                        <el-input v-model="scope.row.skuCode"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="sourcePrice" label="原价" width="120">
                      <template #default="scope">
                        <el-input
                          v-model="scope.row.sourcePrice"
                          maxlength="5"
                        ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="price" label="售价" width="120">
                      <template #default="scope">
                        <el-input
                          v-model="scope.row.price"
                          maxlength="5"
                        ></el-input>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="商品属性">
                  <el-button type="text" @click="addProperty"
                    >添加属性</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item prop="propertyList">
                  <el-table :data="form.propertyList" style="width: 50%">
                    <el-table-column
                      prop="propertyName"
                      label="属性名"
                      width="150"
                    >
                      <template #default="scope">
                        <el-input v-model="scope.row.propertyName"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="propertyValue"
                      label="属性值"
                      width="150"
                    >
                      <template #default="scope">
                        <el-input v-model="scope.row.propertyValue"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="300">
                      <template #default="scope">
                        <el-button
                          size="mini"
                          icon="Delete"
                          type="danger"
                          @click="deleteProperty(scope.$index)"
                          >删除</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="销售商品描述" prop="itemSaleDescription">
                  <CommonEditor
                    ref="commonEditor"
                    @editorData="changeText"
                  ></CommonEditor>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
    <SpecTable ref="specTable" @onClick="handleClickSpec"></SpecTable>
  </div>
</template>

<script setup name="ItemSale">
import {
  pageItemSale,
  selectItemSaleById,
  addItemSale,
  updateItemSale,
  deleteItemSale,
} from "@/api/itemSale";
import { listTag } from "@/api/tag";
import { listItemSaleClass } from "@/api/itemSaleClass";
import SpecTable from "@/components/common/SpecTable.vue";
import CommonEditor from "@/components/common/CommonEditor.vue";
import { ElMessageBox } from "element-plus";
import { ElMessage } from "element-plus";
import { ref, onMounted } from "vue";
import { formatTableColumnDate } from "@/utils/dateUtil";

let commonEditor = ref();
let specTable = ref();
let formValidate = ref();
let dialogImgVisible = ref(false);
let previewImage = ref("");
let imgList = ref([]);
let itemSaleClassOptions = ref([]);
let tagList = ref([]);
let showEdit = ref(false);
let query = ref({ size: 10, current: 0, total: 1 });
let form = ref({
  mainImage: "",
  itemSaleDescription: "",
  itemSaleSkuList: [],
  propertyList: [],
  specList: [],
  mainImageList: [],
});
let tableData = ref([]);
let rules = ref({
  itemCode: [{ required: true, message: "请输入商品编码", trigger: "blur" }],
  itemName: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
  itemSaleName: [
    { required: true, message: "请输入销售商品名称", trigger: "blur" },
  ],
  itemSalePrice: [
    {
      required: true,
      message: "请输入销售商品基础价格",
      trigger: "blur",
    },
  ],
  mainImage: [{ required: true, message: "请选择商品主图", trigger: "blur" }],
  itemSaleSkuList: [
    { required: true, message: "请选择商品规格属性", trigger: "blur" },
  ],
  itemSaleClassCode: [
    { required: true, message: "请选择营销分类", trigger: "blur" },
  ],
});

function changeText(val) {
  form.value.itemSaleDescription = val;
}
function currentChange(current) {
  query.value.current = current;
  loadData();
}
function loadTagData() {
  listTag({ tagType: 1 })
    .then((res) => {
      tagList.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
function loadItemSaleClassOptions() {
  listItemSaleClass()
    .then((res) => {
      itemSaleClassOptions.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
function loadData() {
  pageItemSale(query.value)
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
function showSkuTable() {
  specTable.value.dialogTableVisible = true;
}
function addProperty() {
  if (form.value.propertyList == null) {
    form.value.propertyList = [];
  }
  form.value.propertyList.push({ propertyName: "", propertyValue: "" });
}
function deleteProperty(index) {
  form.value.propertyList.splice(index, 1);
}
function resetForm() {
  form.value = {
    mainImage: "",
    itemSaleDescription: "",
    itemSaleSkuList: [],
    propertyList: [],
    specList: [],
    mainImageList: [],
  };
}
function backTable() {
  resetForm();
  showEdit.value = false;
}
function handleUpdate(row) {
  selectItemSaleById(row.itemSaleId)
    .then((res) => {
      showEdit.value = true;
      form.value = JSON.parse(JSON.stringify(res.data));
      form.value.tagIds =
        form.value.tagIds != null
          ? form.value.tagIds.split(",").map(Number)
          : null;
      imgList.value = [];
      form.value.mainImageList.forEach((mainImage) => {
        imgList.value.push({ url: mainImage });
      });
      commonEditor.value.html = form.value.itemSaleDescription;
    })
    .catch((err) => {
      console.log(err);
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
      deleteItemSale(row.itemSaleId)
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
  form.value.tagIds =
    form.value.tagIds != null ? form.value.tagIds.toString() : null;
  form.value.propertyJson = JSON.stringify(
    form.value.propertyList.filter(
      (property) => property.propertyName != "" && property.propertyValue != ""
    )
  );
  form.value.mainImage = form.value.mainImageList.join(",");
  formValidate.value.validate((valid) => {
    if (valid) {
      if (form.value.itemSaleId != null) {
        updateItemSale(form.value)
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
        addItemSale(form.value)
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
function handleImgPreview(file) {
  dialogImgVisible.value = true;
  previewImage.value = file.url;
}
function handleImgUploadSuccess(file) {
  form.value.mainImageList.push(file.data);
}
function handleImgRemove(file, fileList) {
  console.log(fileList);
  form.value.mainImageList = fileList.map((fileItem) => {
    return fileItem.url;
  });
}
function handleSkuImgSuccess(res, row) {
  row.image = res.data;
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
function getMainImage(img) {
  return img.split(",").map(String)[0];
}
function handleClickSpec(specList) {
  console.log(specList)
  specTable.value.dialogTableVisible = false;
  form.value.specList = specList;
  let newResult = specList.reduce(
    (a, b, c) => {
      let res = [];
      a.map((x) => {
        b.specValueList.map((y) => {
          res.push({ ...x, [b.specName]: y.specValueName });
        });
      });
      return res;
    },
    [{}]
  );
  var itemSaleSkuList = [];
  newResult.forEach((result) => {
    let spec = "";
    new Map(Object.entries(result)).forEach((key, val) => {
      spec += val + ":" + key + ",";
    });
    let itemSaleSku = {
      spec: spec.substring(0, spec.length - 1),
      specMapJson: JSON.stringify([...new Map(Object.entries(result))]),
      price: 0,
      sourcePrice: 0,
    };
    itemSaleSkuList.push(itemSaleSku);
  });
  form.value.itemSaleSkuList = itemSaleSkuList;
}

onMounted(() => {
  loadData();
  loadItemSaleClassOptions();
  loadTagData();
});
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
<style scoped>
.sku-uploader i {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.sku-uploader .el-upload:hover {
  border-color: #409eff;
}
.sku-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.sku {
  width: 80px;
  height: 80px;
  display: block;
}
.spec-tag {
  margin-right: 5px;
}
</style>
