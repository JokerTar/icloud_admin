Vue.component("manage-layout",{
    data:function(){
        return{
            btns:[],
            menus:[],
            userInfo:{},
            openeds: ['1'],
            uniqueOpened: false,
            showChoseDept:false,
            employeeDepts:[],
            checkedDept:{}
        }
    },
    props:{
        pageInfo:Object,
    },
    template:"#manage-layout",
    updated:function(){
    },
    mounted:function () {
        var self = this;
        $.post("/rbac/ajax/user/current/info",{}).then(function (data) {
            if (data != null) {
                Vue.set(self,'userInfo',data);
            }
        });
        $.post("/rbac/ajax/menu/all").then(function (data) {
            Vue.set(self,'menus',data);
        });
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

    },
    computed: {
        btnList:function(){
            var self = this;
            var pathname = window.location.pathname;
            $.post("/rbac/ajax/menu/btn/all",{resourceUri:pathname}).then(function (data) {
                Vue.set(self,'btns',data);
            });
        },
        baseBtnLists:function(){
            this.btnList;
            return this.btns.filter(function(btn){
                return btn.btnType==10;
            });
        },
        funBtnLists:function(){
            this.btnList;
            return this.btns.filter(function(btn){
                return btn.btnType==20;
            });
        },
        topMenus:function(){
            return this.menus.filter(function(menu){
                return menu.parentCode==0;
            })
        },
        currentMenu:function(){
            var activeMenu=null;
            var currentPath=window.location.pathname;
            for (var i=0;i<this.topMenus.length;i++){
                if(currentPath.indexOf(this.topMenus[i].uri)==0){
                    activeMenu=this.topMenus[i];
                }
            }
            return activeMenu;
        },
        secondMenus:function(){
            var menus = this.menus;
            var currentMenu = this.currentMenu;
            return menus.filter(function(menu){
                return menu.parentCode == currentMenu.resCode;
            });
        },

        activeIndex:function(){
            var menus = this.menus;
            var path = window.location.pathname;
            var active = "";
            var currentMenu = menus.filter(function(menu){
                return path==(menu.uri);
            });
            if(currentMenu.length>0){
                var leftMenus = menus.filter(function(menu){
                    return (currentMenu[0].parentCode == menu.resCode||currentMenu[0].resCode == menu.resCode)&&menu.resCode.split("-").length==3;
                });

                if(leftMenus.length>0&&leftMenus[0].parentCode!=leftMenus[0].resCode){
                    active = leftMenus[0].resCode;
                }
                if(leftMenus.length>0&&leftMenus[0].parentCode==leftMenus[0].resCode){
                    active = currentMenu[0].resCode;
                }
            }

            return active;

        }


    },
    methods:{
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
                var employeeCode = dept.employeeCode;
                //保存登录组织
                $.http.$post("/rbac/ajax/user/change/dept",dept).then(function (data) {
                    if (data != null) {
                        layer.msg("切换成功",{icon:1});
                        window.location.href="/";
                    }
                })

            }else{
                layer.msg("请选择部门",{icon:5});
            }
        },
        menuClass:function(menu){
            var css = menu.resourceCss;
            if(css==null) css="";
            if(this.currentMenu!=null){
                if(menu.id == this.currentMenu.id){
                    css=css+" state-active";
                    Vue.set(menu,"top","true");
                }
            }
            return css;
        },
        childMenus:function(menu){
            var menus = this.menus;
            var parentCode = menu.resCode;
            return menus.filter(function(menu){
                return  menu.parentCode == parentCode;
            });
        },
        fns:function(fn){
            if(this.$parent[fn]){
                this.$parent[fn]();
            }
        }
    }

});
