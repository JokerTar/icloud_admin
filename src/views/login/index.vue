<template>
  <div class="app">
    <div class="lg-header">
      <div class="w1200">
        <h1 class="logo"><a href="/"><img src="../../assets/logo.png" alt=""/><span>业务管理平台</span></a></h1>
      </div>
    </div>
    <div class="container">
      <div class="lg-box clearfix">
        <!--  -->
        <div class="lg-pic fl">
          <div class="img-group">
            <div class="img-bg"><img src="../../assets/login_bg.png"></div>
            <div class="pro01"><img src="../../assets/i_abs.png"></div>
            <div class="pro02"><img src="../../assets/i_pz.png"></div>
            <div class="pro03"><img src="../../assets/i_bl.png"></div>
            <div class="pro04"><img src="../../assets/i_jr.png"></div>
            <div class="pro05"><img src="../../assets/i_pj.png"></div>
          </div>
        </div>

        <div class="lg-cont fr">
          <div class="title">登 录</div>
          <div class="lg-form">
            <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-width="0" size="medium">
              <el-form-item prop="username">
                <div class="mnbox">
                  <span slot="label">账号</span>
                  <el-input
                    v-model="loginForm.username"
                    placeholder="请输入账号/手机号"
                    name="username"
                    type="text"
                    tabindex="1"
                    @keyup.enter.native.native.prevent="handleLogin"
                  />
                </div>
              </el-form-item>

              <el-form-item prop="password">
                <div class="mnbox">
                  <span slot="label">密码</span>
                  <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="loginForm.password"
                    :type="passwordType"
                    placeholder="请输入密码"
                    name="password"
                    tabindex="2"
                    @keyup.native="checkCapslock"
                    @blur="capsTooltip = false"
                    @keyup.enter.native.native.prevent="handleLogin"
                  />
                </div>
              </el-form-item>

<!--              <el-form-item prop="verifyCode">-->
<!--                <div class="mnbox">-->
<!--                  <span slot="label">验证码</span>-->
<!--                  <el-input-->
<!--                    ref="username"-->
<!--                    v-model="loginForm.verifyCode"-->
<!--                    placeholder="验证码"-->
<!--                    name="username"-->
<!--                    type="text"-->
<!--                    tabindex="3"-->
<!--                    @keyup.enter.native.native.prevent="handleLogin"-->
<!--                    style="width: 120px"-->
<!--                  />-->
<!--                  <a class="vcode">-->
<!--                    <img-->
<!--                      v-show="verifyCodeUrl!=null"-->
<!--                      :src="verifyCodeUrl"-->
<!--                      class="yzcode"-->
<!--                      title="点击更换验证码"-->
<!--                      @click="changeVerifyCode"-->
<!--                      height="40"-->
<!--                    >-->
<!--                  </a>-->
<!--                </div>-->
<!--              </el-form-item>-->

              <el-form-item>
                <drag-verify
                  ref="dragVerify"
                  :width="340"
                  :height="40"
                  text="请向右滑动滑块"
                  successText="验证通过"
                  handlerIcon="el-icon-d-arrow-right"
                  successIcon="el-icon-circle-check"
                  @passcallback="passCallBack">
                </drag-verify>
              </el-form-item>

              <el-form-item>
                <p><el-checkbox v-model="rememberMe" :true-label="1" :false-label="0" ></el-checkbox> 记住账号</p>
                <p><el-button type="primary" @click.native.prevent="handleLogin">登 录</el-button></p>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>

    <div class="lg-footer">
      <div class="w1200">
        <p>Copyright &copy; fehorizoncloud.com 版权所有 津ICP备2020006987号-1 <img src="../../assets/icon_gwab.png"> 津公网安备 12011602000517号</p>
        <p>为了不影响您的正常使用，建议使用 IE11 及以上版本、chrome45及以上、火狐55及以上版本或360浏览器9.1及以上版本</p>
      </div>
    </div>

  </div>
</template>

<script>
import SocialSign from './components/SocialSignin'
import Module from '@/api/server/verifyCode'
import dragVerify from './components/DragVerify.vue'
import { encrypt, decrypt } from '@/utils/cryptoJS'
import Cookies from 'js-cookie'

