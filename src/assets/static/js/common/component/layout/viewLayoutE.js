Vue.component("view-layout-e",{
    data:function(){
        return {
            menus:[],
            userInfo:{},
            showChoseDept:false,
            employeeDepts:[],
            checkedDept:{},
            photoSrcUrl:null,
            formdata:{action:'',bill:{}}
        };
    },
    props:['billdata','tabaction'],
    template:"#view-layout-e",
    updated:function(){
    },
    mounted:function(){
        var self = this;
        $(".user-name").mouseover(function(event){
            event.stopPropagation();
            $(".user-list").show();
            $(this).addClass("culon");
        });
        $(document).mouseout(function (event) {
            $(".user-list").hide();
            $(".user-name").removeClass("culon");
        });

        $.post("/rbac/ajax/user/current/info",{}).then(function (data) {
            if (data != null) {
                Vue.set(self,'userInfo',data);
            }
        })
        $.post("/rbac/ajax/menu/all").then(function (data) {
            Vue.set(self,'menus',data);
        });

    },
    computed: {
        topMenus:function(){
            if(this.menus!=null&&this.menus.length>0){
                return this.menus.filter(function(menu){
                    return menu.parentCode=="0";
                })
            }else{
                return [];
            }
        },
        topCurrentMenu:function(){
            var topCurrent = null;
            for(var i=0;i<this.topMenus.length;i++){
                if(this.currentMenu.uri.indexOf(this.topMenus[i].uri)==0){
                    topCurrent = this.topMenus[i];
                    break;
                }
            }
            return topCurrent;
        },
        currentMenu:function(){
            var activeMenu=null;
            var currentPath=window.location.pathname;
            var targetMenu = null;
            for (var i=0;i<this.menus.length;i++){
                //地址一致
                if(currentPath==this.menus[i].uri){
                    targetMenu = this.menus[i];
                    break;
                }
            }
            return targetMenu;
        },
        topSecndMenus:function(){
            var self = this;
            if(this.menus!=null&&this.menus.length>0){
                return self.menus.filter(function(menu){
                    var flag = false;
                    if(self.topCurrentMenu!=null){
                        flag = menu.parentCode== self.topCurrentMenu.resCode;
                    }
                    return flag;
                });
            }else{
                return [];
            }

        },
        photoSrc:function(){
            var self = this;
            var srcStr = "";
            if(this.userInfo!=null&&this.userInfo.photoToken!=null&&this.userInfo.photoToken.length>0){
                srcStr = "/download/file?fileToken="+this.userInfo.photoToken;
                if(srcStr!=null){
                    $.post(srcStr).then(function(data){
                        Vue.set(self,'photoSrcUrl',data.linkUrl);
                    })
                }
            }else{
                srcStr = "/images/photo.jpg";
            }
            return srcStr;
        },
        leftLoad:function(){
            return this.menus.length>0;
        },
        leftMenus:function() {
            var self = this;
            var currentPath = this.currentMenu.uri;
            var preOne = currentPath.substring(0,currentPath.lastIndexOf("/"));
            var preTwo = preOne.substring(0,preOne.lastIndexOf("/"));
            var leftCurrentMenus = this.menus.filter(function(menu){
                return menu.uri==preTwo;
            });
            var leftCurrentMenu = leftCurrentMenus[0];
            var leftMenus = this.menus.filter(function(menu){
                var isLeft = menu.parentCode==leftCurrentMenu.resCode;
                if(isLeft==true){
                    var hasView = self.menus.filter(function(menuL){
                        return menuL.parentCode == menu.resCode&&(menuL.uri.indexOf("/edit")>0||menuL.uri.indexOf("/add")>0||menuL.uri.indexOf("/view")>0);
                    });
                    if(hasView!=null&&hasView.length>0){
                        isLeft = true;
                    }else {
                        isLeft = false;
                    }
                }
                return isLeft;
            });
            return leftMenus;
        }

    },
    methods:{
        findTopMenu:function(menu,menus){
            if(menu!=null&&menu.parentCode=="0"){
                return menu;
            }
            var parentMenu = null;
            if(menu!=null&&menu.parentCode!="0"){
                for (var i=0;i<menus.length;i++){
                    if(menus[i].resCode == menu.parentCode){
                        parentMenu = menus[i];
                        break;
                    }
                }
            }
            if(parentMenu!=null){
                return this.findTopMenu(parentMenu,menus);
            }

        },
        menuClass:function(menu){
            var css = menu.css;
            if(css==null) css="";
            if(this.currentMenu!=null){
                if(this.currentMenu.uri.indexOf(menu.uri)==0){
                    css=css+" state-active";
                    Vue.set(menu,"top","true");
                }
            }
            return css;
        },
        menuSecndClass:function(menu){
            var css = menu.css;
            if(css==null) css="";
            var currentPath = this.currentMenu.uri;
            var preOne = currentPath.substring(0,currentPath.lastIndexOf("/"));
            var preTwo = preOne.substring(0,preOne.lastIndexOf("/"));
            var preThree =preTwo.substring(0,preTwo.lastIndexOf("/"));
            var mark=$.getUrlParam("mark");
            if(mark=="detail"){
                preThree = "/rf/assetPlan";
            }else if(mark=="waitReview" || mark=="review"){
                preThree = "/rf/assetsReview";
            }else if(mark=="supplierSign" || mark=="factoringSign"){
                preThree = "/rf/assetsSign";
            }
            var secndId = null;
            //查找当前菜单
            if(menu.uri == preThree){
                Vue.set(menu,"secnd","true");
                css=css+" current";
            }
            return css;
        },
        menuLeftClass:function(menu){
            var css = menu.css;
            if(css==null) css="";
            var currentPath = this.currentMenu.uri;
            if(currentPath.indexOf(menu.uri)==0){
                css=css+"on";
            }
            return css;
        },
        choseDept:function(){
            this.showChoseDept = true;
            this.checkedDept = {};
            //查询员工所在部门
            var self = this;
            Vue.set(self,'employeeDepts',self.userInfo.depts);
        },
        closeDept:function(){
            this.showChoseDept = false;
        },
        checkDept:function(dept){
            //清除所有
            this.checkedDept = dept;
        },
        confirmDept:function(){
            var dept = this.checkedDept;
            if(dept!=null){
                var employeeId = dept.employeeId;
                //保存登录组织
                $.http.$post("/rbac/ajax/user/change/dept",dept).then(function (data) {
                    if (data != null) {
                        layer.msg("切换成功",{icon:1});
                        window.location.reload();
                    }
                })

            }else{
                layer.msg("请选择部门",{icon:5});
            }
        },
        clickUser:function(){
            window.location.href="/manage/setting/user"
        },
        tabUri:function(uri){
            var self = this;
            this.formdata.action = uri;
            Vue.set(this.formdata,'bill',self.billdata);
            if(self.tabaction){
                if(self.tabaction()){
                    this.$nextTick(function(){
                        self.$refs.billform.submit();
                    });
                }
            }

        },
        back:function () {
            var self=this;
            var mark=$.getUrlParam("mark");
            if(mark=="detail"){
                window.location.href = "/rf/assets/assetDetail";
            }else if(mark=="waitReview"){
                window.location.href = "/rf/assetsReview/aasetWaitReview";
            }else if(mark=="review"){
                window.location.href = "/rf/assetsReview/assetReview";
            }else if(mark=="supplierSign"){
                window.location.href = "/rf/assetsSign/supplierSign";
            }else if(mark=="factoringSign"){
                window.location.href = "/rf/assetsSign/factoringSign";
            }else if(mark=="waitLoan"){
                window.location.href = "/rf/loan/waitLoan";
            }else if(mark=="processLoan"){
                window.location.href = "/rf/loan/processLoan";
            }else if(mark=="successLoan"){
                window.location.href = "/rf/loan/successLoan";
            }else if(mark=="failLoan"){
                window.location.href = "/rf/loan/failLoan";
            }else if(mark=="waitRepay"){
                window.location.href = "/rf/repay/waitRepay";
            }else if(mark=="successRepay"){
                window.location.href = "/rf/repay/successRepay"
            }

        }

    }


});
