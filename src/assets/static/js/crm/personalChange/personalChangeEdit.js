var vueObj;
Vue.use(window.vuelidate.default);
const required = window.validators.required;
vueObj = new Vue({
        el :'#vueObj',
        data:{
            dict:{idTypes:[]},
            baseInfo:{files:[]},
            checkdata:false,
            userNameChg:false,
            legalIdnum:false,
            data:null,
            billdata:{id:null},
            v_valid:false,
            uploadcfg:{
                fileType:"CRM",
                path:'/upload/file',
                downpath:"/download/file?"
            },
        },
    created:function () {
        var self=this;
        $.post("/crm/ajax/personalChange/edit/infoDict").then(function(data){
            self.dict = data;
            Vue.set(self.baseInfo, "creater", self.dict.creater);
        });
    },
        mounted:function(){
            var self=this;
            var userCode = $.getUrlParam("userCode");
            var chgCode=$.getUrlParam("chgCode");
            if (chgCode != null && chgCode != '') {
                $.post("/crm/ajax/personalChange/info/view",{chgCode:chgCode,flag:"edit"}).then(function (data) {
                    Vue.set(self, "baseInfo", data);
                    Vue.set(self.baseInfo, "creater", self.dict.creater);
                    if(self.baseInfo.files==null||self.baseInfo.files==undefined){
                        Vue.set(self.baseInfo, "files", []);
                    }
                    if(data.userNameChg!=null&&data.userNameChg!=''){
                        self.userNameChg=true;
                    }
                    if(data.idTypeChg!=null&&data.idTypeChg!=''&&data.idCardChg!=null&&data.idCardChg!=''){
                        self.legalIdnum=true;
                    }
                });
            }else if(userCode!=null &&userCode!=''){
                $.post("/crm/ajax/personal/info/view",{userCode:userCode,flag:"edit"}).then(function (data) {
                    Vue.set(self, "baseInfo", data);
                    Vue.set(self.baseInfo, "creater", self.dict.creater);
                    Vue.set(self.baseInfo, "createdCode", self.dict.createdCode);
                    Vue.set(self.baseInfo, "createdDate", new Date());
                    if(self.baseInfo.files==null||self.baseInfo.files==undefined) {
                        Vue.set(self.baseInfo, "files", []);
                    }
                });
            }else{
                return false;
            }
            Vue.set(self.baseInfo, "creater", self.dict.creater);
        },
    validations: {
        baseInfo: {
            userNameChg:{
                required:function(){
                    return this.userNameChg?(this.baseInfo.userNameChg!=null&&this.baseInfo.userNameChg!=""):true;
                },
            },
            idTypeChg:{
                required:function(){
                    return this.legalIdnum?(this.baseInfo.idTypeChg!=null&&this.baseInfo.idTypeChg!=""):true;
                },
            },
            idCardChg:{
                required:function(){
                    return this.legalIdnum?(this.baseInfo.idCardChg!=null&&this.baseInfo.idCardChg!=""):true;
                },
            },

        }
    },
        methods: {
            tabaction:function(){
                Vue.set(this.billdata,'userCode',$.getUrlParam("userCode"));
                Vue.set(this.billdata,'chgCode',$.getUrlParam("chgCode"));
                return true;
            },
            saveAction:function(){
                var self=this;
                Vue.set(self,'v_valid','true');
                var chgCode=self.baseInfo.chgCode;
                if(self.userNameChg || self.legalIdnum) {
                    if (this.$v.baseInfo.$invalid) {
                        layer.msg('请校验单据，并修改红色标记部分！', {icon: 7});
                        return false;
                    }
                    if( self.legalIdnum) {
                        var files = self.baseInfo.files;
                        if (files == null || files == undefined || files.length == 0) {
                            layer.msg('请上传文件资料！', {icon: 7});
                            return false;
                        }
                        if(self.baseInfo.idCardChg.length<6){
                            layer.msg('证件号不能少于6位！', {icon: 7});
                            return false;
                        }
                    }

                    if (chgCode != null && chgCode != '') {
                        self.update();
                    } else {
                        self.add();
                    }
                }else{
                    layer.msg('请变更个人信息！', {icon: 7});
                }
            },
            update:function(){
                var self=this;
                //此处请求后台程序，下方是成功后的前台处理……
                var index= layer.load(1, {
                    shade: [0.1, '#fff'], //0.1透明度的白色背景
                })
                $.http.$post("/crm/ajax/personalChange/info/update",self.baseInfo)
                    .then(function(data){
                        layer.close(index);
                        if(data.code==200){
                            layer.msg('操作成功！',{icon: 1});
                        }else{
                            layer.msg('操作失败【'+data.message+'】', {icon: 2});
                        }
                    });
            },
            add:function () {
                var self=this;
                //此处请求后台程序，下方是成功后的前台处理……
                var index= layer.load(1, {
                    shade: [0.1, '#fff'], //0.1透明度的白色背景
                })
                $.http.$post("/crm/ajax/personalChange/info/add",self.baseInfo)
                    .then(function(data){
                        layer.close(index);
                        if(data.code==200){
                            $("#id").val(data.data.id);
                            Vue.set(self.baseInfo,'chgCode',data.data.chgCode);
                            layer.msg('操作成功！',{icon: 1});
                        }else{
                            layer.msg('操作失败【'+data.message+'】', {icon: 2});
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
            showChg:function (type) {
                var self=this;
                if(type == 1){
                    if(self.userNameChg){
                        self.userNameChg = false;
                        self.baseInfo.userNameChg = "";
                    }else{
                        self.userNameChg = true;
                    }
                }
                if(type == 2){
                    if(self.legalIdnum){
                        self.legalIdnum = false;
                        self.baseInfo.idCardChg = "";
                        self.baseInfo.idTypeChg="";
                        self.baseInfo.files=[];
                    }else{
                        self.legalIdnum = true;

                    }
                }

            },
            uploadFile:function(event,model){
                model.pop();
                $(event.currentTarget).prev("div").children("input[type='file']").val('');
                $(event.currentTarget).prev("div").children("input[type='file']").click();
            },
            back:function () {
                window.location.href = "/crm/personal/change";
            }
        }
});
