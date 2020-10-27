var vueObj;
vueObj = new Vue({
        el :'#vueObj',
        data:{
            pageInfo:{searchValue:null,pageNum:1,pageSize:20,total:0,orderBy:null},
            dict:{status:[]},
            selectedTr:{}

        },
        created:function(){
           this.dosearch();
        },
        mounted:function(){
            var self = this;
            $.post("/crm/api/investRole/list/dict").then(function(data){
                self.dict = data;
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
                $.http.$post("/crm/api/investRole/list",self.pageInfo)
                    .then(function(data){
                        data.searchValue=self.pageInfo.searchValue;
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
            addAction:function () {
                layer.load(1, {
                    shade: [0.1, '#fff'], //0.1透明度的白色背景
                })
                //调用layout form提交 在组件上定义 ref="listLayoutA"
                this.$refs.listLayoutA.submit("/crm/corporation/investrole/info/edit",{id:null});
                layer.closeAll('loading');
            },
            updateAction:function(){
                var self=this;
                var investRole=self.selectedTr;
                var bid=self.selectedTr.bid;
                var id=investRole.id;
                if(id==null||id==undefined||id.length==0){
                    layer.alert('请选择有效记录！',{icon: 7});
                    return false;
                }
                layer.load(1, {
                    shade: [0.1, '#fff'], //0.1透明度的白色背景
                })
                //调用layout form提交 在组件上定义 ref="listLayoutA"
                self.$refs.listLayoutA.submit("/crm/corporation/investrole/info/edit",{id:id,bid:bid});
                layer.closeAll('loading');
            },
            viewAction:function () {
                var self=this;
                var bid=self.selectedTr.bid;
                var investRole=self.selectedTr;
                if(investRole==null||investRole.id==null){
                    layer.msg('请选择有效数据！',{icon: 7});
                    return false;
                }
                self.selectedTr = {};
                layer.load(1, {
                    shade: [0.1, '#fff'], //0.1透明度的白色背景

                })
                //调用layout form提交 在组件上定义 ref="listLayoutA"
                self.$refs.listLayoutA.submit("/crm/corporation/investrole/info/view",{id:investRole.id,bid:bid});
                layer.closeAll('loading');
            },
            deleteAction:function () {
                var self=this;
                var investRole=self.selectedTr;
                if(investRole==null||investRole.id==null){
                    layer.msg('请选择有效数据！',{icon: 7});
                    return false;
                }
                layer.confirm('确定删除此数据吗？', {
                    btn : [ '确定', '取消' ]//按钮
                }, function(index) {
                    layer.close(index);
                    //此处请求后台程序，下方是成功后的前台处理……
                    layer.load(1, {
                        shade: [0.1, '#fff'], //0.1透明度的白色背景
                    });
                    $.post("/crm/api/investRole/info/del",{id:investRole.id}).then(function(data){
                        layer.closeAll('loading');
                        if (data!= null) {
                            self.dosearch();
                            layer.msg('操作成功！',{icon: 1});
                        }
                        Vue.set(self,'selectedTr',{});
                    });
                })
            },
        }
});
