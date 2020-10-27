var vueObj;
vueObj = new Vue({
        el :'#vueObj',
        data:{
            dict:{cardTypes:[]},
            baseInfo:{},
            billdata:{id:null},
            uploadcfg:{
                path:'/upload/file',
                downpath:"/down/file?token="
            }
        },

    mounted:function(){
        var self = this;
        $.post("/crm/api/managerAdd/list/dict").then(function(data){
            self.dict = data;
        });
        var id = $("#id").val();
        if (id != null && id != '') {
            $.post("/crm/api/managerAdd/info/view",{id:id}).then(function (data) {
                Vue.set(self, "baseInfo", data);
            });
        }
    },
    methods: {
        tabaction:function(){
                Vue.set(this.billdata,'id',$("#id").val());
                Vue.set(this.billdata,'bid',$("#bid").val());
                return true;
            },
        back:function () {
            window.location.href = "/crm/corporation/manageradd";
        },

        },
});

