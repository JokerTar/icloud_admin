var vueObj;
vueObj = new Vue({
    el: "#vueObj",
    data: {
        list: [],
        dict:[],
        corporation:{},
        billdata:{compCode:null}
    },
    created: function () {
       this.dosearch();
    },
    mounted: function () {
    var self=this;
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
            var self = this;
            var compCode = $.getUrlParam("compCode");
            self.list = [];
            $.post("/crm/ajax/compDes/list", {compCode:compCode}).then(function (data) {
                self.list = data;
            })
        },
        back:function () {
            window.location.href = "/crm/corporation/corporation";
        }
    },
});




