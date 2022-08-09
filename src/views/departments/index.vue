<template>
  <div class="dashboard-container" v-loading="loading">
    <div class="app-container">
      <el-card class="box-card">
        <TreeTool :treeData="company" :isRoot="false" @addDepts="addDepts" />
      </el-card>
      <el-tree :data="departs" :props="defaultProps" default-expand-all>
        <template v-slot="{ data }">
          <TreeTool
            :treeData="data"
            :isRoot="true"
            @getDepartments="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </template>
      </el-tree>
    </div>
    <!------------ 添加部门弹层组件 ------------>
    <AddDept
      :showDialog.sync="showDialog"
      :node="node"
      @close="showDialog = false"
      @addDepts="getDepartments"
      ref="reference"
    />
    <!------------ 添加部门弹层组件 ------------>
  </div>
</template>

<script>
import TreeTool from "./components/tree-tool.vue";
import AddDept from "./components/add-dept.vue";
import { getDepartments } from "@/api/departments";
import { transListtree } from "@/utils";
export default {
  data() {
    return {
      node: {},
      loading: false, // 用来控制进度弹层的显示和隐藏
      showDialog: false,
      defaultProps: {
        children: "children",
        label: "name",
      },
      departs: [
        {
          name: "总裁办",
          manager: "曹操",
          children: [{ name: "董事会", manager: "曹丕" }],
        },
        { name: "行政部", manager: "刘备" },
        { name: "人事部", manager: "孙权" },
      ],
      company: { name: "江苏传智播客教育科技股份有限公司", manager: "负责人" },
    };
  },
  components: { TreeTool, AddDept },
  methods: {
    async getDepartments() {
      try {
        this.loading = true;
        const res = await getDepartments();
        console.log(res);
        // 替换首页数据
        this.company = {
          name: res.companyName,
          manager: res.companyManage || "管理员",
          id: "",
        };
        // 替换部门数据
        this.departs = transListtree(res.depts, "");
        this.loading = false;
      } catch {
        this.loading = false;
      }
    },
    addDepts(node) {
      this.showDialog = true; // 显示弹层
      this.node = node;
    },
    editDepts(node) {
      this.showDialog = true; // 显示弹层
      this.node = node;
      this.$refs.reference.getDepartDetail(node.id);
    },
  },
  created() {
    this.getDepartments();
  },
};
</script>

<style scoped lang="scss">
.dashboard-container {
  .app-container {
    width: 850px;
    height: 500px;
    margin: 50px auto;
    .box-card {
      font-size: 14px;
    }
  }
}
</style>
