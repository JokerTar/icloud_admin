var vueObj;
vueObj = new Vue({
        el :'#vueObj',
        data:{
            pageInfo:{searchValue:null,pageNum:1,pageSize:20,total:0,starteDate:null,endDate:null,chgStatus:[],orderBy:null},
            checked:[],
            dict:{addStatus:[],cardTypes:[]},
            selectedTr:{}
        },
        created:function(){
            this.dosearch();
        },
        mounted:function(){
            var self = this;
            $.post("/crm/api/managerAdd/list/dict").then(function(data){
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
                self.pageInfo.chgStatus=[];
                self.checked.forEach(function (item) {
                    self.pageInfo.chgStatus.push(item.code);
                })
                $.http.$post("/crm/api/managerAdd/list",self.pageInfo)
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
                self.checked=[];
                self.pageInfo.starteDate = '';
                self.pageInfo.endDate = '';
            },
            updateAction:function(){
                var self=this;
                var managerAdd=self.selectedTr;
                var id=managerAdd.id;
                if(id==null||id==undefined||id.length==0){
                    layer.msg('请选择有效记录！', {icon: 7});
                    return false;
                }
                if(managerAdd.addStatus > 10 ){
                    layer.msg('该记录当前状态不允许该操作！', {icon: 7});
                    return false;
                }
                layer.load(1, {
                    //0.1透明度的白色背景
                    shade: [0.1, '#fff'],
                })
                //调用layout form提交 在组件上定义 ref="listLayoutA"
                self.$refs.listLayoutA.submit("/crm/corporation/manageradd/info/edit",{id:managerAdd.id,bid:managerAdd.bid});
                layer.closeAll('loading');
            },
            viewAction:function () {
                var self=this;
                var managerAdd=self.selectedTr;
                if(managerAdd==null||managerAdd.id==null){
                    layer.msg('请选择有效数据！',{icon: 7});
                    return false;
                }
                self.selectedTr = {};
                layer.load(1, {
                    //0.1透明度的白色背景
                    shade: [0.1, '#fff'],
                })
                //调用layout form提交 在组件上定义 ref="listLayoutA"
                self.$refs.listLayoutA.submit("/crm/corporation/manageradd/info/view",{id:managerAdd.id,bid:managerAdd.bid});
                layer.closeAll('loading');

            },
            deleteAction:function () {
                var self=this;
                var managerAdd=self.selectedTr;
                if(managerAdd==null||managerAdd.id==null){
                    layer.msg('请选择有效数据！',{icon: 7});
                    return false;
                }
                if(managerAdd.addStatus != 10){
                    layer.msg('该记录当前状态不允许该操作！',{icon: 7})
                    return false;
                }
                layer.confirm('确定删除此数据吗？', {
                    //按钮
                    btn : [ '确定', '取消' ]
                }, function(index) {
                    layer.close(index);
                    //此处请求后台程序，下方是成功后的前台处理……
                    layer.load(1, {
                        //0.1透明度的白色背景
                        shade: [0.1, '#fff'],
                    });
                    $.post("/crm/api/managerAdd/info/del",{id:managerAdd.id}).then(function(data){
                        layer.closeAll('loading');
                        if (data.code== 200) {
                            self.dosearch();
                            layer.msg('操作成功！',{icon: 1});
                        }else{
                            layer.msg('操作失败【'+data.message+'】！', {icon: 2});
                        }
                        Vue.set(self,'selectedTr',{});
                    });
                })
            },
            pass:function () {
                var self=this;
                var id=self.selectedTr.id;
                if(id==null||id==undefined||id.length==0){
                    layer.msg('请选择有效记录！',{icon: 7})
                    return false;
                }
                if(self.selectedTr.addStatus != 10){
                    layer.msg('该记录当前状态不允许该操作！',{icon: 7})
                    return false;
                }
                layer.confirm('确定审批通过选中数据吗？', {
                    btn : [ '确定', '取消' ]//按钮
                }, function(index) {
                    layer.close(index);
                    //此处请求后台程序，下方是成功后的前台处理……
                    var index=layer.load(1, {
                        //0.1透明度的白色背景
                        shade: [0.1, '#fff'],
                    })
                    $.post("/crm/managerAdd/api/info/pass", {id: id}).then(function (data) {
                        layer.closeAll('loading');
                        if (data.code==200) {
                            layer.msg('操作成功！', {icon: 1});
                            self.dosearch();
                        } else {
                            layer.msg('操作失败【'+data.message+'】！', {icon: 2});
                        }
                        Vue.set(self,'selectedTr',{});
                        self.dosearch();
                    })
                });
            },
            unPass:function () {
                var self=this;
                var id=self.selectedTr.id;
                if(id==null||id==undefined||id.length==0){
                    layer.msg('请选择有效记录！',{icon: 7})
                    return false;
                }
                if(self.selectedTr.addStatus != 10){
                    layer.msg('该记录当前状态不允许该操作！',{icon: 7})
                    return false;
                }
                layer.confirm('确定审批不通过选中数据吗？', {
                    btn : [ '确定', '取消' ]//按钮
                }, function(index) {
                    layer.close(index);
                    //此处请求后台程序，下方是成功后的前台处理……
                    var index=layer.load(1, {
                        //0.1透明度的白色背景
                        shade: [0.1, '#fff'],
                    })
                    $.post("/crm/api/managerAdd/info/unPass", {id: id}).then(function (data) {
                        layer.closeAll('loading');
                        if (data.code==200) {
                            layer.msg('操作成功！', {icon: 1});
                            self.dosearch();
                        } else {
                            layer.msg('操作失败【'+data.message+'】！', {icon: 2});
                        }
                        Vue.set(self,'selectedTr',{});
                        self.dosearch();
                    })
                });
            }
        }
});

