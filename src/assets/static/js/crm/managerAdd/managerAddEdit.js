var vueObj;
Vue.use(window.vuelidate.default);
const required = window.validators.required;
vueObj = new Vue({
        el :'#vueObj',
        data:{
            dict:{cardTypes:[]},
            baseInfo:{idFiles:[],files:[]},
            billdata:{id:null},
            v_valid:false,
            uploadcfg:{
                path:'/upload/file',
                downpath:"/down/file?token="
            }
        },
        mounted:function(){
            var self=this;
            $.post("/crm/api/managerAdd/list/dict").then(function(data){
                self.dict = data;
            });
            var id = $("#id").val();
            if (id != null && id != '') {
                $.post("/crm/api/managerAdd/info/view",{id:id}).then(function (data) {
                    Vue.set(self, "baseInfo", data);
                    if(self.baseInfo.idFiles==null||self.baseInfo.idFiles==undefined){
                        Vue.set(self.baseInfo, "idFiles", []);
                    }
                    if(self.baseInfo.files==null||self.baseInfo.files==undefined){
                        Vue.set(self.baseInfo, "files", []);
                    }
                });
            }else{
                $.post("/crm/api/managerAdd/init/userInfo").then(function(data){
                    self.baseInfo = data;
                    Vue.set(self.baseInfo, "creater", self.dict.creater)
                    Vue.set(self.baseInfo, "createMob", self.dict.createMob)
                    if(self.baseInfo.idFiles==null||self.baseInfo.idFiles==undefined){
                        Vue.set(self.baseInfo, "idFiles", []);
                    }
                    if(self.baseInfo.files==null||self.baseInfo.files==undefined){
                        Vue.set(self.baseInfo, "files", []);
                    }
                });
            }
        },

    validations: {
        baseInfo: {
            userName:{
                required: required
            },
            mobile:{
                required:required
            },
            idCard:{
                required: required
            },
            idType:{
                required:required
            },
            email:{
                required: required
            }
        }
    },
        methods: {
            tabaction:function(){
                Vue.set(this.billdata,'compId',$("#compId").val());
                Vue.set(this.billdata,'id',$("#id").val());
                Vue.set(this.billdata,'bid',$("#bid").val());
                return true;
            },
            saveAction:function(){
                var self=this;
                var compId = $("#compId").val();
                var id=$("#id").val();
                self.baseInfo.compId=compId;
                var flag = false;
                Vue.set(self,'v_valid','true');
                if(this.$v.baseInfo.$invalid) {
                    layer.msg('请校验单据，并修改红色标记部分！',{icon: 7});
                    return false;
                }else{
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
                if(flag==true){
                if (id != null && id != '') {
                    self.update();
                }else{
                   self.add();
                }
                }
            },
            update:function () {
                var self=this;
                //此处请求后台程序，下方是成功后的前台处理……
                var index= layer.load(1, {
                    shade: [0.1, '#fff'], //0.1透明度的白色背景
                })
                $.http.$post("/crm/api/managerAdd/info/update",self.baseInfo)
                    .then(function(data){
                        layer.close(index);
                        if(data.code==200){
                            layer.msg('操作成功！',{icon: 1});
                        }else{
                            layer.msg('操作失败【'+data.message+'】！', {icon: 2});
                        }
                    });
            },
            add:function () {
                var self=this;
                //此处请求后台程序，下方是成功后的前台处理……
                var index= layer.load(1, {
                    shade: [0.1, '#fff'], //0.1透明度的白色背景
                })
                $.http.$post("/crm/api/managerAdd/info/add",self.baseInfo)
                    .then(function(data){
                        layer.close(index);
                        if(data.code==200){
                            $("#id").val(data.data.id);
                            Vue.set(self.baseInfo,'id',data.data.id);
                            Vue.set(self.baseInfo,'addCode',data.data.addCode);
                            layer.msg('操作成功！',{icon: 1});
                        }else{
                            layer.msg('操作失败【'+data.message+'】！', {icon: 2});
                        }
                    });
            },
            uploadFile:function(event,files,flag){
                files.pop();
                $(event.currentTarget).prev("div").children("input[type='file']").val('');
                $(event.currentTarget).prev("div").children("input[type='file']").click();
            },
            delFunction:function(item,flag){
                var self=this;
                if(flag==1){
                    var idFiles = self.baseInfo.idFiles;
                    idFiles.splice(item,1);
                    Vue.set(self.baseInfo,'idFiles',idFiles);
                }
                if(flag==2){
                    var files = self.baseInfo.files;
                    files.splice(item,1);
                    Vue.set(self.baseInfo,'files',files);
                }


            },
            back:function () {
                window.location.href = "/crm/corporation/manageradd";
            }
        }
});

