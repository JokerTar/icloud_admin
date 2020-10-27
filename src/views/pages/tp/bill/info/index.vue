<template>
  <div>
    <div class="pagination-size">
      <span>每页显示数量:</span>
      <el-pagination
        ref="pagination1"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="sizes"
        :page-sizes="[10, 20, 50, 100]"
        :total="total">
      </el-pagination>
    </div>
    <div class="table-list">
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        highlight-current-row
        @current-change="handleRowClick"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column sortable prop="isClean" label="是否结清" align="center">
          <template slot-scope="scope">{{scope.row.isClean | filterCredDict('yesOrNoEnum', dict)}}</template>
        </el-table-column>
        <el-table-column sortable prop="isLock" label="是否锁定" align="center">
          <template slot-scope="scope">{{scope.row.isLock | filterCredDict('yesOrNoEnum', dict)}}</template>
        </el-table-column>
        <el-table-column sortable prop="bpNo" label="票据编号" align="center">
          <template slot-scope="scope">
            <el-button @click="$router.push({path: '/tp/bill/info-view', query: {bizCode: scope.row.bizCode}})" type="text">{{ scope.row.bpNo }}</el-button>
          </template>
        </el-table-column>
        <el-table-column sortable prop="billType" label="票据类型" align="center">
          <template slot-scope="scope">{{scope.row.billType | filterCredDict('billTypeEnum', dict)}}</template>
        </el-table-column>
        <el-table-column sortable prop="bpAmt" label="票据金额	" align="right">
          <template slot-scope="scope">{{scope.row.bpAmt | toThousandFilter}}</template>
        </el-table-column>
        <el-table-column sortable prop="outName" label="出票人" align="center" />
        <el-table-column sortable prop="inName" label="收票人	" align="center" />
        <el-table-column sortable prop="issDate" label="出票日期" align="center">
          <template slot-scope="scope">{{scope.row.issDate|formatDate}}</template>
        </el-table-column>
        <el-table-column sortable prop="dueDate" label="到期日期" align="center">
          <template slot-scope="scope">{{scope.row.dueDate|formatDate}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-wrap">
      <el-pagination
        ref="pagination2"
        background
        layout="total, prev, pager, next"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/views/mixins/pagination'
import Model from '@/api/tp/bill/info'
import ThousandInput from '@/views/pages/components/thousand-input'
import { moneyTest } from '@/utils/toThousand'

export default {
  name: 'TpBillInfo',
  components: { ThousandInput },
  mixins: [Pagination],
  data() {
    return {
      dict: {},
      form: {
        isClean: [],
        isLock: [],
        minAmt: '',
        maxAmt: ''
      },
      total: 0,
      multipleSelection: [],
      currentChange: null,
      tableData: [],
      tree: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted() {
    this.fetchDict()
    this.fetchList()
  },
  methods: {
    fetchDict() {
      Model.dict().then(res => {
        this.dict = res
      })
    },
    fetchList() {
      const param = {
        ...this.Query,
        ...this.form
      }
      Model.list(param).then(res => {
        this.tableData = res.list
        this.total = res.total

        if (this.$refs.pagination1) this.$refs.pagination1.internalPageSize = res.pageSize
        if (this.$refs.pagination2) this.$refs.pagination2.internalPageSize = res.pageSize
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 点击行触发，选中或不选中复选框
    handleRowClick(row, column, event) {
      this.currentChange = row
    },
    changeAmt(val, type) {
      if (!moneyTest(val)) this.$set(this.form, type, '')
      console.log(this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
  .pagination-wrap{
    display: flex;
    justify-content: flex-end;
    margin: 20px 0;
  }
</style>
