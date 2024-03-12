<!-- <template>
  <div>
    <el-row v-show="!showEdit">
      <el-button type="primary" icon="Plus" @click="handleCreate"
        >新增
      </el-button>
    </el-row>
    <el-row v-show="showEdit">
      <el-button type="primary" icon="Back" @click="backTable">返回 </el-button>
      <el-button type="success" icon="Check" @click="submitForm"
        >保存
      </el-button>
    </el-row>
  </div>
  <el-divider></el-divider>
</template>

<script setup name="TopBtnBar">
import { ref } from "vue";

let emit = defineEmits(["handleCreate", "backTable", "submitForm"]);
let showEdit = ref(false);

function handleCreate() {
  emit("handleCreate");
}
function backTable() {
  emit("backTable");
}
function submitForm() {
  emit("submitForm");
}
defineExpose({ showEdit });
</script> -->
