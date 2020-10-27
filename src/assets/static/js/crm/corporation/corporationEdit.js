var vueObj;
Vue.use(window.vuelidate.default);
const required = window.validators.required;
const maxLength = window.validators.maxLength;
vueObj = new Vue({
    el :'#vueObj',
    data:{
        dict:{corpTypes:[],idTypes:[],entpTypes:[],entpNatures:[],custLevels:[],isRegs:[],ratOutLooks:[],ratResults:[]
            ,legalCorporationList:[],ratIds:[],compStatus:[], regAddrCitys:[],regAddrCitys1:[],regAddrDistricts1:[],
            regAddrDistricts:[],busTypeMiddles:[],busTypeSmalls:[],busTypeMiddles1:[],busTypeSmalls1:[]},
        reg:{regAddrCitys:[],regAddrCitys1:[],regAddrDistricts1:[],
            regAddrDistricts:[],busTypeMiddles:[],busTypeSmalls:[],busTypeMiddles1:[],busTypeSmalls1:[]},
        billTitle:null,
        legalCorporationList:[],
        corporation:{isUscc:0},
        corporationLevel:{},
        v_valid:false,
        flag:null,
        flag1:null,
        addr:false,
        billdata:{compCode:null}
    },
    mounted:function(){
        var self = this;
        $.post("/crm/ajax/comp/edit/infoDict").then(function(data){
            self.dict = data;
        });
        self.findSupComps();
        var compCode = $.getUrlParam("compCode");
        if (compCode != null && compCode != '') {
            self.infoView();
            self.billTitle = "修改企业用户"
            self.addr=true;
        }else{
            self.billTitle = "新增企业用户"
            Vue.set(self.corporation,'isUscc',1);
        }
        $.post("/data/ajax/comp/cnaps/citys",{provinceId:null}).then(function (data) {
            Vue.set(self.reg, "regAddrProvinces", data.provinces);
        });

    },
    validations: {
        corporation: {
            custType:{
                required: required
            },
            compName:{
                required:function(){
                    if(vueObj.corporation.compName!=undefined){
                        return trim(this.corporation.compName)!="";
                    }else{
                        return this.corporation.compName!=undefined;
                    }

                },
                maxLength: maxLength(100)
            },
            busLicenseCode:{
                required:function(){
                    return this.corporation.isUscc!=1&&this.corporation.custType==1?(this.corporation.busLicenseCode!=null&&this.corporation.busLicenseCode!=""):true;
                }
            },
            orgCode:{
                required:function(){
                    return this.corporation.isUscc!=1&&this.corporation.custType==1?(this.corporation.orgCode!=null&&this.corporation.orgCode!=""):true;
                }
            },
            taxRegCerCode:{
                required:function(){
                    return this.corporation.isUscc!=1&&this.corporation.custType==1?(this.corporation.taxRegCerCode!=null&&this.corporation.taxRegCerCode!=""):true;
                }
            },
            usccCode:{
                required:function(){
                    return this.corporation.isUscc==1&&this.corporation.custType==1?(this.corporation.usccCode!=null&&this.corporation.usccCode!=""):true;
                }
            },

            parentCode:{
                required:function(){
                    return this.corporation.custType!=1?(this.corporation.parentCode!=null&&this.corporation.parentCode!=""):true;
                }
            },

            legalName:{
                required:function(){
                    return this.corporation.custType!=2?this.corporation.legalName!=null:true;
                },
            },
            legalIdtype:{
                required:function(){
                    return this.corporation.custType!=2?this.corporation.legalIdtype!=null:true;
                }
            },
            legalIdnum:{
                required:function(){
                    return this.corporation.custType!=2?this.corporation.legalIdnum!=null:true;
                },
            },
            compEmail:{
                required:function(){
                    if(this.corporation.custType==1){
                        if(vueObj.corporation.compEmail!=undefined){
                            return trim(this.corporation.compEmail)!="";
                        }else{
                            return this.corporation.compEmail!=undefined;
                        }
                    }else{
                        return true;
                    }

                },
            }

        }
    },
    methods: {
        tabaction:function(){
            var self=this;
            Vue.set(this.billdata,'compCode',$.getUrlParam("compCode"));
            Vue.set(self,'v_valid','true');
            if(this.$v.corporation.$invalid) {
                layer.msg('请校验单据，并修改红色标记部分！',{icon: 7});
                return false;
            }
            if(this.billdata.compCode!=null&&this.billdata.compCode!=''){
                return true;
            }else{
                layer.msg('请保存基本信息！',{icon: 7});
                return false;
            }
        },

        getRegAddrCitys:function () {
            var self=this;
            if(!self.addr){
                self.corporation.regAddrCity=0;
            }
            if(self.addr){
                self.addr=false;
            }
            $.post("/data/ajax/comp/cnaps/citys",{provinceId:self.corporation.regAddrProvince}).then(function (data) {
                Vue.set(self.reg, "regAddrCitys", data.citys);
            });
            if(self.reg!=undefined&&self.reg.regAddrProvinces!=null){
                self.reg.regAddrProvinces.forEach(function (item, index) {
                    if(self.corporation.regAddrProvince==item.provinceId){
                        Vue.set(self.corporation, 'regAddrProvinceName', item.provinceName);
                    }
                })
            }

        },
        getRegAddrCityName:function(){
            var self=this;
            if(self.reg!=undefined&&self.reg.regAddrCitys!=null) {
                self.reg.regAddrCitys.forEach(function (item, index) {
                    if (self.corporation.regAddrCity == item.cityId) {
                        Vue.set(self.corporation, 'regAddrCityName', item.cityName);
                    }
                })
            }
        },

        getBusTypeMiddles:function () {
            var self=this;
            if(!self.flag){
                self.corporation.busTypeMiddle=0;
                self.corporation.busTypeSmall=0;
            }
            if(self.flag){
                self.flag=false;
            }
            if(self.corporation.busTypeBig==""){
                Vue.set(self.corporation,'busTypeMiddle',"");
                Vue.set(self.corporation,'busTypeSmall',"");
            }
            if(self.flag1!=self.corporation.busTypeBig||self.corporation.busTypeBig==""){
                Vue.set(self.reg,'busTypeMiddles',[]);
                Vue.set(self.reg,'busTypeSmalls',[]);
            }else{
                Vue.set(self.reg,'busTypeMiddles',self.reg.busTypeMiddles1);
                Vue.set(self.reg,'busTypeSmalls',self.reg.busTypeSmalls1);
            }
            $.post("/data/ajax/busType/list",{pid:self.corporation.busTypeBig}).then(function(data){
                Vue.set(self.reg, "busTypeMiddles",data);
        })
        },
        getBusTypeSmalls:function () {
            var self=this;
            if(!self.flag){
                self.corporation.busTypeSmall=0;
            }
            if(self.flag){
                self.flag=false;
            }
            $.post("/data/ajax/busType/list",{pid:self.corporation.busTypeMiddle}).then(function(data){
                Vue.set(self.reg, "busTypeSmalls",data);
            })
        },
        clickIsUscc:function(model){
            var self=this;
            if(self.corporation.isUscc==0){
                Vue.set(self.corporation,'isUscc',1);
                //清空三证
                Vue.set(self.corporation,'busLicenseCode',"");
                Vue.set(self.corporation,'orgCode',"");
                Vue.set(self.corporation,'taxRegCerCode',"");


            }else{
                Vue.set(self.corporation,'isUscc',0);
                //清空合一证
                Vue.set(self.corporation,'usccCode',"");

            }

        },
        clickIsChapter:function () {
            var self=this;
            if(self.corporation.custType==1||self.corporation.custType==3){
                Vue.set(self.corporation,'isChapter',1);
                return false;
            }
            if(self.corporation.isChapter==1){
                Vue.set(self.corporation,'isChapter',0);

            }else{
                Vue.set(self.corporation,'isChapter',1);

            }
        },
        changeCustType:function () {
            var self=this;
            if(self.corporation.id==null ||self.corporation.id==""){
                Vue.set(self.corporation,'isUscc',1);
            if(self.corporation.custType==1||self.corporation.custType==2||self.corporation.custType==3){
                Vue.set(self.corporation,'isChapter',1);
            }

            if(self.corporation.custType==2||self.corporation.custType==4){
                Vue.set(self.corporation,'isRoot',0);
            }
                Vue.set(self.corporation,'busLicenseCode',"");
                Vue.set(self.corporation,'orgCode',"");
                Vue.set(self.corporation,'taxRegCerCode',"");
                Vue.set(self.corporation,'usccCode',"");
            }
        },
        findSupComps:function () {
            var self=this;
            var compName=self.corporation.compName;
            if(compName==undefined){
                compName=null;
            }
            //此处请求后台程序，下方是成功后的前台处理……
            var index= layer.load(1, {
                shade: [0.1, '#fff'], //0.1透明度的白色背景
            })
            $.post("/crm/ajax/supComp/find",{compName:compName})
                .then(function(data){
                    layer.close(index);
                    Vue.set(self,'legalCorporationList',data);
                });
        },
        infoView:function () {
            var self=this;
            var compCode = $.getUrlParam("compCode");
            $.post("/crm/ajax/comp/info/view",{compCode:compCode,flag:"edit"}).then(function (data) {
                Vue.set(self, "corporation", data.custCompDTO);
                Vue.set(self, "flag", data.custCompDTO.provinceList);
                Vue.set(self, "flag1", data.custCompDTO.busTypeBig);
                Vue.set(self.reg, "regAddrCitys",data.custCompDTO.cityList);
                Vue.set(self.reg, "regAddrDistricts",data.custCompDTO.districtList);
                Vue.set(self.reg, "busTypeMiddles",data.custCompDTO.busTypeMiddles);
                Vue.set(self.reg, "busTypeSmalls",data.custCompDTO.busTypeSmalls);
                Vue.set(self.reg, "regAddrCitys1",data.custCompDTO.cityList);
                Vue.set(self.reg, "regAddrDistricts1",data.custCompDTO.districtList);
                Vue.set(self.reg, "busTypeMiddles1",data.custCompDTO.busTypeMiddles);
                Vue.set(self.reg, "busTypeSmalls1",data.custCompDTO.busTypeSmalls);
                if(data.custCompLevDTO!=null){
                    Vue.set(self, "corporationLevel",data.custCompLevDTO);
                }
                self.findSupComps();
            });

        },
        saveAction:function(){
           var self=this;
           var compCode =$.getUrlParam("compCode");
            Vue.set(self,'v_valid','true');
            if(this.$v.corporation.$invalid) {
                layer.msg('请校验单据，并修改红色标记部分！',{icon: 7});
                return false;
            }
            var formValid = !this.$v.corporation.$invalid;
            //验证企业名称
            var pattern = new RegExp("[`~!@#$^&*=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
            if (pattern.test( self.corporation.compName)) {
                layer.msg('企业名称包含特殊字符！',{icon: 7});
                return;
            }
            //验证组织机构代码
            var orgCode=self.corporation.orgCode;
            if(orgCode!=null&&orgCode!=''){
                var regex = /^[A-Za-z0-9]{8}-[A-Za-z0-9]$/;
                if(!regex.test(orgCode)){
                    layer.msg('组织机构代码输入有误！',{icon: 7});
                    return false;
                }

            }
            //验证营业执照号码
            var busLicenseCode=self.corporation.busLicenseCode;
            if(busLicenseCode!=null&&busLicenseCode!=''){
                if(/\s/.test(busLicenseCode)){
                    layer.msg('营业执照号码输入有误！',{icon: 7});
                    return false;
                }else{
                    var sum = 0;
                    var s = [];
                    var p = [];
                    var a = [];
                    var m = 10;
                    p[0] = m;
                    for (var i = 0; i < busLicenseCode.length; i++) {
                        a[i] = parseInt(busLicenseCode.substring(i, i + 1), m);
                        s[i] = (p[i] % (m + 1)) + a[i];
                        if (0 == s[i] % m) {
                            p[i + 1] = 10 * 2;
                        } else {
                            p[i + 1] = (s[i] % m) * 2;
                        }
                    }
                    if (1 != (s[14] % m)) {
                        layer.msg('营业执照号码输入有误！',{icon: 7});
                        return false;
                    } else if ("" == busLicenseCode) {
                        layer.msg('营业执照号码输入有误！',{icon: 7});
                        return false;
                    } else if(busLicenseCode.length>15){
                        layer.msg('营业执照号码输入有误！',{icon: 7});
                        return false;
                    }
                }
            }

            //验证统一社会信用代码
            var usccCode=self.corporation.usccCode;
            if(usccCode!=null&&usccCode!=''){
                var regex =/^([0-9ABCDEFGHJKLMNPQRTUWXY]{2})([0-9]{6})([0-9ABCDEFGHJKLMNPQRTUWXY]{10})$/;
                if(!regex.test(usccCode)){
                    layer.msg('统一社会信用代码输入有误！',{icon: 7});
                    return false;
                }
            }

            var taxRegCerCode = self.corporation.taxRegCerCode;
            if(taxRegCerCode!=null&&taxRegCerCode!='') {
                if (/\s/.test(taxRegCerCode)) {
                    layer.msg('税务登记证号输入有误！', {icon: 7});
                    return false;
                }
                if (taxRegCerCode == "" || taxRegCerCode.length == 0) {
                    layer.msg('税务登记证号输入有误！', {icon: 7});
                    return false;
                }
                if (taxRegCerCode.length != 15 && taxRegCerCode.length != 18 && taxRegCerCode.length != 20) {
                    layer.msg('税务登记证号输入有误！', {icon: 7});
                    return false;
                }
            }

            var phone = self.corporation.legalMobile;
            if(!(/^1[3456789]\d{9}$/.test(phone))&&self.corporation.legalMobile!=undefined&&self.corporation.legalMobile!=""){
                layer.msg('请输入正确的手机号！',{icon: 7});
                return false;
            }
            var re = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if (!re.test(self.corporation.legalEmail)&&self.corporation.legalEmail!=undefined&&self.corporation.legalEmail!="") {
                layer.msg('请输入正确的邮箱！',{icon: 7});
                return false;
            }
            var reg=/[^\d.]/g;
            if(self.corporation.regCapital!=null&&self.corporation.regCapital!=""&&self.corporation.regCapital!=0.00){
                var regCapital = parseFloat(trim(self.corporation.regCapital+""));
                if(reg.test(regCapital)){
                    layer.msg('请输入数字！',{icon: 7});
                    return false;
                }else{
                    Vue.set(self.corporation,'regCapital',regCapital);
                }

            }
            if(self.corporation.paidupCapital!=null&&self.corporation.paidupCapital!=""&&self.corporation.paidupCapital!=0.00){
                var paidupCapital = parseFloat(trim(self.corporation.paidupCapital+""));
                if(reg.test(paidupCapital)){
                    layer.msg('请输入数字！',{icon: 7});
                    return false;
                }else{
                    Vue.set(self.corporation,'paidupCapital',paidupCapital);
                }

            }
            if(self.corporation.assetTotal!=null&&self.corporation.assetTotal!=""&&self.corporation.assetTotal!=0.00){
                var assetTotal = parseFloat(trim(self.corporation.assetTotal+""));
                if(reg.test(assetTotal)){
                    layer.msg('请输入数字！',{icon: 7});
                    return false;
                }else{
                    Vue.set(self.corporation,'assetTotal',assetTotal);
                }

            }
            if(self.corporation.revenue!=null&&self.corporation.revenue!=""&&self.corporation.revenue!=0.00) {
                var revenue = parseFloat(trim(self.corporation.revenue + ""));
                if (reg.test(revenue)) {
                    layer.msg('请输入数字！', {icon: 7});
                    return false;
                } else {
                    Vue.set(self.corporation, 'revenue', revenue);
                }
            }
            if (self.corporation.custType!=2&&self.corporation.legalIdnum.length<6) {
                layer.msg('证件号不能少于6位！',{icon: 7});
                return;
            }
            if(formValid){
                $.http.$post("/crm/ajax/comp/comp/check",self.corporation)
                    .then(function(data){
                        if(data.code=="200"){
                            if (compCode != null && compCode != '') {
                                self.update();
                            }else{
                                self.add();
                            }
                        }else{
                            layer.msg(data.message,{icon: 2});
                        }
                    });
            }
        },
        checkCompTel:function (obj,str) {
            var self=this;
            var data=obj[str];
            var res = /^[A-Za-z]+$/;
            var res1=/^[\u4e00-\u9fa5]+$/;
            if(data!=null){
                if (res.test(data)||res1.test(data)) {
                   Vue.set(self.corporation,'compTel',"");
                }
            }

        },
        checkCompFax:function (obj,str) {
            var self=this;
            var data=obj[str];
            var res = /^[A-Za-z]+$/;
            var res1=/^[\u4e00-\u9fa5]+$/;
            if(data!=null){
                if (res.test(data)||res1.test(data)) {
                    Vue.set(self.corporation,'compFax',"");
                }
            }

        },
        checkContactPhone:function (obj,str) {
            var self=this;
            var data=obj[str];
            var res = /^[A-Za-z]+$/;
            var res1=/^[\u4e00-\u9fa5]+$/;
            if(data!=null){
                if (res.test(data)||res1.test(data)) {
                    Vue.set(self.corporation,'contactPhone',"");
                }
            }

        },

        checkLegalTel:function (obj,str) {
            var self=this;
            var data=obj[str];
            var res = /^[A-Za-z]+$/;
            var res1=/^[\u4e00-\u9fa5]+$/;
            if(data!=null){
                if (res.test(data)||res1.test(data)) {
                    Vue.set(self.corporation,'legalTel',"");
                }
            }

        },
        add:function () {
            var self=this;

            //此处请求后台程序，下方是成功后的前台处理……
            var index= layer.load(1, {
                shade: [0.1, '#fff'], //0.1透明度的白色背景
            })
            var compLev={custCompDTO:self.corporation,custCompLevDTO:self.corporationLevel};
            $.http.$post("/crm/ajax/comp/info/add",compLev)
                .then(function(data){
                    layer.close(index);
                    if(data!=null){
                        window.location.href = "/crm/corporation/corporation/info/edit?compCode="+data.compCode;
                        layer.msg('保存成功！',{icon: 1});
                    }
                });
        },
        update:function () {
            var self=this;
            var index= layer.load(1, {
                shade: [0.1, '#fff'], //0.1透明度的白色背景
            })
            var compLev={custCompDTO:self.corporation,custCompLevDTO:self.corporationLevel};
            $.http.$post("/crm/ajax/comp/info/update",compLev)
                .then(function(data){
                    layer.close(index);
                    if(data.code==200){
                        layer.msg('保存成功！',{icon: 1});
                    }else{
                        layer.msg(data.message,{icon: 2});
                    }
                });
        },
        back:function () {
            //此处请求后台程序，下方是成功后的前台处理……
            var index= layer.load(1, {
                shade: [0.1, '#fff'], //0.1透明度的白色背景
            })
            window.location.href = "/crm/corporation/corporation";
            layer.close(index);
        },
    }
});

