export default {
  data() {
    return {
      Query: {
        pageNum: 1,
        pageSize: 10,
        orderBy: 'createdTime'
      },
      total: 0,
      pageCount: 1
    }
  },
  watch: {
    '$refs.pagination1.internalPageSize'(n) {
      console.log(n)
    },
    '$refs.pagination2.internalPageSize'(n) {
      console.log(n)
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.Query.pageSize = val;
      this.Query.pageNum = 1
      this.fetchList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.Query.pageNum = val
      this.fetchList()
    }
  }
}
