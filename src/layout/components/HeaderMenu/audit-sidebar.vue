<template>
  <div class="audit-sidebar">
    <div class="tab-menu">
      <div style="display: flex;">
        <div class="label">流程审批</div>
        <ul>
            <li
            :class="{active: auditTabs === item.value}"
            v-for="item in formatRoutes"
            @click.stop="handleClick(item)"
            :key="item.value">{{item.label}}</li>
        </ul>
      </div>
      <el-button @click="handleBack" size="mini">返回</el-button>
      <!-- <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane :label="item.meta.title" :name="item.path" v-for="item in formatRoutes" />
      </el-tabs> -->
    </div>
    <!--  查看模式  -->
    <div class="process-cont" v-if="formatType === 'view'">
        <p class="ng-binding">
          <span>流程名称:</span>{{process.procName}}
          <span>流程状态:</span>{{process.status}}
          <span>开始时间:</span>{{process.startTime}}
          <span>结束时间:</span>{{process.endTime}}
          <span>流程耗时:</span>{{process.useTime}}天
        </p>
        <p class="ng-binding">
          <span>流程主题:</span>{{process.notic}}
        </p>
    </div>
    <!--  编辑模式  -->
    <div class="process-cont" v-if="formatType === 'editor'">
      <p class="ng-binding">
        <span>流程名称:</span>{{process.procName}}
      </p>
      <p class="ng-binding">
        <span>流程主题:</span>{{process.notic}}
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isExternal } from '@/utils/validate'
import path from 'path'

export default {
  name: 'AuditSidebar',
  data() {
    return {
      activeName: 'bill',
      type: '',
      views: [
        {
          label: '业务单据',
          value: 'bill'
        },
        {
          label: '审批记录',
          value: 'log'
        },
        {
          label: '流程图',
          value: 'process'
        },
        {
          label: '传阅',
          value: 'circulation'
        }
      ],
      editors: [
        {
          label: '业务单据',
          value: 'bill'
        },
        {
          label: '流程审批',
          value: 'approval'
        },
        {
          label: '审批记录',
          value: 'log'
        },
        {
          label: '流程图',
          value: 'process'
        },
        {
          label: '传阅',
          value: 'circulation'
        }
      ]
    }
  },
  computed: {
    formatType() {
      if (this.$route.path.includes('/audit/audit-view')) {
        return 'view'
      } else if (this.$route.path.includes('/audit/audit-editor')) {
        return 'editor'
      } else {
        return ''
      }
    },
    formatRoutes() {
      const path = this.$route.fullPath
      path.includes('/factoring/audit/audit-view') || this.$route.fullPath.includes('/factoring/audit/audit-editor')
      if (path.includes('/factoring/audit/audit-view')) {
        if (this.auditTabs === 'approval') {
          this.$store.dispatch('permission/setAuditTabs', 'bill')
        }
        return this.views
      } else if (path.includes('/factoring/audit/audit-editor')) {
        // if (this.auditTabs === 'approval') {
        //   this.$store.dispatch('permission/setAuditTabs', 'approval')
        // }
        return this.editors
      } else {
        return []
      }
    },
    ...mapGetters([
      'tabsActiveName',
      'process',
      'auditTabs'
    ])
  },
  watch: {
    tabsActiveName(n) {
      if (n) {
        // this.activeName = n
      }
    }
  },
  created() {
  },
  methods: {
    handleClick(route) {
      this.activeName = route.value
      this.$store.dispatch('permission/setAuditTabs', this.activeName)
    },
    resolvePath(basePath, routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(basePath)) {
        return basePath
      }

      return path.resolve(basePath, routePath)
    },
    handleBack() {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
  .audit-sidebar{
    margin: 20px 20px 0;
    .tab-menu{
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3px solid #fc9323;
      border-top: 3px solid #E3E4E9;
      background: #E3E4E9;
      .label{
        font-size: 14px;
        line-height: 35px;
        color: #666;
      }
      ul{
          border: none;
          margin-left: 40px;
          color: #666;
          cursor: pointer;
          li{
              font-size: 14px;
              padding: 0 15px;
              border: none;
              height: 35px;
              line-height: 35px;
              &.active{
                background: #fc9323;
                border-radius: 3px 3px 0 0;
                color: #fff;
              }
          }
      }
    }
  }
</style>
