var vueObj;
vueObj = new Vue({
        el :'#vueObj',
        data:{
            dict:{bankPrivs:[],enCardTypeEnum:[],yesOrNo:{},bankTypes:{},cardProps:{},enableStatus:{},cucyTypes:{},bankCitys:[],bankNames:[],compRoles:[]},
            compBac:{},
            selectedTr:{},
            flag:null,
            compBacList:null,
            product:null,
            businessAccountList:null,
            v_valid:false,
            billdata:{compCode:null}
        },

        created:function(){
         this.dosearch();
        },
        mounted:function(){
            var self=this;
            $.post("/crm/ajax/compBac/list/dict").then(function(data){
                self.dict = data;
            });
        },
        methods: {
            tabaction: function () {
            Vue.set(this.billdata, 'mark', $.getUrlParam("mark"));
            Vue.set(this.billdata, 'compCode', $.getUrlParam("compCode"));
            return true;
        },
            status:function(validation) {
                var err = this.checkdata&&validation.$invalid;
                return {
                    error: err,
                }
            },
            selected:function(model){
                Vue.set(this,'selectedTr',model);
                Vue.set(model,'checked',!model.checked);

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
            showEnum :function(code,enumStr){
                if(this.dict!=null)
                    var list = this.dict[enumStr];
                if(list!=null)
                    for(i=0;i<list.length;i++){
                        if(list[i].id == code){
                            return list[i].name;
                        }
                    }
            },
            dosearch:function(){
                var self=this;
                $.post("/crm/ajax/compBac/list",{compCode:$.getUrlParam("compCode")})
                    .then(function(data){
                        self.compBacList = data;
                    });
                $.post("/crm/ajax/businessAccount/list",{compCode:compCode})
                    .then(function(data){
                        self.businessAccountList = data;
                    });
            },
            getCitys: function(){
                var self = this;
                if(self.flag!=false){
                    Vue.set(self.compBac, "bankCity","");
                    Vue.set(self.compBac,'bankNo',"");
                    Vue.set(self.compBac,'bankName',"");
                }
                var pid=self.compBac.bankPriv;
                if(pid!=""&&pid!=undefined){
                    $.post("/data/ajax/area/list",{pid:pid}).then(function (data) {
                        Vue.set(self.dict, "bankCitys", data);
                    });
                }

            },
            getBankNames: function(){
                var self = this;
                if(self.flag!=false) {
                    Vue.set(self.compBac, 'bankNo', "");
                    Vue.set(self.compBac, 'bankName', "");
                }
                if(self.compBac.bankType!=null&&self.compBac.bankCity!=null) {
                    //此处请求后台程序，下方是成功后的前台处理……
                    var index= layer.load(1, {
                        shade: [0.1, '#fff'], //0.1透明度的白色背景
                    })
                    $.post("/bank/ajax/bank/list", {"bankType": self.compBac.bankType, "cityId": self.compBac.bankCity}).then(function (data) {
                        layer.close(index);
                        Vue.set(self.dict, "bankNames", data);
                    });
                }
            },
            getBankNo:function () {
                var self=this;
                if(self.dict.bankNames!=null){
                    self.dict.bankNames.forEach(function (item, index) {
                        if(item.bankName==self.compBac.bankName){
                            Vue.set(self.compBac,'bankNo',item.bankNo);
                        }
                    });
                }
            },
            viewAction:function(){
                var self=this;
                if(self.selectedTr==null||self.selectedTr.id==null){
                    layer.msg('请选择有效数据！',{icon: 7});
                    return false;
                }
                Vue.set(self,'flag',false);
                self.dict.bankCitys=[]
                self.dict.bankNames=[];
                layer.load(1, {
                    shade: [0.1, '#fff'], //0.1透明度的白色背景
                })
                $.post("/crm/ajax/compBac/info/view",{bacCode:self.selectedTr.bacCode}).then(function(data){
                    layer.closeAll('loading');
                    Vue.set(self.dict,'bankCitys',data.bankCitys);
                    Vue.set(self.dict,'bankNames',data.bankNames);
                    Vue.set(self,'compBac',data);
                    $("#compBac-view").reveal("{data-animation:'none'}");
                })
            },


            back:function () {
                window.location.href = "/crm/corporation/corporation";
            },
            ok:function () {
                $("#compBac-view").trigger('reveal:close');
            },
            getUnionCode:function () {
                var self=this;
                self.compBac.bankCode=self.compBac.bankType;
                self.getBankNames();

            }
        },

});


