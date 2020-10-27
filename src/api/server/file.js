import RestModel from "@/api/restmodel";

class Model extends RestModel {
  uploadUrl = "/admin/third/file/store";
  downloadUrl = "/admin/third/file/download/origin";
  previewUrl = "/admin/third/file/preview";

  /**
   * 文件上传
   * **/
  fileStore(param = {}) {
    return this.updateModel(param, `/admin/third/file/store`);
  }

  /**
   * 文件下载
   * **/
  downLoad(fileToken = "") {
    return this.fetchDownLoad(
      {},
      `/admin/third/file/down/load?fileToken=${fileToken}`
    );
  }
}

const sysApp = new Model();

export default sysApp;
