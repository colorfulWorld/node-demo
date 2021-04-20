<template>
  <div class="user-login">
    <a-tabs
      v-model="activeKey"
      :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
    >
      <a-tab-pane key="login" tab="登录">
        <a-form-model
          ref="login"
          :model="loginForm"
          :rules="rules"
          autocomplete="off"
        >
          <a-form-model-item prop="username">
            <a-input
              placeholder="账户:todo_admin "
              v-model="loginForm.username"
              size="large"
              autocomplete="off"
            >
              <a-icon
                slot="prefix"
                type="user"
                :style="{ color: 'rgba(0,0,0,.25)' }"
              />
            </a-input>
          </a-form-model-item>
          <a-form-model-item prop="password">
            <a-input-password
              placeholder="密码: 123456"
              v-model="loginForm.password"
              size="large"
              autocomplete="off"
            >
              <a-icon
                slot="prefix"
                type="lock"
                :style="{ color: 'rgba(0,0,0,.25)' }"
              />
            </a-input-password>
          </a-form-model-item>
        </a-form-model>
      </a-tab-pane>

      <a-tab-pane key="register" tab="注册">
        <a-form-model
          ref="register"
          :model="registerForm"
          :rules="rules"
          autocomplete="off"
        >
          <a-form-model-item prop="username">
            <a-input
              placeholder="请输入账号"
              v-model="registerForm.username"
              size="large"
              autocomplete="off"
            >
              <a-icon
                slot="prefix"
                type="user"
                :style="{ color: 'rgba(0,0,0,.25)' }"
              />
            </a-input>
          </a-form-model-item>
          <a-form-model-item prop="password">
            <a-input-password
              placeholder="请输入密码"
              v-model="registerForm.password"
              size="large"
              autocomplete="off"
            >
              <a-icon
                slot="prefix"
                type="lock"
                :style="{ color: 'rgba(0,0,0,.25)' }"
              />
            </a-input-password>
          </a-form-model-item>
          <a-form-model-item prop="comfirmPassword">
            <a-input-password
              placeholder="请再次确认密码"
              v-model="registerForm.comfirmPassword"
              size="large"
              autocomplete="off"
            >
              <a-icon
                slot="prefix"
                type="lock"
                :style="{ color: 'rgba(0,0,0,.25)' }"
              />
            </a-input-password>
          </a-form-model-item>
        </a-form-model>
      </a-tab-pane>
    </a-tabs>
    <a-button
      size="large"
      type="primary"
      class="login-button"
      :loading="btnLoading"
      :disabled="btnLoading"
      @click="handleSubmit"
      >确定</a-button
    >
  </div>
</template>

<script>
import md5 from "md5";
import { mapActions } from "vuex";

export default {
  name: "Login",
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      activeKey: "login",
      isLoginError: false,
      btnLoading: false,
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 5, max: 20, message: "长度范围5-18", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 20, message: "长度范围5-18", trigger: "blur" },
        ],
        comfirmPassword: [
          { min: 5, max: 20, message: "长度范围5-18", trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
        ],
      },
      registerForm: {
        username: "",
        password: "",
        comfirmPassword: "",
      },
    };
  },
  created() {},
  methods: {
    ...mapActions("user", ["login", "register"]),
    handleSubmit() {
      this.$refs[this.activeKey].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          const { activeKey, loginForm, registerForm } = this;
          const config = {
            login: {
              api: this.login,
              params: {
                ...loginForm,
                password: md5(loginForm.password),
              },
              successCall: () => {
                this.$router.push({ path: "/" });
                this.$notification.success({
                  message: "登录成功",
                });
              },
              errorCall: () => {},
            },
            register: {
              api: this.register,
              params: {
                ...registerForm,
                password: md5(registerForm.password),
                comfirmPassword: md5(registerForm.comfirmPassword),
              },
              successCall: () => {
                this.$notification.success({
                  message: "注册成功，请登录",
                });
                this.activeKey = "login";
                this.$refs.register.resetFields();
              },
              errorCall: () => {},
            },
          };
          let { api, params, successCall, errorCall } = config[activeKey];
          api(params)
            .then(successCall)
            .catch(errorCall)
            .finally(() => {
              this.btnLoading = false;
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.user-login {
  width: 368px;
  margin: 0 auto;
  label {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
}
</style>
