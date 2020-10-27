var vueObj;
vueObj = new Vue({
    el: "#vueObj",
    data: {
        compBlList: [],
        corporation:{},
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
        $.post("/crm/ajax/comp/edit/infoDict").then(function(data){
            Vue.set(self.dict,'compStatus',data.compStatus);
        });
        var compCode = $.getUrlParam("compCode");
        if (compCode != null && compCode != '') {
            $.post("/crm/ajax/comp/info/view",{compCode:compCode,flag:null}).then(function (data) {
                Vue.set(self, "corporation",data.custCompDTO);
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
            var self=this;
            var compCode = $.getUrlParam("compCode");
            self.compBlList = [];
            $.post("/crm/ajax/compBl/list", {compCode:compCode}).then(function (data) {
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
        back:function () {
            window.location.href = "/crm/corporation/corporation";
        }
    },
});




