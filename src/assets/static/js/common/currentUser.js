var currentUserVue;
    currentUserVue=new Vue({
        el: '#currentUser',
        data: {
            userInfo:{}
        },
        created: function () {
            var self=this;
            $.post("/rbac/ajax/user/current/info", {}).then(function (data) {
                if (data != null) {
                    Vue.set(self, 'userInfo', data);
                }
            })
        },
        mounted: function () {

        },
        computed: {
            photoSrc: function () {
                var self=this;
                var srcStr = "";
                if (self.userInfo != null && self.userInfo.photoToken != null && self.userInfo.photoToken.length > 0) {
                    srcStr = "/down/file?token=" + this.userInfo.photoToken;
                } else {
                    srcStr = "/images/photo.jpg";
                }
                return srcStr;
            },
        },
        updated: function () {
        },
        methods: {
            clickUser: function () {
                window.location.href = "/manage/setting/user"
            }
        }
    });

