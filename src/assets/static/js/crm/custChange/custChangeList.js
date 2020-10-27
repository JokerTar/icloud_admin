var vueObj;
vueObj = new Vue({
    el :'#vueObj',
    data:{
        pageInfo:{
            searchValue:null
            ,pageNum:1
            ,pageSize:20
            ,total:0
            ,starteDate:null
            ,endDate:null
            ,chgStatus:[]
            ,chgBefor:null
            ,chgAfter:null
            ,orderBy:null
        },
        chgStatusCheck:[],
        reviewMemo:"",
        dict:{chgStatus:[]},
        selectedTr:{},
        param:null

    },
    created:function(){
        var self=this;
        if($.getUrlParam("param")!=""&&$.getUrlParam("param")!=undefined){
            self.param=$.getUrlParam("param");
            self.selection({code:$.getUrlParam("param"),mark:"待审批 ",checked:true});
            history.pushState({param: $.getUrlParam("param")}, null, '/crm/corporation/change');

        }
        self.dosearch();
    },
    mounted:function(){
        var self = this;
        $.post("/crm/ajax/custChange/dict").then(function(data){
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
            if(self.param!=item.code){
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
        reset:function(){
            var self=this;
            Vue.set(self,'checkFlag',true);
            self.clearMoreSearchItem();
            self.dosearch();
        },
        selected:function(model){
            Vue.set(model,'checked',!model.checked);
            if (model.checked) {
                Vue.set(this,'selectedTr',model);
            }else {
                Vue.set(this,'selectedTr',{});
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
            self.pageInfo.chgStatus=[];
            self.chgStatusCheck.forEach(function (item) {
                self.pageInfo.chgStatus.push(item.code);
            })
            $.http.$post("/crm/ajax/custChange/list",self.pageInfo)
                .then(function(data){
                    data.searchValue=self.pageInfo.searchValue;
                    data.starteDate=self.pageInfo.starteDate;
                    data.endDate=self.pageInfo.endDate;
                    data.orderBy=self.pageInfo.orderBy;
                    data.chgBefor=self.pageInfo.chgBefor;
                    data.chgAfter=self.pageInfo.chgAfter;
                    self.pageInfo = data;
                    if(self.pageInfo==null){ self.pageInfo={}; }
                });
        },
        showMoreSearchClick:function(){
            // 清空高级搜索的条件
            this.clearMoreSearchItem();
        },
        clearMoreSearchItem : function() {
            var self = this;
            // 搜索：复选框 状态
            self.chgStatusCheck = [];
            self.pageInfo.starteDate = null;
            self.pageInfo.endDate = null;
            self.pageInfo.chgBefor = null;
            self.pageInfo.chgAfter = null;
            $('input[type=checkbox]').attr('checked',false);
        },
        viewAction:function () {
            var self=this;
            var custChange=self.selectedTr;
            if(custChange==null||custChange.chgCode==null){
                layer.msg('请选择有效数据！',{icon: 7});
                return false;
            }
            self.selectedTr = {};
            layer.load(1, {
                shade: [0.1, '#fff'], //0.1透明度的白色背景
            })
            //调用layout form提交 在组件上定义 ref="listLayoutA"
            self.$refs.listLayoutA.submit("/crm/corporation/change/info/view",{chgCode:custChange.chgCode});
            layer.closeAll('loading');
        },
        backEdit:function() {
            var self = this;
            var chgCode = self.selectedTr.chgCode;
            if (chgCode == null || chgCode == undefined || chgCode.length == 0) {
                layer.msg('请选择有效记录！', {icon: 7});
                return false;
            }
            if (self.selectedTr.chgStatus != 20) {
                layer.msg('该记录当前状态不允许该操作！', {icon: 7});
                return false;
            }
            self.reviewMemo = "";
            self.reviewType="back"
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
            });
            var url=self.reviewType=="back"?"/crm/ajax/custChange/info/back":"/crm/ajax/custChange/info/unPass"
            $.post(url, {chgCode: chgCode,reviewMemo:self.reviewMemo}).then(function (data) {
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
        },

        pass:function () {
            var self=this;
            var chgCode=self.selectedTr.chgCode;
            if(chgCode==null||chgCode==undefined||chgCode.length==0){
                layer.msg('请选择有效记录！',{icon: 7});
                return false;
            }
            if(self.selectedTr.chgStatus != 30){
                layer.msg('该记录当前状态不允许该操作！',{icon: 7});
                return false;
            }
            layer.confirm('确定审批通过选中数据吗？', {
                btn : [ '确定', '取消' ]//按钮
            }, function(index) {
                layer.close(index);
                //此处请求后台程序，下方是成功后的前台处理……
                var index=layer.load(1, {
                    shade: [0.1, '#fff'], //0.1透明度的白色背景
                })
                $.post("/crm/ajax/custChange/info/pass", {chgCode: chgCode}).then(function (data) {
                    layer.closeAll('loading');
                    if (data.code==200) {
                        layer.msg('操作成功！', {icon: 1});
                    } else {
                        layer.msg('操作失败【'+data.message+'】',{icon: 2});
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
                layer.msg('请选择有效记录！',{icon: 7});
                return false;
            }
            if(self.selectedTr.chgStatus != 30){
                layer.msg('该记录当前状态不允许该操作！',{icon: 7});
                return false;
            }
            self.reviewMemo = "";
            self.reviewType="unPass"
            $("#auditOpinion").reveal("{data-animation:'none'}");
        }
    }
});