export default {
  name: 'Login',
  components: { SocialSign,dragVerify },
  data() {
    return {
      verifyTime: new Date().getTime(),
      verifyCodeBaseUrl: '',
      loginForm: {
        username: '',
        password: '',
        verifyCode: ' ',
        isPassing: false
      },
      loginRules: {
        username: [{ required: true, trigger: 'change', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'change', message: '请输入密码' }],
        // verifyCode: [{ required: true, trigger: 'change', message: '请输入验证码' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      rememberMe: 0
    }
  },
  computed: {
    verifyCodeUrl: function() {
      return `${this.verifyCodeBaseUrl}`
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.reset();
    this.getRememberMeToken();
  },
  mounted() {
    // if (this.loginForm.username === '') {
    //   this.$refs.username.focus()
    // } else if (this.loginForm.password === '') {
    //   this.$refs.password.focus()
    // }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      if (!this.loginForm.isPassing) {
        this.$message.error('请验证滑块');
        return false;
      }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {

              //记住账号
              if (this.rememberMe == 1) {
                const rememberMeKey = encrypt(this.loginForm.username + '&' + encrypt(this.loginForm.password, "HANSkcUwYi5nMP03"), "QamxvsR7jgZ54WTA");
                Cookies.set('rememberMe_token_admin', rememberMeKey, '7d');
              } else {
                Cookies.remove('rememberMe_token_admin');
              }

              this.$router.push({ path: '/' })
              this.loading = false
            })
            .catch(() => {
              this.reset();
              this.loading = false
            })
        } else {
          this.reset();
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    changeVerifyCode() {
      Module.fetchCode().then(res => {
        this.verifyCodeBaseUrl = res.img
        this.loginForm.vCodeToken = res.imgKey
      })
    },
    reset() {
      this.loginForm.isPassing = false;
      this.loginForm.vCodeToken = "";
      if(this.$refs.dragVerify != undefined){
        this.$refs.dragVerify.reset();
      }
    },
    passCallBack() {
      this.changeVerifyCode();
      this.loginForm.isPassing = true;
    },
    getRememberMeToken() {
      if (Cookies.get('rememberMe_token_admin')) {
        this.rememberMe = 1;
        const key = decrypt(Cookies.get('rememberMe_token_admin'), 'QamxvsR7jgZ54WTA');
        this.loginForm.username = key.split('&')[0];
        this.loginForm.password = decrypt(key.split('&')[1], 'HANSkcUwYi5nMP03');
      }
    }
  }
}
</script>

