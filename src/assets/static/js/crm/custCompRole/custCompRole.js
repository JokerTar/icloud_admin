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
        checkedList:[],
        billdata:{},
        shortCuts:[
            {code:10,mark:"核心企业作为授信主体",role:[20,30,40]},
            {code:20,mark:"核心企业成员单位",role:[30,40]},
            {code:30,mark:"供应商",role:[40]},
            {code:40,mark:"增信机构",role:[50]},
            {code:50,mark:"资金方",role:[60]},
            {code:60,mark:"机构投资人",role:[70]},
            {code:70,mark:"第三方服务机构",role:[40,80]}
        ],
        shortCut:null,
    },
    mounted:function(){
        var self=this;
        var compCode = $.getUrlParam("compCode");
        if(compCode!=null &&compCode!=''){
            $.post("/crm/ajax/compRole",{compCode:compCode}).then(function (data) {
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
    methods: {
        tabaction: function () {
            Vue.set(this.billdata, 'mark', $.getUrlParam("mark"));
            Vue.set(this.billdata, 'compCode', $.getUrlParam("compCode"));
            return true;
        },
        saveAction:function(){
            var self=this;
            var roleList=[];
            self.dict.compRoles.forEach(function (item) {
                if(item.checked==true){
                    roleList.push({compRole:item.code,compCode:$.getUrlParam("compCode")});
                }
            })
            if(roleList!=null&&roleList.length>0){
                var index= layer.load(1, {
                    shade: [0.1, '#fff'], //0.1透明度的白色背景
                })
                $.http.$post("/crm/ajax/compRole/info/save",roleList)
                    .then(function(data){
                        layer.close(index);
                        if(data.code==200){
                            layer.msg('保存成功！',{icon: 1});
                        }else{
                            layer.msg(data.message,{icon: 2});
                        }
                    });
            }else{
                layer.msg("请选择企业角色！",{icon: 7});
            }



        },

        selectRole:function(item,index){
            Vue.set(item,'checked',!item.checked);
        },
        shortCutAction:function(code){
            var self=this;
            self.dict.compRoles.forEach(function (dditem) {
                Vue.set(dditem,'checked',false);
            })
            self.shortCuts.forEach(function (item) {
                if(code==item.code){
                    item.role.forEach(function (ditem) {
                        self.dict.compRoles.forEach(function (dditem) {
                            if(ditem==dditem.code){
                                Vue.set(dditem,'checked',true);
                            }
                        })
                    })
                }
            })
        },

        back:function () {
            window.location.href = "/crm/corporation/corporation";
        }
    }
});
