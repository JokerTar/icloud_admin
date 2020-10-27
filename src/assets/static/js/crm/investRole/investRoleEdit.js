var vueObj;
Vue.use(window.vuelidate.default);
const required = window.validators.required;
vueObj = new Vue({
        el :'#vueObj',
        data:{
            dict:{invTypes:[],investList:[]},
            investRole:{investTypes:[],investRoleList:[]},
            checked:[],
            v_valid:false,
            billdata:{id:null},
            billTitle:{}
        },

        mounted:function(){
            var self = this;
            var id = $("#id").val();
            if (id != null && id != '') {
                self.billTitle="修改投资机构角色信息";
                $.post("/crm/api/investRole/info/view",{id:id}).then(function (data) {
                    Vue.set(self, "investRole", data);
                });
            }else{
                self.billTitle="新增投资机构角色信息";
            }

            $.post("/crm/api/investRole/list/dict").then(function(data){
                self.dict = data;
                Vue.set(self.investRole, "createDate", data.createDate);
                Vue.set(self.investRole, "creater", data.creater);
                self.infoView();
            });
        },
    validations: {
        investRole: {
            compId:{
                required: required
            }
        }
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
            saveAction:function(){
                var self=this;
                self.investRole.investTypes=[];
                self.checked.forEach(function (item) {
                    self.investRole.investTypes.push(item.code);
                });
                Vue.set(self,'v_valid','true');
                if(this.$v.investRole.$invalid){
                    layer.msg('请校验单据，并修改红色标记部分!',{icon: 7});
                    return false;
                }
                var id = $("#id").val();
                if(!this.$v.investRole.$invalid){
                if (id != null && id != '') {
                    self.update();
                }else{
                    self.add();
                }
                }

            },
            add:function () {
                var self=this;
                //此处请求后台程序，下方是成功后的前台处理……
                var index= layer.load(1, {
                    shade: [0.1, '#fff'], //0.1透明度的白色背景
                })
                $.http.$post("/crm/api/investRole/info/add",self.investRole)
                    .then(function(data){
                        layer.close(index);
                        if(data.code==200){
                            $("#id").val(data.data.id);
                            Vue.set(self.investRole,'id',data.data.id);
                            Vue.set(self.investRole,'roleCode',data.data.roleCode);
                            layer.msg('操作成功！',{icon: 1});
                        }else{
                            layer.msg('操作失败！', {icon: 2});
                        }
                    });
            },
            update:function () {
                var self=this;
                //此处请求后台程序，下方是成功后的前台处理……
                var index= layer.load(1, {
                    shade: [0.1, '#fff'], //0.1透明度的白色背景
                })
                $.http.$post("/crm/api/investRole/info/update",self.investRole)
                    .then(function(data){
                        layer.close(index);
                        if(data.code==200){
                            layer.msg('操作成功！',{icon: 1});
                        }else{
                            layer.msg('操作失败！', {icon: 2});
                        }
                    });
            },
            checkInvestOnly:function () {
                var self=this;
                var compId=self.investRole.compId;
                var id=null;
                if(self.investRole.id!=null){
                    id=self.investRole.id;
                }

                //此处请求后台程序，下方是成功后的前台处理……
                var index= layer.load(1, {
                    shade: [0.1, '#fff'], //0.1透明度的白色背景
                })
                $.post("/crm/api/investRole/info/check",{id:id,compId:compId})
                    .then(function(data){
                        layer.close(index);
                        if(data!=null){
                            if(data.code==500){
                                layer.msg('投资机构已存在，不可重复添加',{icon: 7});
                                self.investRole.compId = "";
                            }
                        }else{
                            layer.msg('投资机构验证失败',{icon: 7});
                        }
                    });
            },
            back:function () {
                window.location.href = "/crm/corporation/investrole";
            }
        }
});

