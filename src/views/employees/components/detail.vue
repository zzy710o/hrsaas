<template>
  <el-card class="container">
    <el-tabs>
      <el-tab-pane label="登录账户设置">
        <el-form
          label-width="120px"
          class="form"
          :model="FormData"
          :rules="rules"
          ref="setForm"
        >
          <el-form-item label="姓名" prop="username">
            <el-input style="width: 40%" v-model="FormData.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password2">
            <el-input
              style="width: 40%"
              v-model="FormData.password2"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveUserDetailById"
              >更新</el-button
            >
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="个人详情">
        <component :is="UserInfo" />
      </el-tab-pane>
      <el-tab-pane label="岗位信息">
        <component :is="JobInfo" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { getUserDetailById } from "@/api/user";
import { saveUserDetailById } from "@/api/employees";
import UserInfo from "@/views/employees/components/user-info";
import JobInfo from "@/views/employees/components/job-info";

export default {
  // components: {
  //   UserInfo,
  //   JobInfo,
  // },
  data() {
    return {
      UserInfo,
      JobInfo,
      FormData: {
        username: "",
        password2: "",
      },
      rules: {
        username: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        password2: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 9, message: "密码长度6-9位", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async getUserDetailById() {
      this.FormData = await getUserDetailById(this.$route.params.id);
    },
    async saveUserDetailById() {
      this.$refs.setForm.validate();
      try {
        await saveUserDetailById({
          ...this.FormData,
          password: this.FormData.password2,
        });
        this.$message.success("更新成功");
      } catch (e) {
        this.$message.error("更新失败");
      }
    },
  },
  created() {
    this.getUserDetailById();
  },
};
</script>

<style lang="scss" scoped>
.container {
  .form {
    margin-top: 30px;
    margin-left: 100px;
  }
}
</style>
