<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <ToolBar>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="add('0', 1)"
            >添加权限</el-button
          >
        </template>
      </ToolBar>
      <!-- 表格 -->
      <el-table :data="list" border="" row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column label="标识" prop="code" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button v-if="row.type === 1" type="text" @click="add(row.id, 2)"
              >添加</el-button
            >
            <el-button type="text" @click="editPerimission(row.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="delPermission(row.id)">
              删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 放置一个弹层 用来编辑新增节点 -->
    <el-dialog
      :title="`${showText}权限`"
      :visible="showDialog"
      @close="btnCancel"
    >
      <!-- 表单 -->
      <el-form
        ref="perForm"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width: 90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  updatePermission,
  addPermission,
  getPermissionDetail,
  delPermission,
  getPermissionList,
} from "@/api/permission";
import { transListtree } from "@/utils";
export default {
  mounted() {
    // setInterval(this.btnOK, 1);
  },
  data() {
    return {
      showDialog: false,
      // 需要展示的数据
      list: [],
      // formData数据和rules数据可以等到弹框做完的时候再去定义，
      formData: {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      },
      // 新增或者编辑弹框的校验规则，
      rules: {
        name: [
          { required: true, message: "权限名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "权限标识不能为空", trigger: "blur" },
        ],
      },
      // 是否展示新增或者编辑弹框
    };
  },
  created() {
    this.getPermissionList();
  },
  computed: {
    showText() {
      return this.formData.id ? "编辑" : "新增";
    },
  },
  methods: {
    async editPerimission(id) {
      const res = await getPermissionDetail(id);
      this.formData = res;
      this.showDialog = true;
    },
    async delPermission(id) {
      await this.$confirm("确认删除？");
      await delPermission(id);
      this.$message.success("删除成功");
      await this.getPermissionList();
    },
    add(pid, type) {
      this.formData.pid = pid;
      this.formData.type = type;
      this.showDialog = true;
    },
    async btnOK() {
      try {
        await this.$refs.perForm.validate();
        if (this.formData.id) {
          await updatePermission(this.formData);
        } else {
          await addPermission(this.formData);
        }
        // this.$message.success(`${showText}成功`);
        // this.btnCancel();
        await this.getPermissionList();
      } catch (e) {
        this.$message.error(`${showText}失败`);
      }
    },
    btnCancel() {
      this.formData = {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      };
      this.$refs.perForm.resetFields();
      this.showDialog = false;
    },
    async getPermissionList() {
      const res = await getPermissionList();
      this.list = transListtree(res, "0");
    },
  },
};
</script>
