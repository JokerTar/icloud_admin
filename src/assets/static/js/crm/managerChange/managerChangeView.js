var vueObj;
vueObj = new Vue({
    el :'#vueObj',
    data:{
        dict:{idTypes:[],chgStatus:[]},
        baseInfo:{},
        userNameChg:false,
        legalIdnum:false,
        billdata:{},
        uploadcfg:{
            fileType:"CRM",
            path:'/upload/file',
            downpath:"/download/file?"
        },
    },
    mounted:function(){
        var self = this;
        $.post("/crm/ajax/managerChange/list/dict").then(function(data){
            self.dict = data;
        });
        var chgCode = $.getUrlParam("chgCode");
        if (chgCode != null && chgCode != '') {
            $.post("/crm/ajax/managerChange/info/view",{chgCode:chgCode}).then(function (data) {
                Vue.set(self, "baseInfo", data);
                if (data != null && data!= '') {
                    if (self.baseInfo.userNameChg != null && self.baseInfo.userNameChg != '') {
                        self.userNameChg = true;
                    }
                    if (self.baseInfo.legalIdnumChg != null && self.baseInfo.legalIdnumChg != '') {
                        self.legalIdnum = true;
                    }
                }
            });
        }
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
            window.location.href = "/crm/corporation/managerchange";
        },

    },
});

