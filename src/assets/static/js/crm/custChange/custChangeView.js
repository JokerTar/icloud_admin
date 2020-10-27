var vueObj;
vueObj = new Vue({
        el :'#vueObj',
        data:{
            dict:{cardTypeList:[],areaTypeList:[],chgStatusList:[],provinceList:[],cityList:[], districtList:[],
                cityChgList:[], districtChgList:[],custScaleList:[],chgTypeList:[]},
            baseInfo:{},
            billdata:{},
            uploadcfg:{
                fileType:"CRM",
                path:'/upload/file',
                downpath:"/download/file?"
            },
        },

        mounted:function(){
            var self = this;
            $.post("/crm/ajax/custChange/dict").then(function(data){
                self.dict = data;
            });
            var chgCode=$.getUrlParam("chgCode");
            if (chgCode != null && chgCode != '') {
                $.post("/crm/ajax/custChange/info/view",{chgCode:chgCode,flag:null}).then(function (data) {
                    Vue.set(self, "baseInfo", data);
                });
            }
        },
        methods: {
            tabaction:function(){
                Vue.set(this.billdata,'chgCode',"abc");
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
            showEnum :function(code,enumStr){
                if(this.baseInfo!=null)
                    var list = this.baseInfo[enumStr];
                if(list!=null)
                    for(i=0;i<list.length;i++){
                        if(list[i].id == code){
                            return list[i].name;
                        }
                    }
            },
            back:function () {
                window.location.href = "/crm/corporation/change";
            },

        },
});

