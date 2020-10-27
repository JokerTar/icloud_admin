var vueObj;
vueObj = new Vue({
    el: "#vueObj",
    data: {
        compBlList:[],
        ids:[],
        compBl:{},
        selectedIndex: null,
        selectedTr:{},
        dict:{billTypes:{}},
        billdata:{compCode:null}
    },
    created: function () {
       this.dosearch();
    },
    mounted: function () {
        var self=this;
        $.post("/crm/ajax/compBl/list/dict").then(function(data){
            self.dict = data;
        });
        if(self.compBlList!=null&&self.compBlList.length!=0){
            self.compBlList.forEach(function (item, index) {
                Vue.set(self, 'compBl', [{id: item.id, billType: item.billType}])
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
        selected: function (model, index) {
            Vue.set(this, 'selectedTr', model);
            Vue.set(this, 'selectedIndex', index);
        },
        dosearch: function () {
            var self=this;
            var compCode = $.getUrlParam("compCode");
            self.compBlList = [];
            $.post("/crm/ajax/compBl/list", {"compCode":compCode}).then(function (data) {
                self.compBlList = data;
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

    },
});




