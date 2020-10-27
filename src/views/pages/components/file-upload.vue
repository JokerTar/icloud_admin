<template>
  <div style="display: inline-flex;">
    <el-button v-if="isButton" @click.stop="dialogVisible = true" type="text">上传</el-button>
    <a v-if="!isButton" @click.stop="dialogVisible = true" style="color: #1E9FFF;">上传</a>

    <el-dialog
      title="文件上传"
      :visible.sync="dialogVisible"
      width="860px"
      :before-close="handleClose">
      <div>
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="action"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-change="handleOnChange"
          :on-success="handleAvatarSuccess"
          :before-remove="beforeRemove"
          :before-upload="beforeAvatarUpload"
          :multiple="multiple"
          :file-list="fileList"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button v-show="showSubmitBtn" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Model from '@/api/server/file'

export default {
  name: 'FileUpload',
  props: {
    multiple: { // 是否支持多选 true: 可以多选  false: 单选
      type: Boolean,
      default: true
    },
    isButton: {
      type: Boolean,
      default: true
    },
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    },
    action: {
      type: String,
      default: process.env.VUE_APP_BASE_API + Model.uploadUrl
    },
    showSubmitBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      fileList: this.dataList
    }
  },
  created() {
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleClose() {
      this.$refs.upload.clearFiles()
      this.dialogVisible = false
    },
    handleAvatarSuccess(response, file, fileList) {
      if (!response.ok) {
        this.$message.error(`上传失败!`)
        return false
      }
      // const ActiveXObject = 'ActiveXObject'
      // if (!!window.ActiveXObject || ActiveXObject in window) { // 判断是否为ie
      //   try {
      //     this.imageUrl = response.link
      //     this.imageName = response.OriginalFilename
      //   } catch (e) {
      //     this.imageUrl = JSON.parse(response.replace(/\\/g, '')).link
      //     this.imageName = JSON.parse(response.replace(/\\/g, '')).OriginalFilename
      //   }
      // } else {
      //   this.imageUrl = response.link
      //   this.imageName = response.OriginalFilename
      // }

      // if (this.imageUrl) {
      //   this.form.headPortrait = this.imageUrl
      //   this.$set(this.form, 'headPortrait', this.imageUrl)
      //   this.$set(this.form, 'key', 'here')
      //   delete this.form.key
      // }
      this.fileList = fileList
      this.$emit('handleUploadSuccess', response, fileList, file)
    },
    handleOnChange(file, fileList) {
      this.$emit('handleFileChange', file, fileList)
    },
    beforeAvatarUpload(file, type) {
      const isJPG = file.type === 'image/jpeg'
      const isGIF = file.type === 'image/gif'
      const isPNG = file.type === 'image/png'
      const isBMP = file.type === 'image/bmp'
      // const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      const isDoc = (file.type === 'application/msword'
        || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'); // .doc
      const isZip = file.type === 'application/x-zip-compressed' // .zip
      const isRar = file.type === 'application/octet-stream' || file.name.substr(file.name.lastIndexOf('.')).toLowerCase() === '.rar' // .rar rar类型file.type本地测试为空，所以截取后缀判断
      const isPdf = file.type === 'application/pdf' // .pdf
      const isExcel = (file.type === 'application/vnd.ms-excel'
        || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      const isText = file.type === 'text/plain';
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isLt20M) {
        this.$message.error('上传文件大小不能超过 20MB!')
      }

      if (!isText && !isExcel && !isJPG && !isGIF && !isPNG && !isBMP && !isDoc && !isZip && !isRar && !isPdf) {
        this.$message.error('不支持的文件类型，上传文件必须是JPG/GIF/PNG/BMP/DOCX/DOC/PDF/ZIP/RAR/XLS/XLSX 格式!')
      }

      return (isText || isExcel || isJPG || isBMP ||
        isGIF || isPNG || isDoc || isZip || isRar || isPdf) && isLt20M;
      /*if (!this.uploadType || this.uploadType === 'image') { // 图片类型
        if (!isJPG && !isGIF && !isPNG && !isBMP) {
          this.$message.error('不支持的文件类型，上传文件必须是JPG/GIF/PNG/BMP/DOCX/DOC/PDF/ZIP/RAR 格式!')
        }

        return (isJPG || isBMP || isGIF || isPNG) && isLt20M
      } else { // 文件类型
        if (!isJPG && !isGIF && !isPNG && !isBMP && !isDoc && !isZip && !isRar && !isPdf) {
          this.$message.error('不支持的文件类型，上传文件必须是JPG/GIF/PNG/BMP/DOCX/DOC/PDF/ZIP/RAR 格式!')
        }

        return (isJPG || isBMP || isGIF || isPNG || isDoc || isZip || isRar || isPdf) && isLt20M
      }*/
    },
    handleRemove(file, fileList) {
      this.$emit('handleUploadSuccess', file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      if (file && (file.status==="success" || file.status === 'ready')) {
        return this.$confirm(`确定移除 ${file.name}？`)
      }
      return false;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleUploadError(err) {
      console.log(err)
      this.$message.error(`${JSON.parse(err.message).message}`)
    }
  }
}
</script>

<style lang="scss">
.el-upload-list__item{
  display: flex;
  .el-upload-list__item-name{
    display: inline-flex;
  }
}

  .upload-demo{
    display: flex;
    flex-wrap: wrap;
    .el-upload-list{
      flex: 0 0 100%;
    }
  }
</style>
