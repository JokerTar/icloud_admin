<template>
  <div>
    <div class="container">
      <form-label :label="'基本信息'"/>
      <div class="side-wrap">
        <div class="wrap-item">
          <el-tree
          :data="data"
          :props="defaultProps"
          highlight-current
          @node-click="handleNodeClick" />
        </div>
        <div class="wrap-item">
          <form-label :label="'票据信息'"/>
          <div class="info">
            <div class="item">
              <span class="label">票据编号</span>
              <span>{{form.bpNo}}</span>
            </div>
            <div class="item">
              <span class="label">层级</span>
              <span>{{form.curLevel}}</span>
            </div>

            <div class="item">
              <span class="label">票据金额</span>
              <span>{{form.bpAmt | toThousandFilter}}</span>
            </div>
            <div class="item">
              <span class="label">可用金额</span>
              <span>{{form.cdAmt | toThousandFilter}}</span>
            </div>

            <div class="item col-24">
              <span class="label">票据区间</span>
              <span>[{{form.cdSidx | formatNo}}, {{form.cdEidx | formatNo}}]</span>
            </div>
            <div class="item">
              <span class="label">出票日期</span>
              <span>{{form.issDate}}</span>
            </div>

            <div class="item">
              <span class="label">到期日期</span>
              <span>{{form.dueDate}}</span>
            </div>
          </div>

          <form-label :label="'出票人信息'"/>
          <div class="info">
            <div class="item">
              <span class="label">出票人名称</span>
              <span>{{form.outName}}</span>
            </div>
            <div class="item">
              <span class="label">企业编号</span>
              <span>{{form.outEnterNo}}</span>
            </div>
            <div class="item">
              <span class="label">统一社会信用代码</span>
              <span>{{form.outSocCode}}</span>
            </div>
            <div class="item">
              <span class="label">账号</span>
              <span>{{form.outAcctNo}}</span>
            </div>
            <div class="item">
              <span class="label">大额支付行号</span>
              <span>{{form.outAcctSvcr}}</span>
            </div>
            <div class="item">
              <span class="label">开户行名称</span>
              <span>{{form.outAcctSvnm}}</span>
            </div>
            <div class="item col-24">
              <span class="label">签名</span>
              <span>{{form.outSign}}</span>
            </div>
          </div>

          <form-label :label="'收票人信息'"/>
          <div class="info">
            <div class="item">
              <span class="label">收票人名称</span>
              <span>{{form.inName}}</span>
            </div>
            <div class="item">
              <span class="label">企业编号</span>
              <span>{{form.inEnterNo}}</span>
            </div>
            <div class="item">
              <span class="label">统一社会信用代码</span>
              <span>{{form.inSocCode}}</span>
            </div>
            <div class="item">
              <span class="label">账号</span>
              <span>{{form.inAcctNo}}</span>
            </div>
            <div class="item">
              <span class="label">大额支付行号</span>
              <span>{{form.inAcctSvcr}}</span>
            </div>
            <div class="item">
              <span class="label">开户行名称</span>
              <span>{{form.inAcctSvnm}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import rules from '@/views/mixins/rules'
import Model from '@/api/tp/bill/info'
import AddRouterQuery from '@/views/mixins/add-route-query'
import FormLabel from '@/views/pages/components/form-label'

export default {
  name: 'TpBillInfoView',
  components: { FormLabel },
  mixins: [rules, AddRouterQuery],
  data() {
    return {
      form: {},
      disabled: false,
      tableData: [],
      dict: {},
      data: [],
      defaultProps: {
        children: 'children',
        label: 'bpNo'
      }
    }
  },
  computed: {
    ...mapGetters([
      ''
    ])
  },
  created() {
    this.fetchDict()
    this.fetchDetail()

    this.$root.$on('tabsBack', (v) => {
      if (this.$options.name === 'TpBillInfoView') this.$router.push('/tp/bill/info')
    })
  },
  methods: {
    fetchDict() {
      Model.dict().then(res => {
        this.dict = res
      })
    },
    fetchDetail() {
      const { bizCode } = this.$route.query
      if (!bizCode) return

      Model.getInfo(bizCode).then(res => {
        console.log(res)
        if (res) this.form = res
        // this.data = [
        //   this.form
        // ]
        this.$set(this.data, 0, this.form)
      })
    },
    handleNodeClick(data) {
      console.log(data)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@/styles/editor.scss";

  .form-item{
    display: flex;
    margin-bottom: 22px;;
    .label{
      flex: 0 0 120px;
      padding-right: 15px;
    }
  }

  .container{
    .flex{
      display: flex;
      justify-content: space-between;
      .wrap{
        flex: 1;
        &:last-child{
          flex: 0 0 340px;
          display: flex;
          flex-direction: column;
          padding: 20px;
          border-left: 1px solid #DCDFE6;
        }
      }
    }

    .side-wrap{
      display: flex;
      justify-content: space-between;
      .wrap-item{
        flex: 1;
        &:first-child{
          flex: 0 0 280px;
          display: flex;
          flex-direction: column;
          padding-right: 15px;
        }
        &:last-child{
          border: 1px solid #DCDFE6;
          position: relative;
          top: -16px;
          >div{
            padding: 0 10px;
          }
        }
      }
    }
  }

</style>
