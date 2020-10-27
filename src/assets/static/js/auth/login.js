function login () {
  var vueObj = new Vue({
    el: '#vueObj',
    data: {

      loginForm: {
        username: '',
        userpassword: '',
        verifyCode: ''
      },
      // username: $('#username').val(),
      // userpassword: $('#password').val(),
      // verifyCode: '',
      verifyCodeBaseUrl: '/oauth/piccode',
      verifyTime: (new Date()).getTime(),
      loginStatus: false,
      isSaveCookie: false

    },
    mounted: function () {
      var msg = $('#msg')
      if (msg != null) {
        setTimeout(function () {
          $('#msg').hide()
        }, 3000)
      }
    },
    computed: {
      verifyCodeUrl: function () {
        var codeUrl = this.verifyCodeBaseUrl + '?dt=' + this.verifyTime
        return codeUrl
      }
    },
    methods: {
      loginValid: function () {
        var flag = true
        this.username = $.trim(this.username)
        this.userpassword = $.trim(this.userpassword)
        this.verifyCode = $.trim(this.verifyCode)
        if (this.username == null || this.username.length == 0) {
          flag = false
        }
        if (this.userpassword == null || this.userpassword.length == 0) {
          flag = false
        }
        if (this.verifyCode == null || this.verifyCode.length == 0) {
          flag = false
        }
        if (!flag) {
          this.loginStatus = false
        }
        return flag
      },
      login: function () {
        var url = '/login'
        this.loginStatus = true
        if (this.loginValid()) {
          $('#loginForm').submit()
        }
      },
      changeVerifyCode: function () {
        this.verifyTime = (new Date()).getTime()
      }
    }
  })
}

export {
  login
}
