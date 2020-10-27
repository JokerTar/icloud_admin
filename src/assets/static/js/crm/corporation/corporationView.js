var vueObj;
vueObj = new Vue({
    el: '#vueObj',
    data: {
        dict: {
            corpTypes: [], compStatus: [], status: [], isRegs: [], yesOrNo: [], userRoles: [],
            custLevels: [], idTypes: [], nations: [], entpTypes: [], entpNatures: [], areaTypes: [],
            ratOutLooks: [], ratResults: [], ratIds: [], busTypeBigs: [], busTypeMiddles: [], busTypeSmalls: [],
            regAddrProvinces: [], regAddrCitys: [], regAddrDistricts: []
        },
        reg: {
            regAddrProvinces: [],
            regAddrCitys: [],
            regAddrDistricts: [],
            busTypeBigs: [],
            busTypeMiddles: [],
            busTypeSmalls: []
        },
        corporation: {},
        legalCorporationList: [],
        corporationLevel: {},
        billdata: {compCode: null}
    },
    mounted: function () {
        var self = this;
        $.post("/crm/ajax/comp/edit/infoDict").then(function (data) {
            self.dict = data;
        });
        $.post("/data/ajax/busTypeBig/list", {type: '行业分类'}).then(function (data) {
            Vue.set(self.reg, "busTypeBigs", data);

        });
        $.post("/data/ajax/province/list").then(function (data) {
            Vue.set(self.reg, "regAddrProvinces", data);

        });
        var compCode = $.getUrlParam("compCode");
        if (compCode != null && compCode != '') {
            $.post("/crm/ajax/comp/info/view", {compCode: compCode, flag: "view"}).then(function (data) {
                Vue.set(self.reg, "busTypeMiddles", data.custCompDTO.busTypeMiddles);
                Vue.set(self.reg, "busTypeSmalls", data.custCompDTO.busTypeSmalls);
                Vue.set(self, "corporation", data.custCompDTO);
                if (data.custCompLevDTO != null) {
                    Vue.set(self, "corporationLevel", data.custCompLevDTO);
                }
                self.findSupComps();
            });
        }
    },

    methods: {
        tabaction: function () {
            Vue.set(this.billdata, 'mark', $.getUrlParam("mark"));
            Vue.set(this.billdata, 'compCode', $.getUrlParam("compCode"));
            return true;
        },
        findSupComps: function () {
            var self = this;
            var compName = self.corporation.compName;
            if (compName == undefined) {
                compName = null;
            }
            //此处请求后台程序，下方是成功后的前台处理……
            var index = layer.load(1, {
                shade: [0.1, '#fff'], //0.1透明度的白色背景
            })
            $.post("/crm/ajax/supComp/find", {compName: compName})
                .then(function (data) {
                    layer.close(index);
                    Vue.set(self, 'legalCorporationList', data);
                });
        },
        showDict: function (code, enumStr) {
            if (this.dict != null) {
                var list = this.dict[enumStr];
            }
            if (list != null)
                for (i = 0; i < list.length; i++) {
                    if (list[i].code == code) {
                        return list[i].mark;
                    }
                }
        },
        showEnum: function (code, enumStr) {
            if (this.reg != null)
                var list = this.reg[enumStr];
            if (list != null)
                for (i = 0; i < list.length; i++) {
                    if (list[i].id == code) {
                        return list[i].name;
                    }
                }
        },
        back: function () {
            window.location.href = "/crm/corporation/corporation";
        }
    }
});

