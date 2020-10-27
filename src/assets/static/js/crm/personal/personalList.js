var vueObj;
vueObj = new Vue({
    el :'#vueObj',
    data:{
        pageInfo:{searchValue:null,searchName:null,pageNum:1,pageSize:20,total:0,starteDate:null,endDate:null,orderBy:null},
        dict:{enableStatus:[],idTypes:[],yesOrNo:[],compStatus:[],userRoles:[],corpTypes:[]},
        selectedTr:{},
        statusChecked:[],
        list:[]

    },
    created:function(){
        this.dosearch();
    },
    mounted:function(){
        var self = this;
        $.post("/crm/ajax/personal/list/dict").then(function(data){
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
                for(var i=0;i<list.length;i++){
                    if(list[i].code == code){
                        return list[i].mark;
                    }
                }
        },

        search:function(){
            var self=this
            Vue.set(self.pageInfo,'flag',0);
            self.pageInfo.statusCheck=[];
            if(self.statusChecked!=undefined){
                self.statusChecked.forEach(function (item) {
                    self.pageInfo.statusCheck.push(item.code);
                })
            }
            $.http.$post("/crm/ajax/personal/list",self.pageInfo)
                .then(function(data){
                    data.starteDate=self.pageInfo.starteDate;
                    data.searchName=self.pageInfo.searchName;
                    data.endDate=self.pageInfo.endDate;
                    self.pageInfo = data;
                    if(self.pageInfo==null){ self.pageInfo={}; }
                });
        },
        dosearch:function(){
            var self=this;
            self.showMoreSearchClick();
            Vue.set(self.pageInfo,'flag',1);
            $.http.$post("/crm/ajax/personal/list",self.pageInfo)
                .then(function(data){
                    data.searchValue=self.pageInfo.searchValue;
                    data.starteDate=self.pageInfo.starteDate;
                    data.searchName=self.pageInfo.searchName;
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
        reset:function(){
            var self=this;
            self.clearMoreSearchItem();
            self.dosearch();
        },
        // 清理高级搜索里面的条件
        clearMoreSearchItem : function() {
            var self=this;
            self.pageInfo.starteDate = '';
            self.pageInfo.endDate = '';
            self.pageInfo.searchName = '';
            self.statusChecked=[];

        },
        enableAction:function(){
            var self=this;
            var userCode;
            var status;
            self.pageInfo.list.forEach(function(item){
                if(item.checked){
                    userCode=item.userCode;
                    status=item.enableStatus;
                }
            });
            if(userCode==null||userCode==undefined||userCode.length==0){
                layer.msg('请选择有效记录！', {icon: 7});
                return false;
            }
            if(status==1){
                layer.msg('该客户已启用！', {icon: 7});
                return false;
            }

            if (userCode != null &&userCode != ""){
                layer.confirm('确定启用此数据吗？', {
                    btn : [ '确定', '取消' ]//按钮
                }, function() {
                    layer.close();
                    //此处请求后台程序，下方是成功后的前台处理……
                    var index=layer.load(1, {
                        shade: [0.1, '#fff'], //0.1透明度的白色背景
                    })
                    $.post("/crm/ajax/personal/info/enable", {userCode:userCode}).then(function (data) {
                        layer.closeAll('loading');
                        if (data.code== 200) {
                            layer.msg('操作成功！',{icon: 1});
                        } else {
                            layer.msg('操作失败！',{icon: 2});
                        }
                        Vue.set(this,'selectedTr',{});
                        self.dosearch();
                    })
                });
            }

        },
        disableAction:function(){
            var self=this;
            var userCode;
            self.pageInfo.list.forEach(function(item,index){
                if(item.checked){
                    userCode=item.userCode;
                    status=item.enableStatus;
                }
            });
            if(userCode==null||userCode==undefined||userCode.length==0){
                layer.msg('请选择有效记录！', {icon: 7});
                return false;
            }
            if(status==0){
                layer.msg('该客户已禁用！', {icon: 7});
                return false;
            }

            if (userCode != null &&userCode != "") {
                layer.confirm('确定禁用此数据吗？', {
                    btn: ['确定', '取消']//按钮
                }, function (index) {
                    layer.close(index);
                    //此处请求后台程序，下方是成功后的前台处理……
                    var index = layer.load(1, {
                        shade: [0.1, '#fff'], //0.1透明度的白色背景
                    })
                    $.post("/crm/ajax/personal/info/disable", {userCode: userCode}).then(function (data) {
                        layer.closeAll('loading');
                        if (data.code==200) {
                            layer.msg('操作成功！', {icon: 1});
                        } else {
                            layer.msg('操作失败！', {icon: 2});
                        }
                        Vue.set(this,'selectedTr',{});
                        self.dosearch();
                    })
                });
            }
        },
        serviceComp:function(){
            var self=this;
            var id=self.selectedTr.id;
            var userCode=self.selectedTr.userCode;
            if(userCode==null||userCode==undefined||userCode.length==0){
                layer.msg('请选择有效记录！', {icon: 7});
                return false;
            }
            //此处请求后台程序，下方是成功后的前台处理……
            var index=layer.load(1, {
                shade: [0.1, '#fff'], //0.1透明度的白色背景
            })
            $.post("/crm/ajax/personal/info/serviceComp", {userCode:userCode}).then(function (data) {
                layer.closeAll('loading');
                if (data!= null) {
                    Vue.set(self,'list',data);
                    $("#serviceComp").reveal("{data-animation:'none'}");
                }
                Vue.set(this,'selectedTr',{});
            })
        },
        personalChange:function () {
            var self=this;
            var id=self.selectedTr.id;
            var userCode=self.selectedTr.userCode;
            if(userCode==null||userCode==undefined||userCode.length==0){
                layer.msg('请选择有效记录！', {icon: 7});
                return false;
            }
            if(self.selectedTr.enableStatus!=1){
                layer.msg('该状态不允许变更！', {icon: 7});
                return false;
            }
            if (userCode != null &&userCode != ""){
                layer.confirm('确定变更选中数据吗？', {
                    btn : [ '确定', '取消' ]//按钮
                }, function(index) {
                    layer.close(index);
                    //此处请求后台程序，下方是成功后的前台处理……
                    var index=layer.load(1, {
                        shade: [0.1, '#fff'], //0.1透明度的白色背景
                    })
                    $.post("/crm/ajax/personalChange/infoChange/check", {userCode:userCode}).then(function (data) {
                        layer.close(index);
                        if (data.code== 200) {
                            //调用layout form提交 在组件上定义 ref="listLayoutA"
                            self.$refs.listLayoutA.submit("/crm/personal/change/info/edit",{userCode:userCode});
                        } else {
                            layer.msg('操作失败【'+data.message+'】！',{icon: 2});
                        }
                        Vue.set(this,'selectedTr',{});
                        self.dosearch();
                    })

                });
            }

        },
        ok:function () {
            $("#serviceComp").trigger('reveal:close');
        }

    }
});
