<template>
  <div class="login-div">
    <div class="login-form-div">
      <h1 style="text-align: center; padding-bottom: 30px">Springbok</h1>
      <el-form ref="formValidate" :rules="rules" :model="form">
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="form.username"
            prefix-icon="User"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userPassword">
          <el-input
            type="password"
            v-model="form.userPassword"
            prefix-icon="Lock"
            @keyup.enter="handleLogin"
          ></el-input>
        </el-form-item>
        <el-form-item prop="verifyCode" v-if="isCaptcha">
          <el-input
            style="width: 50%"
            type="text"
            v-model="form.captcha"
            prefix-icon="Clock"
            @keyup.enter="handleLogin"
            placeholder="验证码"
          ></el-input>
          <img
            :src="captchaImage"
            mode="scaleToFill"
            style="width: 45%; margin-left: 5%; height: 40px"
            @click="refreshCaptcha"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="handleLogin"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <Slied ref="slied" @onSuccess="submitForm"></Slied>
  </div>
</template>

<script setup name="Login">
import Slied from "@/components/common/Slied.vue";
import { login, verifyCode } from "@/api/common";
import { selectSysConfigByKey } from "@/api/config";
import router from "@/router";
import { ref, onMounted } from "vue";
import { useStore } from "@/store";
import { ElMessage, formEmits } from "element-plus";

let store = useStore();
let form = ref({});
let slied = ref();
let formValidate = ref();
let rules = ref({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  userPassword: [{ required: true, message: "请输入密码", trigger: "blur" }],
});
let isCaptcha = ref(false);
let captchaImage = ref(verifyCode() + `?t=${Date.now()}`);
function handleLogin() {
  if (form.value.verifyMethod == "slider") {
    showSlied();
  } else {
    if (!form.value.captcha) {
      ElMessage.error("请输入验证码");
      return;
    }
    submitForm();
  }
}
function showSlied() {
  formValidate.value.validate((valid) => {
    if (valid) {
      slied.value.showSlied();
    }
  });
}
function submitForm() {
  login(form.value)
    .then((res) => {
      store.setUserInfo(res.data);
      ElMessage.success("登录成功");
      router.push("/home/index");
    })
    .catch((err) => {
      console.log(err);
    });
}
function refreshCaptcha() {
  captchaImage.value = verifyCode() + `?t=${Date.now()}`;
}

onMounted(() => {
  selectSysConfigByKey("VERIFY_METHOD")
    .then((res) => {
      form.value.verifyMethod = res.data.configValue;
      if (form.value.verifyMethod == 'captcha') {
        isCaptcha.value = true;
      } else {
        isCaptcha.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
</script>

<style scoped>
.login-div {
  background: linear-gradient(
    60deg,
    rgb(48, 49, 51) 0%,
    rgb(48, 49, 51) 55%,
    rgb(247, 247, 247) 33.33%,
    rgb(247, 247, 247) 100%
  );
  height: 100vh;
  width: 100%;
}
.login-form-div {
  position: absolute;
  margin: 0 auto;
  top: 24vh;
  bottom: 0;
  left: 65vh;
  right: 0;
  width: 300px;
  height: 350px;
  padding: 40px;
  background: #ffffff;
  border-radius: 5px;
}
.login-form-div .el-input {
  height: 40px;
}
.login-form-div .login-btn {
  width: 100%;
  height: 40px;
}
</style>
