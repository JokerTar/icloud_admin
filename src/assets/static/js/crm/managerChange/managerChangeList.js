var vueObj;
vueObj = new Vue({
    el :'#vueObj',
    data:{
        pageInfo:{searchValue:null,compName:null,beforeManager:null,afterManager:null,pageNum:1,pageSize:20,total:0,starteDate:null,endDate:null,chgStatus:[],orderBy:null},
        checked:[],
        chgStatusList:[],
        dict:{chgStatus:[]},
        selectedTr:{},
        reviewMemo:null,
        checkFlag:false,
        param:null

    },
    created:function(){
        var self=this;
        if($.getUrlParam("param")!=""&&$.getUrlParam("param")!=undefined){
            self.param=$.getUrlParam("param");
            self.selection({code:$.getUrlParam("param"),mark:"待审批 ",checked:true});
            history.pushState({param: $.getUrlParam("param")}, null, '/crm/corporation/managerchange');

        }
        self.search();
    },
    mounted:function(){
        var self = this;
        $.post("/crm/ajax/managerChange/list/dict").then(function(data){
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
            if(self.param!=item.code&&!self.checkFlag){
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
            $.http.$post("/crm/ajax/managerChange/list",self.pageInfo)
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
            self.checked.forEach(function (item) {
                self.pageInfo.chgStatus.push(item);
            })
            $.http.$post("/crm/ajax/managerChange/list",self.pageInfo)
                .then(function(data){
                    data.starteDate=self.pageInfo.starteDate;
                    data.endDate=self.pageInfo.endDate;
                    data.orderBy=self.pageInfo.orderBy;
                    data.compName=self.pageInfo.compName;
                    data.beforeManager=self.pageInfo.beforeManager;
                    data.afterManager=self.pageInfo.afterManager;
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
        reset:function(){
            var self=this;
            Vue.set(self,'checkFlag',true);
            self.clearMoreSearchItem();
            self.dosearch();
        },
        showMoreSearchClick:function(){
            // 清空高级搜索的条件
            this.clearMoreSearchItem();
        },
        clearMoreSearchItem : function() {
            var self=this;
            // 搜索：复选框 状态
            self.checked=[];
            self.pageInfo.starteDate = '';
            self.pageInfo.endDate = '';
            self.pageInfo.compName="";
            self.pageInfo.beforeManager="";
            self.pageInfo.afterManager="";
            $('input[type=checkbox]').attr('checked',false);
        },
        updateAction:function(){
            var self=this;
            var managerChange=self.selectedTr;
            var chgCode=managerChange.chgCode;
            if(chgCode==null||chgCode==undefined||chgCode.length==0){
                layer.msg('请选择有效记录！',{icon: 7})
                return false;
            }
            if(managerChange.chgStatus > 10 ){
                layer.msg('该记录当前状态不允许该操作！',{icon: 7})
                return false;
            }
            //此处请求后台程序，下方是成功后的前台处理……
            var index= layer.load(1, {
                //0.1透明度的白色背景
                shade: [0.1, '#fff'],
            })
            //调用layout form提交 在组件上定义 ref="listLayoutA"
            self.$refs.listLayoutA.submit("/crm/corporation/managerchange/info/edit",{chgCode:managerChange.chgCode});
            layer.closeAll('loading');
        },
        viewAction:function () {
            var self=this;
            var managerChange=self.selectedTr;
            if(managerChange==null||managerChange.chgCode==null){
                layer.msg('请选择有效记录！',{icon: 7});
                return false;
            }
            self.selectedTr = {};
            layer.load(1, {
                shade: [0.1, '#fff'], //0.1透明度的白色背景

            })
            self.$refs.listLayoutA.submit("/crm/corporation/managerchange/info/view",{chgCode:managerChange.chgCode});
            layer.closeAll('loading');
        },
        deleteAction:function () {
            var self=this;
            var managerChange=self.selectedTr;
            if(managerChange==null||managerChange.chgCode==null){
                layer.msg('请选择有效数据！',{icon: 7});
                return false;
            }
            if(managerChange.chgStatus != 10 ){
                layer.msg('该记录当前状态不允许该操作！',{icon: 7})
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
                $.post("/crm/ajax/managerChange/info/del",{chgCode:managerChange.chgCode}).then(function(data){
                    layer.closeAll('loading');
                    if (data.code== 200) {
                        layer.msg('操作成功！',{icon: 1});
                    } else {
                        layer.msg('操作失败【'+data.message+'】！',{icon: 2});
                    }
                    Vue.set(self,'selectedTr',{});
                    self.dosearch();
                });
            })
        },
        submit:function(){
            var self=this;
            var chgCode=self.selectedTr.chgCode;
            var managerChange=self.selectedTr;
            if(chgCode==null||chgCode==undefined||chgCode.length==0){
                layer.msg('请选择有效记录！',{icon: 7});
                return false;
            }
            if(managerChange.chgStatus > 10 ){
                layer.msg('该记录当前状态不允许该操作！',{icon: 7});
                return false;
            }
            if(managerChange.chgStatus == 10 && managerChange.chgType == 1){
                layer.msg('前台保存,不可提交！',{icon: 7});
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
                $.post("/crm/ajax/managerChange/info/submit", {chgCode:chgCode}).then(function (data) {
                    layer.closeAll('loading');
                    if (data.code== 200) {
                        layer.msg('操作成功！',{icon: 1});
                    } else {
                        layer.msg('操作失败【'+data.message+'】！',{icon: 2});
                    }
                    Vue.set(self,'selectedTr',{});
                    self.dosearch();
                })
            });
        },
        pass:function () {
            var self=this;
            var chgCode=self.selectedTr.chgCode;
            if(chgCode==null||chgCode==undefined||chgCode.length==0){
                layer.msg('请选择有效记录！',{icon: 7});
                return false;
            }
            if(self.selectedTr.chgStatus != 15){
                layer.msg('该记录当前状态不允许该操作!',{icon: 7})
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
                $.post("/crm/ajax/managerChange/info/pass", {chgCode: chgCode}).then(function (data) {
                    layer.closeAll('loading');
                    if (data.code== 200) {
                        layer.msg('操作成功！', {icon: 1});
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
            var chgCode=self.selectedTr.chgCode;
            if(chgCode==null||chgCode==undefined||chgCode.length==0){
                layer.msg('请选择有效记录！',{icon: 7})
                return false;
            }
            if(self.selectedTr.chgStatus != 15){
                layer.msg('该记录当前状态不允许该操作!',{icon: 7})
                return false;
            }
            self.reviewMemo="";
            $("#auditOpinion").reveal("{data-animation:'none'}");

        },
        ok:function () {
            var self=this;
            var chgCode=self.selectedTr.chgCode;
            if (self.reviewMemo == ""||self.reviewMemo == null) {
                layer.msg('请输入审批意见！', {icon: 7});
                return false;
            }
            //此处请求后台程序，下方是成功后的前台处理……
            var index=layer.load(1, {
                shade: [0.1, '#fff'], //0.1透明度的白色背景
            })
            $.post("/crm/ajax/managerChange/info/unPass", {chgCode: chgCode,reviewMemo:self.reviewMemo}).then(function (data) {
                layer.closeAll('loading');
                if (data.code==200) {
                    layer.msg('操作成功！', {icon: 1});
                } else {
                    layer.msg('操作失败【'+data.message+'】！', {icon: 2});
                }
                $("#auditOpinion").trigger('reveal:close');
                Vue.set(self,'selectedTr',{});
                self.dosearch();
            })
        },
        cancel:function () {
            $("#auditOpinion").trigger('reveal:close');
        }
    }
});
