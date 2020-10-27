<template>
  <div class="file-preview">
    <span>{{data.fileName}}</span>
    <div v-if="data.fileToken && data.fileName">
      <el-button v-if="action.includes('show')" type="text" @click="handleShow">预览</el-button>
      <el-button v-if="action.includes('down')" type="text" @click="handleDown">下载</el-button>
    </div>

    <el-dialog
      title="文件预览"
      :visible.sync="dialogVisible"
      width="860"
      :before-close="handleClose">
      <div v-if="['jpg', 'gif', 'png', 'bmp', 'jpeg'].includes(fileType)">
        <img :src="url" alt="">
      </div>

      <div v-else-if="['pdf', 'PDF'].includes(fileType)">
        <pdf
          :src='url'
          :page='pdfPage'
          @num-pages='pageCount = $event'
          @page-loaded='pdfPage = $event'
          style="display: inline-block; width: 100%" />

        <div style="margin-bottom: 15px; text-align: right">
          <el-button type="primary" size="small" @click.stop="previousPage">
            上一页
          </el-button>
          <el-button type="primary" size="small" @click.stop="nextPage">
            下一页
          </el-button>
          <span>当前第{{ pdfPage }}页 / 共{{ pageCount }}页</span>
        </div>
      </div>

      <div v-else style="min-height: 400px;">
        <iframe :src="url" width="100%" height="400" border="0" />
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
export default {
  components: { pdf },
  props: {
    data: {
      type: Object
    },
    action: {
      type: Array,
      default() {
        return ['show', 'down']
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      url: '',
      base: process.env.VUE_APP_BASE_API,
      pdfPage: 1,
      pageCount: 0,
      fileType: null
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
      this.url = ''
      this.pdfPage = 1
    },
    handleShow() {
      // this.fileType = this.data.fileName.replace(/.+\./, '').toLowerCase()
      // this.url = this.base + `/admin/third/file/download/origin?fileToken=${this.data.fileToken}&originFileName=${this.data.fileName}`
      // this.dialogVisible = true

      this.fileType = this.data.fileName.replace(/.+\./, '').toLowerCase()
      const url = this.base + `admin/third/file/download/origin?fileToken=${this.data.fileToken}&originFileName=${this.data.fileName}`
      if (['docx', 'doc'].includes(this.fileType)) {
        const xdocUrl = 'http://www.xdocin.com/xdoc?_func=to&_format=html&_cache=1&_xdoc=' + encodeURIComponent(url)
        this.url = xdocUrl
      } else {
        this.url = url
      }
      this.dialogVisible = true
    },
    handleDown() {
      window.location.href = this.base + `/admin/third/file/download/origin?fileToken=${this.data.fileToken}&originFileName=${this.data.fileName}`
    },
    // PDF改变页数
    previousPage() {
      var p = this.pdfPage
      p = p > 1 ? p - 1 : this.pageCount
      this.pdfPage = p
    },
    nextPage() {
      var p = this.pdfPage
      p = p < this.pageCount ? p + 1 : 1
      this.pdfPage = p
    }
  }
}
</script>

<style lang="scss" scoped>
  .file-preview{
    display: inline-flex;
    width: 100%;
    // justify-content: space-between;
    align-items: center;
    >span{
      margin-right: 20px;
      // width: calc(100% - 96px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  img{
    max-width: 100%;
  }
</style>