<style lang="scss" >
.app {background: #fff;}
.lg-header  {height: 85px}
.lg-header .w1200{width: 1200px; margin:0 auto;}
.lg-header .logo {padding: 30px 0; float: none; width: auto; height: 40px; margin: 0;}
.lg-header .logo img{height: 40px; display: inline-block; vertical-align: middle;}
.lg-header .logo span{display: inline-block; font-size: 15px; color: #666; line-height: 24px; margin: 8px 0; border-left: 1px solid #ddd; padding-left: 12px; margin-left: 12px; }
.lg-footer{ padding: 15px 0; font-size: 13px; color: #999; line-height: 24px; text-align: center; clear: both;height: 95px}
.lg-footer a{color: #999;}
.container{min-height: calc(100vh - 200px)}

.lg-box{width: 1200px; height: 490px; margin: 0 auto;}
.lg-pic{width: 785px; height: 490px; margin-top: 20px;}
.lg-pic img{display: inline-block;}
.img-group{position: relative; padding-top: 10px;}
.img-bg{margin-left: 20px; -webkit-animation: sacle 6s .1s infinite linear both; animation: sacle 6s .1s infinite linear both;}
.img-group .pro01{position: absolute; left: 160px; top:0px; -webkit-animation: left_effect .5s .1s linear both; animation: left_effect .5s .1s  linear both;}
.img-group .pro02{position: absolute; left: 490px; top:55px; -webkit-animation: left_effect 1s .6s linear both; animation: left_effect 1s .6s  linear both;}
.img-group .pro03{position: absolute; left: 350px; top:200px; -webkit-animation: top_effect 1s .7s linear both; animation: top_effect 1s .7s  linear both;}
.img-group .pro04{position: absolute; left: 22px; top:245px; -webkit-animation: lfrg_effect 3s 1s infinite linear both; animation: lfrg_effect 3s 1s  infinite linear both;}
.img-group .pro05{position: absolute; left: 500px; top:245px; -webkit-animation: top_effect 1s .9s linear both; animation: top_effect 1s .9s  linear both;}
@keyframes sacle {
  0% {transform: scale(1);}
  50% {transform: scale(1.05);}
  100% {transform: scale(1);}
}
@keyframes top_effect {
  0% {transform: translateY(-20px);opacity: 0;}
  100% {transform: translateY(0);opacity: 1;}
}
@keyframes left_effect {
  0% {transform: translateX(-20px);opacity: 0;}
  100% {transform: translateX(0);opacity: 1;}
}
@keyframes lfrg_effect {
  0% {transform: translateX(-20px);opacity: 1;}
  50% {transform: translateX(0px);opacity: 1;}
  100% {transform: translateX(-20px);opacity: 1;}
}

.lg-cont{width: 400px; height: 500px; padding:60px 0 0 60px; background: #fff; border-radius:8px 0 0 8px; box-sizing: border-box;}
.lg-cont .title{font-size: 24px; color: #222; line-height: 32px; padding: 0 20px 30px; position: relative;}
.lg-cont .title:before{content:''; position: absolute; left: 0; top: 5px; width: 4px; height: 22px; background: #0066ff;}
.lg-form .el-form-item{margin-bottom: 26px;}
.lg-form .el-input--medium{font-size: 16px;}
.lg-form .el-form-item--medium .el-form-item__label {line-height: 24px; color:#333;}
.lg-form .mnbox{width:340px; height: 40px; border: 1px solid #E3E3E3; border-radius:4px; position: relative; padding-left: 10px; box-sizing: border-box; overflow: hidden;}
.lg-form .mnbox span{float: left; display:block; width: 50px; line-height: 40px;}
.lg-form .mnbox .el-input{width: calc(100% - 50px); display: block; float: left; box-sizing: border-box;}
.lg-form .el-input__inner{background: transparent; border: none; font-size: 14px; padding:0 10px; color: #333; border-radius:4px;}
.lg-cont .el-input .el-input__inner::placeholder{color:#CCC;}
.lg-form .el-input.is-active .el-input__inner,.lg-form .el-input__inner:focus{border:none;}
.lg-form .el-form-item__error { color: #E66045;}
.lg-form .el-form-item.is-error .el-input__inner, .lg-form .el-form-item.is-error .el-input__inner:focus{ border-color: #E3E3E3;}
.lg-form .vcode{display:inline-block; position: absolute; width: 120px; height: 40px; right: 0px; top: 0px; border-radius:0 4px 4px 0; overflow: hidden;}
.lg-form .el-button{width: 340px; background: #0066FF;border-color:#0066FF; border-radius:4px; height: 48px; font-size: 14px; margin-top: 10px;}

.switch-con .tit{font-size:18px; color:#333; text-align:center; line-height:24px;  margin-bottom:15px;}
.acc-search{background:#fff; margin-bottom: 20px;}
.acc-search .el-input__inner{border:1px solid #ddd;border-radius:20px;}
.acc-list{width:340px; padding-right:10px; max-height:260px; overflow-y:auto;}
.acc-list li{font-size:14px; color:#333; margin-bottom:15px;}
.acc-list li a{display:block; line-height:24px; border:1px solid #ddd; border-radius: 4px; position: relative;}
.acc-list li a:hover{background:#81c0ef; border:1px solid #81c0ef; color:#fff;}
.acc-list li a:focus{background:#81c0ef; border:1px solid #81c0ef; color:#fff;}
.acc-list li.disabled{background:#ddd;  border-radius: 4px;}
.acc-list li.disabled:hover a{border:1px solid #ddd;}
.acc-list li.current a{background:#81c0ef; border:1px solid #81c0ef; color:#fff;}
.acc-list li a span{display: table-cell;}
.acc-list li a .name{width: auto; padding:6px 10px; border-radius: 4px 0 0 4px;}
.acc-list li a .btn{display:none; background: #56a9e8; padding: 6px 0; border-radius:0 4px 4px 0; color: #fff; width: 80px; text-align: center;}
.acc-list li a:hover .name{width: 250px;}
.acc-list li a:hover .btn{display: table-cell; color: #fff; vertical-align: middle;}
.acc-list li.current a .btn{color: #fff;}
.acc-list li.disabled:hover a{background: #ddd; color: #333;}
.acc-list li.disabled:hover a .btn{background: #aaa; color: #333}

.lg-cont input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
  -webkit-text-fill-color: #333!important;
}


</style>


