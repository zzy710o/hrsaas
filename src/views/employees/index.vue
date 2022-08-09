<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template #before>
          <span>共50条记录</span>
        </template>
        <template #after>
          <el-button type="primary" size="mini" @click="$router.push('/import')"
            >导入</el-button
          >
          <el-button type="danger" size="mini" @click="exportToExcel"
            >导出</el-button
          >
          <el-button type="warning" size="mini" @click="showDialog = true"
            >新增员工</el-button
          >
        </template>
      </ToolBar>
      <el-card>
        <el-table border stripe :data="list" style="width: 100%">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像">
            <template v-slot="{ row }">
              <el-avatar
                :src="row.staffPhoto"
                @click.native="showQrCode(row.staffPhoto)"
                style="
                  border-radius: 50%;
                  width: 100px;
                  height: 100px;
                  padding: 10px;
                "
              ></el-avatar>
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
            :formatter="formatEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable prop="timeOfEntry">
            <template v-slot="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState" />
          <el-table-column label="操作" sortable="" width="260">
            <template v-slot="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
                >查看</el-button
              >
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)"
                >角色</el-button
              >
              <el-button
                :disabled="checkPermission('DELETE_USER')"
                type="text"
                size="small"
                @click="del(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <AddDemployee :show-dialog.sync="showDialog" v-model="showDialog" />
    <el-dialog
      title="二维码"
      :visible.sync="showCodeDialog"
      @close="imgUrl = ''"
    >
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <Assignrole :showRoleDialog.sync="showRoleDialog" ref="roleRef" />
  </div>
</template>
<script>
import { getEmployeeList, delEmployee } from "@/api/employees";
import EmployeeEnum from "@/api/constant/employees";
import AddDemployee from "./components/add-employee";
import { formatDate } from "@/filters";
import QrCode from "qrcode";
import Assignrole from "./components/assign-role.vue";
import mixins from "@/mixin/checkPermission";
export default {
  components: {
    AddDemployee,
    Assignrole,
  },
  mixins: [mixins],
  data() {
    return {
      list: [],
      showDialog: false,
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0, // 总数
      },
      showCodeDialog: false,
      showRoleDialog: false,
    };
  },
  methods: {
    async editRole(id) {
      this.showRoleDialog = true;
      await this.$refs.roleRef.getUserDetailById(id);
    },
    showQrCode(url) {
      this.showCodeDialog = true;
      this.$nextTick(() => {
        QrCode.toCanvas(this.$refs.myCanvas, url);
      });
    },
    async exportToExcel() {
      const { export_json_to_excel } = await import(
        /* webpackChunkName: 'export2Excel'*/ "@/utils/Export2Excel"
      );
      const { rows } = await getEmployeeList({
        page: 1,
        size: this.page.total,
      });
      const headers = {
        姓名: "username",
        手机号: "mobile",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
      };
      const resData = this.formatterData(rows, headers);
      export_json_to_excel({
        header: Object.keys(headers), //表头 必填
        data: resData, // 具体数据 必填
        filename: "excel-list", //非必填
        autoWidth: true, //非必填
        bookType: "xlsx", //非必填
      });
    },
    formatterData(rows, headers) {
      return rows.map((item) => {
        // 中文key >>  映射表  >>英文key 通过item找到具体数据返回
        return Object.keys(headers).map((key) => {
          // 如果是时间进行格式化
          if (["timeOfEntry", "correctionTime"].includes(headers[key])) {
            return formatDate(item[headers[key]]);
          }
          // 如果是聘用形式进行格式化
          if (headers[key] === "formOfEmployment") {
            return (
              EmployeeEnum.hireType.find(
                (child) => child.id === +item[headers[key]]
              )?.value || "神秘人"
            );
          }
          return item[headers[key]];
        });
      });
    },
    changePage(page) {
      this.page.page = page;
      this.getEmployeeList();
    },
    // 获取员工列表
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.page);
      this.page.total = total;
      this.list = rows;
    },
    formatEmployment(row, column, cellValue) {
      const currentData = EmployeeEnum.hireType.find(
        (item) => item.id === cellValue
      )?.value;
      return currentData || "神秘人";
    },
    // 删除员工
    async del(id) {
      try {
        await this.$confirm("确认删除？");
        await delEmployee(id);
        this.$message.success("删除成功");
        await this.getEmployeeList();
      } catch (e) {
        console.log(e);
      }
    },
  },
  created() {
    this.getEmployeeList();
  },
};
</script>

<style></style>
