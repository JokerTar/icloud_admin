var vueObj;
vueObj = new Vue({
    el :'#vueObj',
    data:{
        dict:{compRoles:[
                {code:20,mark:"核心企业",detail:"授信"},
                {code:30,mark:"成员单位",detail:"额度、开具"},
                {code:40,mark:"供应商",detail:"签收、信单、转让、融资"},
                {code:50,mark:"增信机构",detail:"担保"},
                {code:60,mark:"资金方",detail:"融资、资产管理"},
                {code:70,mark:"机构投资人",detail:"资产管理"},
                {code:80,mark:"第三方服务机构",detail:"结算体系"},
                {code:90,mark:"律师事务所",detail:"资产审查"},
                {code:100,mark:"中介服务机构",detail:"资产审查"}
            ]},
        baseInfo:{},
        corporation:{},
        checkedList:[],
        billdata:{},
        shortCut:null,
    },
    created: function () {
        var self=this;
        $.post("/crm/ajax/comp/edit/infoDict").then(function(data){
            Vue.set(self.dict,'compStatus',data.compStatus);
        });
        var compCode = $.getUrlParam("compCode");
        if(compCode!=null &&compCode!=''){
            $.post("/crm/ajax/compRole",{compCode:compCode,flag:null}).then(function (data) {
                Vue.set(self, "baseInfo", data);
                self.baseInfo.forEach(function (ditem) {
                    self.dict.compRoles.forEach(function(item){
                        if(ditem.compRole==item.code){
                            Vue.set(item,'checked',true);
                        }
                    })
                })
            });
        }else{
            return false;
        }
    },
    mounted:function(){
        var self=this;
        var compCode = $.getUrlParam("compCode");
        if (compCode != null && compCode != '') {
            $.post("/crm/ajax/comp/info/view",{compCode:compCode,flag:null}).then(function (data) {
                Vue.set(self, "corporation",data.custCompDTO);
            });
        }

    },
    methods: {
        tabaction: function () {
            Vue.set(this.billdata, 'mark', $.getUrlParam("mark"));
            Vue.set(this.billdata, 'compCode', $.getUrlParam("compCode"));
            return true;
        },

        back:function () {
            window.location.href = "/crm/corporation/corporation";
        }
    }
});
