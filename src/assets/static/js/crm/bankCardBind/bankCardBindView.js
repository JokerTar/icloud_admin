var vueObj;
vueObj = new Vue({
        el :'#vueObj',
        data:{
            dict:{compStatus:{},yesOrNo:{},cardProps:{},bankNames:[],compRoles:[]},
            compBac:{},
            corporation:{},
            selectedTr:{},
            compBacList:null,
            businessAccountList:null,
            billdata:{compCode:null}
        },
        created:function(){
           this.dosearch();
        },
        mounted:function(){
            var self=this;
            $.post("/crm/ajax/compBac/list/dict").then(function(data){
                self.dict = data;
                Vue.set(self.dict,'enableStatus',[{code:1,mark:"激活"},{code:0,mark:"待激活"}])
            });

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
            dosearch:function(){
                var self=this;
                var compCode = $.getUrlParam("compCode");
                var self=this;
                $.post("/crm/ajax/compBac/list",{compCode:compCode})
                    .then(function(data){
                        self.compBacList = data;
                    });
                $.post("/crm/ajax/businessAccount/list",{compCode:compCode})
                    .then(function(data){
                        self.businessAccountList = data;
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

            selected:function(model){
                Vue.set(this,'selectedTr',model);
                Vue.set(model,'checked',!model.checked);

            },
            viewAction:function(){
                var self=this;
                if(self.selectedTr==null||self.selectedTr.id==null){
                    layer.alert('请选择有效数据！',{icon: 7});
                    return false;
                }
                layer.load(1, {
                    shade: [0.1, '#fff'], //0.1透明度的白色背景
                })
                $.post("/crm/ajax/compBac/info/view",{bacCode:self.selectedTr.bacCode}).then(function(data){
                    layer.closeAll('loading');
                    Vue.set(self,'compBac',data);
                    $("#compBac-view").reveal("{data-animation:'none'}");
                })
            },
            back:function () {
                window.location.href = "/crm/corporation/corporation";
            }
        },

});

$("#view-ok").click(function(){
    $("#compBac-view").trigger('reveal:close');
});
