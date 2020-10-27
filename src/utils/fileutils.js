import FileModel from '@/api/server/file'
import { Message, MessageBox } from 'element-ui'


const download = process.env.VUE_APP_BASE_API + FileModel.downloadUrl
const preview = process.env.VUE_APP_BASE_API + FileModel.previewUrl

export default {

  /**
   * 附件下载
   * @param fileToken 附件token
   * @param fileName 附件名称
   */
  handleDownload: function (fileToken, fileName) {
    MessageBox.confirm('', {
      message: '确定下载该文件？',
      title: '提示',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(action => {
      if (action === 'confirm') {
        const url = `${download}?fileToken=${fileToken}&originFileName=${fileName}`
        window.top.open(url)
      }
    }).catch(err => {

    })
  },

  /**
   * 附件预览
   * @param fileToken 附件token
   * @param fileName 附件名称
   */
  handlePreview: function (fileToken, fileName) {
    const fileUrl = `${download}?fileToken=${fileToken}&originFileName=${fileName}`
    if (fileName.endsWith('.pdf')) {
      window.top.window.open(`${window.location.origin}/static/pdfjs/web/viewer.html?file=` + encodeURIComponent(fileUrl))
    } else if (fileName.endsWith('.jpg') || fileName.endsWith('.png') || fileName.endsWith('.gif') || fileName.endsWith('.jpeg')) {
      window.top.window.open(`${preview}?fileToken=${fileToken}`)
    } else {
      Message.warning('该附件格式不支持预览！')
      return false
    }
  }
}


