var vueObj;
Vue.use(window.vuelidate.default);
const required = window.validators.required;
vueObj = new Vue({
        el :'#vueObj',
        data:{
            dict:{chgStatus:[],compRoles:[]},
            baseInfo:{fileList:[],roleList:[],roleChgList:[]},
            chgFlag:[],
            checkdata:false,
            data:null,
            billdata:{},
            v_valid:false,
            shortCuts:[
                {code:1,mark:"核心企业作为授信主体",role:[20,30,40]},
                {code:2,mark:"核心企业成员单位",role:[30,40]},
                {code:3,mark:"供应商",role:[40]},
                {code:4,mark:"增信机构",role:[50]},
                {code:5,mark:"资金方",role:[60]},
                {code:6,mark:"机构投资人",role:[70]},
                {code:7,mark:"第三方服务机构",role:[40,80]}
            ],
            shortCut:null,
            uploadcfg:{
                fileType:"CRM",
                path:'/upload/file',
                downpath:"/download/file?"
            },
        },
    created:function () {
        var self=this;
        $.post("/crm/ajax/roleChange/list/dict").then(function(data){
            self.dict = data;
        });
    },
        mounted:function(){
            var self=this;
            var compCode = $.getUrlParam("compCode");
            var chgCode=$.getUrlParam("chgCode");
            if (chgCode != null && chgCode != '') {
                $.post("/crm/ajax/roleChange/info/view",{chgCode:chgCode}).then(function (data) {
                    Vue.set(self, "baseInfo", data);
                    if(self.baseInfo.fileList==null||self.baseInfo.fileList==undefined){
                        Vue.set(self.baseInfo, "fileList", []);
                    }
                    for(j=0;j<self.dict.compRoles.length;j++){
                        if(data.roleList.indexOf(self.dict.compRoles[j].code*1)==-1){
                            self.dict.compRoles[j].role=false;
                        }else{
                            self.dict.compRoles[j].role=true;
                        }
                        if(data.roleChgList.indexOf(self.dict.compRoles[j].code*1)==-1){
                            self.dict.compRoles[j].roleChg=false;
                        }else{
                            self.dict.compRoles[j].roleChg=true;
                        }
                    }
                });
            }else if(compCode!=null &&compCode!=''){
                $.post("/crm/ajax/roleChange/role/view",{compCode:compCode}).then(function (data) {
                    Vue.set(self, "baseInfo", data);
                    Vue.set(self.baseInfo, "createdDate", new Date());
                    Vue.set(self.baseInfo, "roleChgList", []);
                    if(self.baseInfo.fileList==null||self.baseInfo.fileList==undefined){
                        Vue.set(self.baseInfo, "fileList", []);
                    }
                    for(j=0;j<self.dict.compRoles.length;j++){
                        if(data.roleList.indexOf(self.dict.compRoles[j].code*1)==-1){
                            self.dict.compRoles[j].role=false;
                        }else{
                            self.dict.compRoles[j].role=true;
                        }
                        if(data.roleList.indexOf(self.dict.compRoles[j].code*1)==-1){
                            self.dict.compRoles[j].roleChg=false;
                        }else{
                            self.dict.compRoles[j].roleChg=true;
                        }
                    }
                });
            }else{
                return false;
            }
        },
    validations: {
        baseInfo: {
            chgName:{
                required:function(){
                    return this.baseInfo.chgName!=null&&this.baseInfo.chgName!="";
                },
            }
        }
    },
        methods: {
            tabaction:function(){
                Vue.set(this.billdata,'compCode',$.getUrlParam("compCode"));
                Vue.set(this.billdata,'chgCode',$.getUrlParam("chgCode"));
                return true;
            },
            saveAction:function(){
                var self=this;
                Vue.set(self,'v_valid','true');
                Vue.set(self.baseInfo,'roleChgList',[]);
                var m=0;
                for(j=0;j<self.dict.compRoles.length;j++){
                    if(self.dict.compRoles[j].roleChg==true){
                        self.baseInfo.roleChgList[m]=self.dict.compRoles[j].code*1;
                        m++;
                    }
                }
                var chgCode=this.baseInfo.chgCode;
                    if (this.$v.baseInfo.$invalid) {
                        layer.msg('请校验单据，并修改红色标记部分！', {icon: 7});
                        return false;
                    }
                    if(this.baseInfo.roleChgList.length==0){
                        layer.msg('请选择变更后企业角色！', {icon: 7});
                        return false;
                    }
                    if(this.baseInfo.roleList.toString()==this.baseInfo.roleChgList.toString()){
                        layer.msg('企业角色未变更！', {icon: 7});
                        return false;
                    }
                    if (this.baseInfo.id != null && this.baseInfo.id != '') {
                        self.update();
                    } else {
                        self.add();
                    }
            },
            update:function(){
                var self=this;
                //此处请求后台程序，下方是成功后的前台处理……
                var index= layer.load(1, {
                    shade: [0.1, '#fff'], //0.1透明度的白色背景
                })
                $.http.$post("/crm/ajax/roleChange/info/update",self.baseInfo)
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
                $.http.$post("/crm/ajax/roleChange/info/add",self.baseInfo)
                    .then(function(data){
                        layer.close(index);
                        if(data.code==200){
                            Vue.set(self.baseInfo,'id',data.data.id);
                            Vue.set(self.baseInfo,'chgCode',data.data.chgCode);
                            layer.msg('操作成功！',{icon: 1});
                        }else{
                            layer.msg('操作失败【'+data.message+'】', {icon: 2});
                        }
                    });
            },
            selectRole:function(item,index){
                item.roleChg=!item.roleChg
               Vue.set(this.dict.compRoles,index,item);
            },
            shortCutAction:function(){
                for(i=0;i<this.shortCuts.length;i++){
                    if(this.shortCuts[i].code==this.shortCut){
                        for(j=0;j<this.dict.compRoles.length;j++){
                            if(this.shortCuts[i].role.indexOf(this.dict.compRoles[j].code*1)>-1){
                                this.dict.compRoles[j].roleChg=true;
                            }else{
                                this.dict.compRoles[j].roleChg=false;
                            }
                            Vue.set(this.dict.compRoles,j,this.dict.compRoles[j]);
                        }

                    }
                }
            },
            fileView:function () {
                var self=this;
                var id=$("#id").val();
                $.post("/crm/ajax/userChgFile/info/view",{chgId:id}).then(function (data) {
                    Vue.set(self.baseInfo, "files", data);
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
            uploadFile:function(event,model){
                $(event.currentTarget).prev("div").children("input[type='file']").val('');
                $(event.currentTarget).prev("div").children("input[type='file']").click();
            },
            back:function () {
                window.location.href = "/crm/corporation/rolechange";
            },

        }
});
