<template>
  <div>
    <el-divider></el-divider>
    <div>
      <el-form
        label-position="top"
        label-width="100px"
        style="max-width: 460px"
        v-for="config in configList"
      >
        <el-form-item :label="config.label">
          <el-radio-group
            v-if="config.type == 'radio'"
            v-model="config.configValue"
            v-for="option in config.configOptionsList"
          >
            <el-radio
              :label="option.value"
              border
              @click="changeConfig(config.configKey, option.value)"
              >{{ option.label }}</el-radio
            >
          </el-radio-group>

          <el-switch
            v-if="config.type == 'switch'"
            v-model="config.configValue"
            size="large"
            active-text="开启"
            inactive-text="关闭"
            active-value="1"
            inactive-value="0"
            @click="changeConfig(config.configKey, config.configValue)"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup name="Log">
import { ref, onMounted } from "vue";
import { listSysConfig, updateSysConfig } from "@/api/config";

let configList = ref([]);

function loadData() {
  listSysConfig()
    .then((res) => {
      configList.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
function changeConfig(configKey, configValue) {
  console.log(configKey, configValue);
  updateSysConfig({ configKey: configKey, configValue: configValue })
    .then((res) => {
      
    })
    .catch((err) => {
      console.log(err);
    });
}
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.config-row {
  margin-top: 20px;
}
.el-radio {
  margin-right: 20px;
}
</style>
