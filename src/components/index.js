import ToolBar from "./PageTools";
import UploadExcel from "./UploadExcel";

export default {
  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.component(ToolBar.name, ToolBar);
    Vue.component(UploadExcel.name, UploadExcel);
  },
};
