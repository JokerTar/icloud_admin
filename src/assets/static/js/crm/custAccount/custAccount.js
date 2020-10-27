var vueObj;
Vue.use(window.vuelidate.default);
const required = window.validators.required;
vueObj = new Vue({
    el: "#vueObj",
    data: {
        accountList: [],
        account:{},
        ids:[],
        dict: {idTypes: [], userRoles: [],enableStatus: [], yesOrNo: []},
        custAccount: {},
        selectedIndex: null,
        selectedTr: {},
        v_valid:false,
        billdata:{compCode:null}
    },
    created: function () {
      this.dosearch();
    },
    mounted: function () {
        var self=this;
        $.post("/crm/ajax/custAccount/list/dict",{compCode:$.getUrlParam("compCode")}).then(function (data) {
            self.dict = data;
        });
        if(self.accountList!=null&&self.accountList.length!=0){
            self.accountList.forEach(function (item, index) {
                Vue.set(self, 'custAccount', [{id: item.id, btnName: item.btnName}])
            });
        }
    },
    methods: {
        tabaction: function () {
            Vue.set(this.billdata, 'mark', $.getUrlParam("mark"));
            Vue.set(this.billdata, 'compCode', $.getUrlParam("compCode"));
            return true;
        },
        dosearch: function () {
            var self = this;
            var compCode = $.getUrlParam("compCode");
            self.accountList = [];
            $.post("/crm/ajax/custAccount/list",{"compCode":compCode}).then(function (data) {
                self.accountList = data;
            })
        },
        showDict: function (code, enumStr) {
            if (this.dict != null)
                var list = this.dict[enumStr];
            if (list != null)
                for (i = 0; i < list.length; i++) {
                    if (list[i].code == code) {
                        return list[i].mark;
                    }
                }
        },
        selected: function (model, index) {
            Vue.set(this, 'selectedTr', model);
            Vue.set(this, 'selectedIndex', index);
        },
        addAction: function () {
                this.accountList.push({
                    id: null,
                    enableStatus: 1,
                    isActive: 0,
                    isReg: 0
                });
        },
        checkIdCard:function(item){
            Vue.set(item,'flag',true)
        },
        deleteAction: function () {
            var self=this;
            if(self.selectedTr!=null&&self.selectedIndex!=null){
                self.accountList.splice(self.selectedIndex,1);
            }else{
                layer.msg("请选择有效记录", {icon: 7});
            }
            if(self.selectedTr.employeeCode!=null&&self.selectedTr.employeeCode!=undefined&&self.selectedTr.employeeCode!=""){
                self.ids.push(self.selectedTr.employeeCode);
            }
            Vue.set(self,'selectedIndex',null);
            Vue.set(self,'selectedTr',{});
        },
        save:function () {
            var self=this;
            var compCode = $.getUrlParam("compCode");
            var object=self.selectedTr;
            //验证数据是否填写
            var list=[];
            self.accountList.forEach(function (item, index) {
                item.compCode=compCode;

            });
                //此处请求后台程序，下方是成功后的前台处理……
                layer.load(1, {
                    shade: [0.1, '#fff'], //0.1透明度的白色背景
                });
                $.http.$post("/crm/ajax/custAccount/info/save", {eleList:self.accountList,ids:self.ids})
                    .then(function (data) {
                        layer.closeAll('loading');
                        if (data.code == 200) {
                            layer.msg('保存成功！', {icon: 1});
                            self.ids=[];
                            self.dosearch();
                        } else {
                            layer.msg(data.message, {icon: 2});
                        }
                    })
        },

        saveAction: function () {
            var self=this;
            var compCode = $.getUrlParam("compCode");
            if(self.accountList!=null&&compCode!=null&&compCode!=''){
                self.save();
            }
        },
        enableAction:function(){
            var self=this;
            var employeeCode=self.selectedTr.employeeCode;
            if(employeeCode==null||employeeCode==undefined||employeeCode.length==0){
                layer.msg('请选择有效记录！',{icon: 7});
                return false;
            }
            if(self.selectedTr.enableStatus != 0){
                layer.msg('该记录当前状态不允许该操作！',{icon: 7});
                return false;
            }
            if (employeeCode != null &&employeeCode != ""){
                layer.confirm('确定启用此数据吗？', {
                    btn : [ '确定', '取消' ]//按钮
                }, function(index) {
                    layer.close(index);
                    //此处请求后台程序，下方是成功后的前台处理……
                    var index=layer.load(1, {
                        shade: [0.1, '#fff'], //0.1透明度的白色背景
                    })
                    $.post("/crm/ajax/custAccount/info/enable", {employeeCode:employeeCode}).then(function (data) {
                        layer.closeAll('loading');
                        if (data!= null) {
                            layer.msg('操作成功！',{icon: 1});
                        } else {
                            layer.msg('操作失败！',{icon: 2});
                        }
                        Vue.set(self,'selectedIndex',null);
                        Vue.set(self,'selectedTr',{});
                        self.dosearch();
                    })
                });
            }
        },
        disableAction:function(){
            var self=this;
            var employeeCode=self.selectedTr.employeeCode;
            if(employeeCode==null||employeeCode==undefined||employeeCode.length==0){
                layer.msg('请选择有效记录！',{icon: 7});
                return false;
            }
            if(self.selectedTr.enableStatus != 1){
                layer.msg('该记录当前状态不允许该操作！',{icon: 7});
                return false;
            }
            if (employeeCode != null &&employeeCode != "") {
                layer.confirm('确定禁用此数据吗？', {
                    btn: ['确定', '取消']//按钮
                }, function (index) {
                    layer.close(index);
                    //此处请求后台程序，下方是成功后的前台处理……
                    var index = layer.load(1, {
                        shade: [0.1, '#fff'], //0.1透明度的白色背景
                    })
                    $.post("/crm/ajax/custAccount/info/disable", {employeeCode: employeeCode}).then(function (data) {
                        layer.closeAll('loading');
                        if (data!=null) {
                            layer.msg('操作成功！', {icon: 1});
                        } else {
                            layer.msg('操作失败！', {icon: 2});
                        }
                        Vue.set(self,'selectedIndex',null);
                        Vue.set(self,'selectedTr',{});
                        self.dosearch();
                    })
                });
            }
        },
        checkCorporationUserMobile:function (object) {
            var self=this;
            var count=0;
            self.accountList.forEach(function (item) {
                if(object.mobile==item.mobile){
                    count++;
                }
            })
            if(count>1){
                layer.msg('企业用户手机号已存在，不可重复添加！', {icon: 7});
                object.mobile ="";
            }
        },
        checkRootManager:function (object) {
            var self=this;
            var rootAccount=0;
            if(object.rootManager==1){
                self.accountList.forEach(function (item) {
                    if(item.rootManager==1&&item.status!=-1){
                        rootAccount++;
                    }
                })
                if(rootAccount>1){
                    layer.msg('管理员已经存在！', {icon: 2});
                    object.rootManager ="";
                }
            }
        },
        back:function () {
            window.location.href = "/crm/corporation/corporation";
        }
    },

});




