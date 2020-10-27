var vueObj;
vueObj = new Vue({
        el :'#vueObj',
        data:{
            dict:{idTypes:[]},
            baseInfo:{},
            userNameChg:false,
            legalIdnum:false,
            billdata:{id:null},
            uploadcfg:{
                fileType:"CRM",
                path:'/upload/file',
                downpath:"/download/file?"
            },
        },
        created:function(){
            var self = this;
            $.post("/crm/ajax/personalChange/edit/infoDict").then(function(data){
                self.dict = data;
                Vue.set(self.baseInfo, "creater", self.dict.creater);
            });

        },
        mounted:function(){
            var self = this;
            var chgCode = $.getUrlParam("chgCode");
            if (chgCode != null && chgCode != '') {
                $.post("/crm/ajax/personalChange/info/view",{chgCode:chgCode,flag:"view"}).then(function (data) {
                    Vue.set(self, "baseInfo", data);
                    Vue.set(self.baseInfo, "creater", self.dict.creater);
                    if(data.userNameChg!=null&&data.userNameChg!=''){
                        self.userNameChg=true;
                    }
                    if(data.idTypeChg!=null&&data.idTypeChg!=''&&data.idCardChg!=null&&data.idCardChg!=''){
                        self.legalIdnum=true;
                    }
                });
            }
        },
         updated:function(){
        },

        methods: {
            tabaction:function(){
                Vue.set(this.billdata,'chgCode',$.getUrlParam("chgCode"));
                return true;
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
                window.location.href = "/crm/personal/change";
            },

        },
});

