<template>
  <div class="navbar" :class="{blank: sidebarMode === 'vertical', 'topbar-nv':sidebarMode==='topbar'}">
    <hamburger v-show="sidebarMode === 'vertical'" id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb v-show="sidebarMode === 'vertical'" id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
<!--      <template v-if="device!=='mobile'">-->
<!--        <search id="header-search" class="right-menu-item" />-->

<!--        <error-log class="errLog-container right-menu-item hover-effect" />-->

<!--        <screenfull id="screenfull" class="right-menu-item hover-effect" />-->

<!--        <el-tooltip content="Global Size" effect="dark" placement="bottom">-->
<!--          <size-select id="size-select" class="right-menu-item hover-effect" />-->
<!--        </el-tooltip>-->

<!--      </template>-->

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <span>{{userInfo.userName}}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="dialogVisible = true">修改密码</el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      :append-to-body="true"
      width="680px"
      :before-close="handleClose">
      <div>
        <el-form ref="form" :rules="rules" :model="form" label-width="120px">
          <el-form-item label="旧密码" prop="oldPwd">
            <el-input v-model="form.oldPwd" type="password" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPwd">
            <el-input v-model="form.newPwd" type="password" />
          </el-form-item>
          <el-form-item label="确认新密码" prop="resetPwd">
            <el-input v-model="form.resetPwd" type="password" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose" size="mini">取 消</el-button>
          <el-button type="primary" @click="submit" size="mini">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import Model from "@/api/factoring/permission";

export default {
  data() {
    const resetPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请确认新密码！'))
      } else if (!this.form.newPwd) {
        return callback(new Error('请输入新密码！'))
      } else if (value !== this.form.newPwd) {
        return callback(new Error('确认密码与新密码不匹配！'))
      } else {
        callback()
      }
    }

    const resetNewPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请确认新密码！'))
      } else if (!this.form.newPwd) {
        return callback(new Error('请输入新密码！'))
      } else if (value === this.form.oldPwd) {
        return callback(new Error('新密码不能与旧密码一致！'))
      } else {
        callback()
      }
    }

    return {
      dialogVisible: false,
      title: '重置密码',
      form: {},
      tableData: [],
      userBizCode: null,
      rules: {
        newPwd: [
          { validator: resetNewPwd, trigger: 'change' },
          { required: true, message: '必填', trigger: 'change' }
        ],
        oldPwd: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        resetPwd: [
          { validator: resetPwd, trigger: 'change' },
          { required: true, message: '必填', trigger: 'change' }
        ]
      }
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'sidebarMode',
      'userInfo'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const { userName, mobile, employeeCode, companyBizCode } = this.userInfo

          //获取userBizCode
          const compParam = {
            deptBizCode:companyBizCode
          }
          Model.userList(compParam).then(res => {
            this.tableData = res;
            this.tableData.forEach(item => {
              if (item.deptUserBizCode === employeeCode) {
                this.userBizCode = item.bizCode;
              }
            })
            //修改密码
            const param = {
              userBizCode: this.userBizCode,
              newPwd: this.form.newPwd,
              oldPwd: this.form.oldPwd,
              userName,
              mobile,
              employeeCode
            }
            Model.resetpwd(param).then(() => {
              this.handleClose();
            }).catch(() => {
              this.handleClose();
            })
          })
        } else {
          return false;
        }
      })
    },
    handleClose() {
      this.dialogVisible = false;
      this.$refs.form.resetFields();
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  /*height: 50px;*/
  overflow: hidden;
  position: relative;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    /*line-height: 50px;*/

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #ffffff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        font-size: 14px;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.navbar.blank{
  height: 50px;
  .right-menu-item{
    color: #333333;
    line-height: 50px;
  }

  .avatar-wrapper{
    margin-top: 5px !important;
  }
}
.navbar.topbar-nv{
  background-color: transparent;
  height: 60px;
  .right-menu{
    background-color: transparent;
  }
  .right-menu-item{
    color: #333;
    line-height: 60px;
  }
}
</style>
