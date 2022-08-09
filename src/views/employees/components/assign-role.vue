<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="close">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="12">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from "@/api/setting";
import { getUserDetailById } from "@/api/user";
import { assignRoles } from "@/api/employees";
export default {
  name: "Assignrole",
  data() {
    return {
      list: [], // 角色列表
      roleIds: [],
      roliid: "",
    };
  },
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false,
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null,
    },
  },
  methods: {
    async btnOk() {
      try {
        await assignRoles({
          id: this.roliid,
          roleIds: this.roleIds,
        });
        this.$message.success("修改成功");
        this.close();
      } catch (e) {
        console.log(e);
      }
    },
    close() {
      this.roleIds = [];
      this.$emit("update:showRoleDialog", false);
    },
    async getRoleList() {
      const { rows } = await getRoleList();
      this.list = rows;
    },
    async getUserDetailById(id) {
      this.roliid = id;
      const { roleIds } = await getUserDetailById(id);
      this.roleIds = roleIds;
    },
  },
  created() {
    this.getRoleList();
  },
};
</script>
