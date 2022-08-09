<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="close">
    <el-form label-width="120px" :model="formData" :rules="rules" ref="Form">
      <el-form-item label="部门名称" prop="name">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="formData.name"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="formData.code"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <!-- 需要循环生成选项   这里做一下简单的处理 显示的是用户名 存的也是用户名-->
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
          v-model="formData.introduce"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button type="primary" size="small" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  getDepartDetail,
  updateDepartments,
} from "@/api/departments";
import { getEmployeeSimple } from "@/api/employees";
export default {
  name: "addDept",
  computed: {
    showTitle() {
      return this.formData.id ? "编辑部门" : "新增部门";
    },
  },
  data() {
    const checkCodeRepeat = async (rule, value) => {
      // 1、 接口获取所有的部门
      const { depts } = await getDepartments();
      let currentNodeChilren;
      if (this.formData.id) {
        currentNodeChilren = depts.filter(
          (item) => item.pid === this.node.pid && item.id !== this.node.id
        );
      } else {
        currentNodeChilren = depts.filter((item) => item.pid === this.node.id);
      }
      // 3、判断当前部门的所有子部门名称是否包含用户输入的部门名称
      const isRepeat = currentNodeChilren.some((item) => item.name === value);
      // 4、如果包含说明名称重复
      if (isRepeat) {
        return Promise.reject(new Error("部门名称重复"));
      }
    };
    const checkCode = async (rule, value) => {
      // 1、 接口获取所有的部门
      const { depts } = await getDepartments();
      let isRepeat;
      if (this.formData.id) {
        // --> 新增的编辑判断逻辑：编辑的时候，需要把自己过滤掉再进行判断
        isRepeat = depts.some(
          (item) => item.code === value && item.id !== this.treeNode.id
        );
      } else {
        isRepeat = depts.some((item) => item.code === value);
      }
      if (isRepeat) {
        return Promise.reject("部门code重复");
      }
      // --> 核心逻辑：用户输入的部门code跟任何部门的code都不能重复
    };
    return {
      formData: {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门名称要求1-50个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: checkCodeRepeat,
          },
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门编码要求1-50个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: checkCode,
          },
        ],
        manager: [
          { required: true, message: "部门负责人不能为空", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            trigger: "blur",
            min: 1,
            max: 300,
            message: "部门介绍要求1-50个字符",
          },
        ],
      },
      peoples: [],
    };
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    node: {
      type: Object,
      default: null,
    },
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple();
    },
    async submit() {
      await this.$refs.Form.validate();
      if (this.formData.id) {
        await updateDepartments(this.formData);
      } else {
        await addDepartments({
          ...this.formData,
          pid: this.node.id,
        });
      }
      this.$message.success(`${this.showTitle}成功`);
      this.$emit("getDepartments");
      this.close();
    },
    close() {
      this.formData = {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      };
      this.$refs.Form.resetFields();
      this.$emit("update:showDialog", false);
    },
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id);
    },
  },
};
</script>

<style></style>
