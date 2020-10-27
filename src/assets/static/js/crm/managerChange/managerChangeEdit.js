var vueObj;
Vue.use(window.vuelidate.default);
const required = window.validators.required;
vueObj = new Vue({
        el :'#vueObj',
        data:{
            dict:{idTypes:[],userList:[]},
            baseInfo:{idFiles:[],files:[],oldFiles:[],oldIdFiles:[],cuerCodeChg:null},
            userNameChg:false,
            legalIdnum:false,
            billdata:{},
            v_valid:false,
            uploadcfg:{
                fileType:"CRM",
                path:'/upload/file',
                downpath:"/download/file?"
            },
        },

        mounted:function(){
            var self = this;
            $.post("/crm/ajax/managerChange/edit/infoDict",{}).then(function(data){
                self.dict = data;
            });
            var compCode=$.getUrlParam("compCode");
            var chgCode=$.getUrlParam("chgCode");
            if (chgCode != null && chgCode != '') {
                $.post("/crm/ajax/managerChange/info/view",{chgCode:chgCode}).then(function (data) {
                    data.cuerCodeChg1=data.cuerCodeChg;
                    Vue.set(self, "baseInfo", data);
                    if(self.baseInfo.idFiles==null||self.baseInfo.idFiles==undefined){
                        Vue.set(self.baseInfo, "idFiles", []);
                    }
                    if(self.baseInfo.files==null||self.baseInfo.files==undefined){
                        Vue.set(self.baseInfo, "files", []);
                    }
                    Vue.set(self.dict, "userList", data.userList);
                });

            }else if(compCode!=null &&compCode!=''){
                $.post("/crm/ajax/managerChange/manager/view",{chgCode:compCode}).then(function (data) {
                    Vue.set(self, "baseInfo", data);
                    if(self.baseInfo.idFiles==null||self.baseInfo.idFiles==undefined){
                        Vue.set(self.baseInfo, "idFiles", []);
                    }
                    if(self.baseInfo.files==null||self.baseInfo.files==undefined){
                        Vue.set(self.baseInfo, "files", []);
                    }
                    Vue.set(self.dict, "userList", data.userList);
                });
            }else{
                return false;
            }

        },
    validations: {
        baseInfo: {
            cuerCodeChg:{
                required: required
            },
            cuerEmailChg:{
                required:required
            }
        }
    },
        methods: {
            tabaction:function(){
                Vue.set(this.billdata,'compCode',$("#compCode").val());
                Vue.set(this.billdata,'chgCode',$("#chgCode").val());
                return true;
            },

            getPhoneChgAndIdCardChg:function () {
                var self=this;
                if(self.baseInfo.cuerCodeChg!=null&&self.baseInfo.cuerCodeChg!=""){
                    self.dict.userList.forEach(function (item, index) {
                        if( item.cuerCode==self.baseInfo.cuerCodeChg){
                            Vue.set(self.baseInfo,'cuerPhoneChg',item.cuerPhone);
                            Vue.set(self.baseInfo,'idCardChg',item.idCard);
                            if(item.cuerCode!=null && item.cuerCode!=self.baseInfo.cuerCodeChg1) {
                                Vue.set(self.baseInfo, 'cuerEmailChg', item.cuerEmail);
                            }
                        }
                    });
                }else{
                    Vue.set(self.baseInfo,'cuerPhoneChg','');
                    Vue.set(self.baseInfo,'idCardChg','');
                    Vue.set(self.baseInfo,'emailChg','');
                }

            },
            saveAction:function(){
                var flag=false;
                var self=this;
                var chgCode=this.baseInfo.chgCode;
                Vue.set(self,'v_valid','true');
                if(this.$v.baseInfo.$invalid) {
                    layer.msg('请校验单据，并修改红色标记部分！',{icon: 7});
                    return false;
                }else{
                    var re = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                    if (!re.test(self.baseInfo.cuerEmailChg)) {
                        layer.msg('请输入正确的邮箱！',{icon: 7});
                        return false;
                    }
                    if(self.baseInfo.idFiles == null || self.baseInfo.idFiles.length ==0){
                        layer.msg('请上传证件！',{icon: 7});
                        return false;
                    }
                    if(self.baseInfo.files == null || self.baseInfo.files.length ==0){
                        layer.msg('请上传法人授权委托书！',{icon: 7});
                        return false;
                    }
                    flag = true;
                }
                if(flag == true){
                if (chgCode != null && chgCode != '') {
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
                $.http.$post("/crm/ajax/managerChange/info/add",self.baseInfo)
                    .then(function(data){
                        layer.close(index);
                        if(data.code==200){
                            $("#chgCode").val(data.data.chgCode);
                            Vue.set(self.baseInfo,'chgCode',data.data.chgCode);
                            layer.msg('操作成功！',{icon: 1});
                        }else{
                            layer.msg('操作失败【'+data.message+'】！', {icon: 2});
                        }
                    });
            },
            update:function () {
                var self=this;
                //此处请求后台程序，下方是成功后的前台处理……
                var index= layer.load(1, {
                    shade: [0.1, '#fff'], //0.1透明度的白色背景
                })
                $.http.$post("/crm/ajax/managerChange/info/update",self.baseInfo)
                    .then(function(data){
                        layer.close(index);
                        if(data.code==200){
                            layer.msg('操作成功！',{icon: 1});

                        }else{
                            layer.msg('操作失败【'+data.message+'】！', {icon: 2});
                        }
                    });
            },
            showDict :function(code,enumStr){
                if(this.dict!=null)
                    var list = this.dict[enumStr];
                if(list!=null)
                    for(i=0;i<list.length;i++){
                        if(list[i].code == code){
                            return list[i].mark;
                        }
                    }
            },
            uploadFile:function(event,files,flag){
                files.pop();
                $(event.currentTarget).prev("div").children("input[type='file']").val('');
                $(event.currentTarget).prev("div").children("input[type='file']").click();
            },

            back:function () {
                window.location.href = "/crm/corporation/managerchange";
            }
        }
});

