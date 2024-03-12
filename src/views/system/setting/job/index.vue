<template>
  <div>
    <div>
      <el-row>
        <el-button type="primary" icon="Plus" @click="handleCreate"
          >新增
        </el-button>
      </el-row>
    </div>
    <el-divider></el-divider>
    <div>
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="任务key">
          <el-input
            v-model="query.jobKey"
            placeholder="请输入任务key"
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
    <div>
      <el-table
        v-loading="loading"
        :data="tableData"
        row-key="sysJobId"
        border
        default-expand-all
        stripe
      >
        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column prop="jobKey" label="任务key" width="100">
        </el-table-column>
        <el-table-column prop="bean" label="Bean" width="150">
        </el-table-column>
        <el-table-column prop="jobGroup" label="任务组" width="150">
        </el-table-column>
        <el-table-column prop="scheduleType" label="调度类型" width="100">
        </el-table-column>
        <el-table-column prop="cron" label="cron表达式" width="200">
        </el-table-column>
        <el-table-column prop="status" label="任务状态" width="150">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-text="是"
              inactive-text="否"
              :active-value="1"
              :inactive-value="2"
              @change="handleEnabledSysJob(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="200">
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" icon="Edit" @click="handleUpdate(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              icon="VideoPlay"
              @click="handleExecuteOnce(scope.row)"
              >执行一次</el-button
            >
            <el-button
              size="small"
              icon="Document"
              @click="showDetail(scope.row)"
              >执行日志</el-button
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

    <el-dialog title="定时任务" v-model="showEdit">
      <el-form
        ref="formValidate"
        :rules="rules"
        :model="form"
        label-width="100px"
      >
        <el-row>
          <el-col :span="10">
            <el-form-item label="任务key" prop="jobKey">
              <el-input v-model="form.jobKey"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="任务组" prop="jobGroup">
              <el-input v-model="form.jobGroup"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="执行Bean" prop="bean">
              <el-input v-model="form.bean"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="参数" prop="params">
              <el-input v-model="form.params"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="调度类型" prop="scheduleType">
              <el-radio-group v-model="form.scheduleType">
                <el-radio :label="1">cron表达式</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="cron表达式" prop="cron">
              <el-input v-model="form.cron"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="任务状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="2">不启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="是否立即执行" prop="startNow">
              <el-switch
                v-model="form.startNow"
                active-text="是"
                inactive-text="否"
              >
              </el-switch>
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
          <el-form-item>
            <el-button type="success" icon="Check" @click="submitForm"
              >保存
            </el-button>
            <el-button type="primary" icon="Back" @click="backTable"
              >返回
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog title="执行日志" v-model="showJobLog">
      <div>
        <div>
          <el-table
            :data="jobLogTableData"
            row-key="sysJobLogId"
            border
            default-expand-all
            stripe
          >
            <el-table-column type="index" label="序号" width="60">
            </el-table-column>
            <el-table-column prop="status" label="执行状态">
              <template #default="scope">
                <el-tag :type="scope.row.status === 1 ? 'primary' : 'danger'">{{
                  scope.row.status === 1 ? "成功" : "失败"
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="executeSpend" label="执行耗时">
              <template #default="scope">
                {{ scope.row.executeSpend }}ms
              </template>
            </el-table-column>
            <el-table-column
              prop="startTime"
              label="开始时间"
              :formatter="formatTableColumnDate"
            >
            </el-table-column>
          </el-table>
          <el-row type="flex" class="row-bg" justify="end">
            <el-pagination
              background
              layout="prev, pager, next"
              :current-page="jobLogQuery.current"
              :page-size="jobLogQuery.size"
              :total="jobLogQuery.total"
              @current-change="currentChangeJobLog"
            >
            </el-pagination>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="Job">
import { ElMessageBox } from "element-plus";
import { ElMessage } from "element-plus";
import { ref, onMounted } from "vue";
import {
  pageSysJob,
  addSysJob,
  updateSysJob,
  deleteSysJob,
  executeOnce,
  enabledSysJob,
} from "@/api/job";
import { pageSysJobLog } from "@/api/jobLog";
import { formatTableColumnDate } from "@/utils/dateUtil";

let loading = ref(true);
let formValidate = ref();
let showJobLog = ref(false);
let showEdit = ref(false);
let query = ref({ size: 10, current: 0, total: 1 });
let form = ref({ scheduleType: 1, startNow: 1, status: 1, startNow: false });
let tableData = ref([]);
let rules = ref({
  jobKey: [{ required: true, message: "请输入任务key", trigger: "blur" }],
  jobGroup: [{ required: true, message: "请输入任务组", trigger: "blur" }],
  bean: [{ required: true, message: "请输入执行Bean", trigger: "blur" }],
  scheduleType: [{ required: true, message: "请选择调度类型", trigger: "blur" }],
  cron: [{ required: true, message: "请输入cron表达式", trigger: "blur" }],
  status: [{ required: true, message: "请选择任务状态", trigger: "blur" }],
  startNow: [{ required: true, message: "请选择是否立即执行", trigger: "blur" }],
});
let jobLogTableData = ref([]);
let jobLogQuery = ref({ size: 10, current: 0, total: 1 });
let jobId = ref(0);

function resetForm() {
  form.value = {
    scheduleType: 1,
    startNow: 1,
    status: 1,
    startNow: false,
  };
}
function currentChange(current) {
  query.value.current = current;
  loadData();
}
function currentChangeJobLog(current) {
  jobLogQuery.value.current = current;
  loadJobLogData();
}
function loadData() {
  pageSysJob(query.value)
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
function loadJobLogData() {
  jobLogQuery.value.sysJobId = jobId;
  pageSysJobLog(jobLogQuery.value)
    .then((res) => {
      jobLogQuery.value.size = res.data.size;
      jobLogQuery.value.current = res.data.current;
      jobLogQuery.value.total = res.data.total;
      jobLogTableData.value = res.data.records;
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
function handleCreate() {
  resetForm();
  showEdit.value = true;
}
function handleDelete(row) {
  ElMessageBox.confirm("此操作将永久删除该记录, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteSysJob(row.sysJobId)
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
      if (form.value.sysJobId != null) {
        updateSysJob(form.value)
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
        addSysJob(form.value)
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
function showDetail(row) {
  jobId.value = row.sysJobId;
  loadJobLogData();
  showJobLog.value = true;
}
function handleExecuteOnce(row) {
  ElMessageBox.confirm("是否执行一次定时任务?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      executeOnce(row)
        .then((res) => {
          ElMessage.success("执行成功");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      ElMessage.message({
        type: "info",
        message: "取消",
      });
    });
}
function handleEnabledSysJob(row) {
  enabledSysJob(row.sysJobId, row.status)
    .then((res) => {
      ElMessage.success(row.status == 1 ? "开启成功" : "关闭成功");
    })
    .catch((err) => {
      console.log(err);
    });
}

onMounted(() => {
  loadData();
});
</script>

<style></style>
