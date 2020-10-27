export default {
  data() {
    return {
      action: process.env.API_IMG_UPLOAD, // 常规上传地址
      imageUrl: '',
      fileManager: [],
      imageName: '',
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    handleAvatarSuccess(response, file, fileList) {
      if (response.result !== 'ok') {
        this.$message.error(`上传失败!`)
        return false
      }
      const ActiveXObject = 'ActiveXObject'
      if (!!window.ActiveXObject || ActiveXObject in window) { // 判断是否为ie
        try {
          this.imageUrl = response.link
          this.imageName = response.OriginalFilename
        } catch (e) {
          this.imageUrl = JSON.parse(response.replace(/\\/g, '')).link
          this.imageName = JSON.parse(response.replace(/\\/g, '')).OriginalFilename
        }
      } else {
        this.imageUrl = response.link
        this.imageName = response.OriginalFilename
      }

      if (this.imageUrl) {
        this.form.headPortrait = this.imageUrl
        this.$set(this.form, 'headPortrait', this.imageUrl)
        this.$set(this.form, 'key', 'here')
        delete this.form.key
      }
    },
    beforeAvatarUpload(file, type) {
      const isJPG = file.type === 'image/jpeg'
      const isGIF = file.type === 'image/gif'
      const isPNG = file.type === 'image/png'
      const isBMP = file.type === 'image/bmp'
      // const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      const isDoc = file.type === 'application/msword' // .doc
      const isZip = file.type === 'application/x-zip-compressed' // .zip
      const isRar = file.type === 'application/octet-stream' || file.name.substr(file.name.lastIndexOf('.')).toLowerCase() === '.rar' // .rar rar类型file.type本地测试为空，所以截取后缀判断
      const isPdf = file.type === 'application/pdf' // .pdf
      const isLt20M = file.size / 1024 / 1024 < 20

      if (!isLt20M) {
        this.$message.error('上传图片大小不能超过 20MB!')
      }

      if (!this.uploadType || this.uploadType === 'image') { // 图片类型
        if (!isJPG && !isGIF && !isPNG && !isBMP) {
          this.$message.error('上传图片必须是JPG/GIF/PNG/BMP 格式!')
        }

        return (isJPG || isBMP || isGIF || isPNG) && isLt20M
      } else { // 文件类型
        if (!isJPG && !isGIF && !isPNG && !isBMP && !isDoc && !isZip && !isRar && !isPdf) {
          this.$message.error('上传图片必须是JPG/GIF/PNG/BMP/DOCX/DOC/PDF/ZIP/RAR 格式!')
        }

        return (isJPG || isBMP || isGIF || isPNG || isDoc || isZip || isRar || isPdf) && isLt20M
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
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
