<template>
  <el-row style="width: 100%" type="flex" justify="space-between">
    <el-col>
      <span>{{ treeData.name }}</span>
    </el-col>
    <el-col :span="8">
      <el-row type="flex" justify="space-between">
        <el-col>
          <span>{{ treeData.manager }}</span>
        </el-col>
        <el-col>
          <el-dropdown style="margin-right: 10px" @command="clickItem">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加部门</el-dropdown-item>
              <el-dropdown-item command="edit" v-if="isRoot"
                >编辑部门</el-dropdown-item
              >
              <el-dropdown-item command="del" v-if="isRoot"
                >删除部门</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from "@/api/departments";
export default {
  computed: {},
  props: {
    treeData: {
      type: Object,
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    async clickItem(type) {
      if (type === "add") {
        this.$emit("addDepts", this.treeData);
      } else if (type === "edit") {
        this.$emit("editDepts", this.treeData);
      } else {
        await this.$confirm("确认要删除吗？");
        await delDepartments(this.treeData.id);
        this.$message.success("删除成功！");
        this.$emit("getDepartments");
      }
    },
  },
};
</script>

<style></style>
