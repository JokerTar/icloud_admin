var vueObj;
Vue.use(window.vuelidate.default);
const required = window.validators.required;
vueObj = new Vue({
    el: "#vueObj",
    data: {
        ids:[],
        desList: [],
        compDes: {},
        selectedIndex: null,
        selectedTr: {},
        billdata:{compCode:null}
    },
    created: function () {
       this.dosearch();
    },
    mounted: function () {
        var self=this;
        if(self.desList!=null&&self.desList.length!=0){
            self.desList.forEach(function (item, index) {
                Vue.set(self, 'compDes', [{id: item.id, title: item.title}])
            });
        }
    },
    methods: {
        tabaction: function () {
            Vue.set(this.billdata, 'mark', $.getUrlParam("mark"));
            Vue.set(this.billdata, 'compCode', $.getUrlParam("compCode"));
            return true;
        },
        back:function () {
            window.location.href = "/crm/corporation/corporation";
        },
        dosearch: function () {
            var self = this;
            var compCode = $.getUrlParam("compCode");
            self.desList = [];
            $.post("/crm/ajax/compDes/list", {"compCode":compCode}).then(function (data) {
                self.desList = data;
            })
        },
        selected: function (model, index) {
            Vue.set(this, 'selectedTr', model);
            Vue.set(this, 'selectedIndex', index);
        },
        addAction: function () {
                this.desList.push({
                    id: null,
                    title: "",
                    content: ""
                });
        },
        deleteAction: function () {
            var self=this;
            if(self.selectedIndex==null){
                layer.msg('请选择有效数据！',{icon: 7});
                return false;
            }
            if(self.selectedTr!=null&&self.selectedIndex!=null){
                self.desList.splice(self.selectedIndex,1);
                Vue.set(self,"selectedIndex",null);
            }
            if(self.selectedTr.desCode!=null&&self.selectedTr.desCode!=undefined&&self.selectedTr.desCode!="") {
                self.ids.push(self.selectedTr.desCode);
                Vue.set(self,"selectedTr",{});
            }
        },
        save:function () {
            var self=this;
            var compCode = $.getUrlParam("compCode");
            self.desList.forEach(function (item, index) {
                Vue.set(item,'compCode',compCode);
            });
            if(self.desList!=null&&self.desList.length!=0){
                $.http.$post("/crm/ajax/compDes/info/save",self.desList)
                    .then(function(data) {
                        layer.closeAll('loading');
                        if (data.code == 200) {
                            layer.msg('保存成功！', {icon: 1});
                            self.dosearch();
                        }
                        Vue.set(self,"selectedIndex",null);
                        Vue.set(self,"selectedTr",{});
                    })
            }else{
                layer.msg('请填写信息后在保存！', {icon: 7});
            }

        },

        del:function(){
            var self=this;
            $.http.$post("/crm/ajax/compDes/info/del",self.ids)
                .then(function(data) {
                    layer.closeAll('loading');
                    if (data.code == 200) {
                        self.ids=[];
                        self.dosearch();
                    }
                })
        },
        saveAction: function () {
            var self=this;
            var compCode = $.getUrlParam("compCode");

            if(self.ids.length!=0&&self.ids!=null){
                self.del();
                self.ids=[];
            }
            if(self.desList!=null&&compCode!=null&&compCode!=''){
                if(self.desList!=null&&self.desList.length!=0) {
                    self.save();
                }else{
                    layer.msg('保存成功！', {icon: 1});
                }
            }
            self.dosearch();
        }
    },
});




