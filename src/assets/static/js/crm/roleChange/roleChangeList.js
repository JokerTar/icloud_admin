var vueObj;
vueObj = new Vue({
    el :'#vueObj',
    data:{
        pageInfo:{searchValue:null,searchName:null,pageNum:1,pageSize:20,total:0,chgStatus:[],starteDate:null,endDate:null,orderBy:null},
        dict:{chgStatus:[],compRoles:[]},
        checked:[],
        chgStatusCheck:[],
        checkFlag:false,
        workFlag:false,
        selectedTr:{},
        param:null
    },
    created:function(){
        var self=this;
        if($.getUrlParam("param")!=""&&$.getUrlParam("param")!=undefined){
            self.param=$.getUrlParam("param");
            Vue.set(self,'workFlag',true)
            self.selection({code:$.getUrlParam("param"),mark:"待审批 ",checked:false});
            history.pushState({param: $.getUrlParam("param")}, null, '/crm/corporation/rolechange');

        }
        self.search();
    },
    mounted:function(){
        var self = this;
        $.post("/crm/ajax/roleChange/list/dict").then(function(data){
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
        selection:function(item){
            var self=this;
            if((self.param!=item.code&&!self.checkFlag)|| item.checked==undefined || self.workFlag){
                Vue.set(item,'checked',!item.checked)
            }

            if(item.checked){
                self.checked.push(item.code);
            }else if(!item.checked||(item.checked==undefined&&self.param==item.code)){
                var index = self.checked.indexOf(item.code);
                if (index > -1) {
                    self.checked.splice(index, 1);
                }
            }
            if(item.checked==undefined&&self.param!=item.code){
                Vue.set(item,'checked',true)
                self.checked.push(item);
            }


        },
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
            self.clearMoreSearchItem();
            Vue.set(self.pageInfo,'flag',1);
            $.http.$post("/crm/ajax/roleChange/list",self.pageInfo)
                .then(function(data){
                    data.searchValue=self.pageInfo.searchValue;
                    data.starteDate=self.pageInfo.starteDate;
                    data.endDate=self.pageInfo.endDate;
                    data.orderBy=self.pageInfo.orderBy;
                    self.pageInfo = data;
                    if(self.pageInfo==null){ self.pageInfo={}; }
                });
        },
        search:function(){
            var self=this;
            Vue.set(self.pageInfo,'flag',0);
            self.pageInfo.searchValue="";
            self.pageInfo.chgStatus=[];
            self.chgStatusCheck.forEach(function (item) {
                self.pageInfo.chgStatus.push(item.code);
            })
            $.http.$post("/crm/ajax/roleChange/list",self.pageInfo)
                .then(function(data){
                    data.searchName=self.pageInfo.searchName;
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
        reset:function(){
            var self=this;
            Vue.set(self,'checkFlag',true);
            self.clearMoreSearchItem();
            self.dosearch();
        },
        // 清理高级搜索Div里面的条件
        clearMoreSearchItem : function() {
            var self=this;
            self.param=null;
            self.pageInfo.starteDate = '';
            self.pageInfo.endDate = '';
            self.checked=[];
            self.pageInfo.chgStatus=[];
            self.pageInfo.searchName="";
            $('input[type=checkbox]').attr('checked',false);

        },
        updateAction:function(){
            var self=this;
            var personalChange=self.selectedTr;
            var id=personalChange.id;
            if(id==null||id==undefined||id.length==0){
                layer.msg('请选择有效记录！', {icon: 7});
                return false;
            }
            if(personalChange.chgStatus != 10){
                layer.msg('该记录当前状态不允许修改！', {icon: 7});
                return false;
            }
            layer.load(1, {
                shade: [0.1, '#fff'], //0.1透明度的白色背景
            })
            //调用layout form提交 在组件上定义 ref="listLayoutA"
            self.$refs.listLayoutA.submit("/crm/corporation/rolechange/info/edit",{chgCode:personalChange.chgCode});
            layer.close('loading');
        },
        viewAction:function () {
            var self=this;
            var personalChange=self.selectedTr;
            if(personalChange==null||personalChange.id==null){
                layer.msg('请选择有效数据！',{icon: 7});
                return false;
            }
            self.selectedTr = {};
            layer.load(1, {
                shade: [0.1, '#fff'], //0.1透明度的白色背景
            })
            //调用layout form提交 在组件上定义 ref="listLayoutA"
            self.$refs.listLayoutA.submit("/crm/corporation/rolechange/info/view",{chgCode:personalChange.chgCode});
            layer.closeAll('loading');
        },
        deleteAction:function () {
            var self=this;
            var personalChange=self.selectedTr;
            if(personalChange==null||personalChange.id==null){
                layer.msg('请选择有效数据！',{icon: 7});
                return false;
            }
            if(personalChange.chgStatus != 10){
                layer.msg('该记录当前状态不允许删除！',{icon: 7});
                return false;
            }
            layer.confirm('确定删除此数据吗？', {
                btn : [ '确定', '取消' ]//按钮
            }, function(index) {
                layer.close(index);
                //此处请求后台程序，下方是成功后的前台处理……
                layer.load(1, {
                    //0.1透明度的白色背景
                    shade: [0.1, '#fff'],
                });
                $.post("/crm/ajax/roleChange/info/del",{chgCode:personalChange.chgCode}).then(function(data){
                    layer.closeAll('loading');
                    self.dosearch();
                    if (data.code== 200) {
                        layer.msg('操作成功！',{icon: 1});
                    }else{
                        layer.msg('操作失败【'+data.message+'】！', {icon: 2});
                    }
                    Vue.set(self,'selectedTr',{});
                });
            })
        },
        /**
         *提交
         * @returns {boolean}
         */
        submit:function () {
            var self=this;
            var id=self.selectedTr.id;
            if(id==null||id==undefined||id.length==0){
                layer.msg('请选择有效记录！', {icon: 7});
                return false;
            }
            if(self.selectedTr.chgStatus != 10){
                layer.msg('该记录当前状态不允许该操作！', {icon: 7});
                return false;
            }
            layer.confirm('确定提交选中数据吗？', {
                btn : [ '确定', '取消' ]//按钮
            }, function(index) {
                layer.close(index);
                //此处请求后台程序，下方是成功后的前台处理……
                var index=layer.load(1, {
                    //0.1透明度的白色背景
                    shade: [0.1, '#fff'],
                })
                $.post("/crm/ajax/roleChange/info/submit", {chgCode:self.selectedTr.chgCode}).then(function (data) {
                    layer.closeAll('loading');
                    self.dosearch();
                    if (data.code==200) {
                        layer.msg('操作成功！', {icon: 1});
                    } else {
                        layer.msg('操作失败【'+data.message+'】！', {icon: 2});
                    }
                    Vue.set(self,'selectedTr',{});

                })
            });
        },
        pass:function () {
            var self=this;
            var id=self.selectedTr.id;
            if(id==null||id==undefined||id.length==0){
                layer.msg('请选择有效记录！', {icon: 7});
                return false;
            }
            if(self.selectedTr.chgStatus != 25){
                layer.msg('该记录当前状态不允许该操作！', {icon: 7});
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
                $.post("/crm/ajax/roleChange/info/pass", {chgCode:self.selectedTr.chgCode}).then(function (data) {
                    layer.closeAll('loading');
                    self.dosearch();
                    if (data.code==200) {
                        layer.msg('操作成功！', {icon: 1});
                    } else {
                        layer.msg('操作失败【'+data.message+'】！', {icon: 2});
                    }
                    Vue.set(self,'selectedTr',{});

                })
            });
        },
        unPass:function () {
            var self=this;
            var id=self.selectedTr.id;
            if(id==null||id==undefined||id.length==0){
                layer.msg('请选择有效记录！', {icon: 7});
                return false;
            }
            if(self.selectedTr.chgStatus != 25){
                layer.msg('该记录当前状态不允许该操作！', {icon: 7});
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
                $.post("/crm/ajax/roleChange/info/unPass", {chgCode:self.selectedTr.chgCode}).then(function (data) {
                    layer.closeAll('loading');
                    self.dosearch();
                    if (data.code==200) {
                        layer.msg('操作成功！', {icon: 1});
                    } else {
                        layer.msg('操作失败【'+data.message+'】！', {icon: 2});
                    }
                    Vue.set(self,'selectedTr',{});

                })
            });
        }
    }
});