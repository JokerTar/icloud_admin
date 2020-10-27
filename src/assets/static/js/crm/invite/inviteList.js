var vueObj;
vueObj = new Vue({
        el :'#vueObj',
        data:{
            pageInfo:{searchValue:null,pageNum:1,pageSize:20,total:0,starteDate:null,endDate:null,orderBy:null},
            dict:{compStatus:[]},
            selectedTr:{}
        },
        created:function(){
           this.dosearch();
        },
        mounted:function(){
            var self = this;
            $.post("/crm/api/invite/list/dict").then(function(data){
                self.dict = data;
            });
            $("#starteDate").change(function () {
                Vue.set(self.pageInfo,'starteDate',$(this).val());
            });
            $("#endDate").change(function () {
                Vue.set(self.pageInfo,'endDate',$(this).val());
            });
        },
        methods: {
            initSearch:function(){
                this.pageInfo = {pageNum:1,pageSize:20};
                this.searchValue=null;
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
            dosearch:function(){
                var self=this;
                $.http.$post("/crm/api/invite/list",self.pageInfo)
                    .then(function(data){
                        data.searchValue=self.pageInfo.searchValue;
                        data.starteDate=self.pageInfo.starteDate;
                        data.endDate=self.pageInfo.endDate;
                        data.orderBy=self.pageInfo.orderBy;
                        self.pageInfo = data;
                        if(self.pageInfo==null){ self.pageInfo={}; }
                    });
            },
            selected:function(model){
                Vue.set(model,'checked',!model.checked);
                if (model.checked) {
                    Vue.set(this,'selectedTr',model);
                }else {
                    Vue.set(this,'selectedTr',{});
                }
            },
            showMoreSearchClick:function(){
                // 清空高级搜索的条件
                this.clearMoreSearchItem();
                },
            clearMoreSearchItem : function() {
                var self=this;
                self.pageInfo.starteDate = '';
                self.pageInfo.endDate = '';
            },
        }
});