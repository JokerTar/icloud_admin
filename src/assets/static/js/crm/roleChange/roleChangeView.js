var vueObj;
vueObj = new Vue({
        el :'#vueObj',
        data:{
            dict:{chgStatus:[],compRoles:[]},
            baseInfo:{files:[],roleList:[],roleChgList:[]},
            data:null,
            billdata:{},
            v_valid:false,
            shortCuts:[
                {code:1,mark:"核心企业作为授信主体",role:[1,2,3]},
                {code:2,mark:"核心企业成员单位",role:[2,3]},
                {code:3,mark:"供应商",role:[3]},
                {code:4,mark:"担保企业",role:[4]},
                {code:5,mark:"资金方",role:[5]},
                {code:6,mark:"证券公司资金方",role:[6]},
                {code:7,mark:"第三方服务机构",role:[3,7]}
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
            }else{
                return false;
            }
        },
        methods: {
            tabaction:function(){
                Vue.set(this.billdata,'chgCode',$.getUrlParam("chgCode"));
                return true;
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
            back:function () {
                window.location.href = "/crm/corporation/rolechange";
            }
        }
});
