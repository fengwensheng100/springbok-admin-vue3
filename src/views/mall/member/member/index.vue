<template>
  <div>
    <div>
      <el-row v-show="showEdit">
        <el-button type="primary" icon="Back" @click="backTable"
          >返回
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
            v-model="query.phone"
            placeholder="请输入手机号码"
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
        row-key="memberId"
        border
        default-expand-all
        stripe
      >
        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column prop="avatar" label="用户头像">
          <template #default="scope">
            <div>
              <el-image
                style="width: 70px; height: 70px"
                :src="scope.row.avatar"
              >
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="150">
        </el-table-column>
        <el-table-column prop="nickname" label="会员昵称"> </el-table-column>
        <el-table-column prop="phone" label="手机号" width="120"> </el-table-column>
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="scope">
            <el-tag :type="'primary'">
              {{ scope.row.gender }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="birthday" label="生日"> </el-table-column>
        <el-table-column prop="location" label="省市区" width="180">
        </el-table-column>
        <el-table-column prop="createdName" label="创建人"> </el-table-column>
        <el-table-column label="创建时间" prop="createdTime" :formatter="formatTableColumnDate" width="180">
        </el-table-column>
        <el-table-column prop="updatedName" label="修改人"> </el-table-column>
        <el-table-column label="修改时间" prop="updatedTime" :formatter="formatTableColumnDate" width="180">
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" icon="View" @click="handleView(scope.row)"
              >查看</el-button
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
          <el-form :model="form" label-width="80px">
            <el-row>
              <el-col :span="5">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="form.username"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="会员昵称" prop="nickname">
                  <el-input v-model="form.nickname"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="form.phone"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="性别" prop="gender">
                  <el-select
                    v-model="form.gender"
                    clearable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in genderOptions"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="生日" prop="birthday">
                  <el-input v-model="form.birthday"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="省市区" prop="location">
                  <el-input v-model="form.location"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup name="Member">
import { pageMember } from "@/api/member";
import { ref, onMounted } from "vue";
import { formatTableColumnDate } from "@/utils/dateUtil";

let showEdit = ref(false);
let query = ref({ size: 10, current: 0, total: 1 });
let form = ref({});
let tableData = ref([]);
let genderOptions = ref([
  {
    value: "男",
  },
  {
    value: "女",
  },
]);

function currentChange(current) {
  query.value.current = current;
  loadData();
}
function loadData() {
  pageMember(query.value)
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
function handleView(row) {
  showEdit.value = true;
  form.value = JSON.parse(JSON.stringify(row));
}

onMounted(() => {
  loadData();
});
</script>

<style></style>
