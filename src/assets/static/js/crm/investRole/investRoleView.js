var vueObj;
vueObj = new Vue({
        el :'#vueObj',
        data:{
            dict:{invTypes:[],investList:[]},
            checked:[],
            billdata:{id:null},
            investRole:{}
        },

        mounted:function(){
            var self = this;
            var id = $("#id").val();
            if (id != null && id != '') {
                $.post("/crm/api/investRole/info/view",{id:id}).then(function (data) {
                    Vue.set(self, "investRole", data);
                });
            }
            $.post("/crm/api/investRole/list/dict").then(function(data){
                self.dict = data;
                self.infoView();
            });
        },
        methods: {
            tabaction:function(){
                Vue.set(this.billdata,'id',$("#id").val());
                Vue.set(this.billdata,'bid',$("#bid").val());
                return true;
            },
            infoView:function () {
                var self=this;
                self.investRole.investRoleList.forEach(function (ditem) {
                    self.dict.invTypes.forEach(function(item){
                        if(ditem.invType==item.code){
                            self.checked.push(item);
                        }
                    })
                })
            },
            back:function () {
                window.location.href = "/crm/corporation/investrole";
            },

        },
});

