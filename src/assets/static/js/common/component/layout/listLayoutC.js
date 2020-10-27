Vue.component("list-layout-c",{
    data:function(){
        return {
            menus:[],
            userInfo:{},
            showChoseDept:false,
            employeeDepts:[],
            checkedDept:{},
            photoSrcUrl:null,
        };
    },
    template:"#list-layout-c",
    props:{
        pageInfo:Object,
    },
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
        currentMenu:function(){
            var activeMenu=null;
            var currentPath=window.location.pathname;
            var paths = currentPath.split("/");
            var targetMenuUri = "/"+paths[1];
            var activeMenu = null;
            for (var i=0;i<this.menus.length;i++){
                //地址一致
                if(targetMenuUri==this.menus[i].uri){
                    activeMenu = this.menus[i];
                    break;
                }
            }
            return activeMenu;
        },
        topSecndMenus:function(){
            var self = this;
            var secndMenus = [];
            if(self.menus!=null&&self.menus.length>0){
                for(var i = 0;i<self.menus.length;i++){
                    if(self.menus[i].parentCode == self.currentMenu.resCode){
                        secndMenus.push(self.menus[i]);
                    }
                }
            }
            return secndMenus;
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
            if(this.menus!=null&&this.menus.length>0){
                var menus = this.menus;
                //筛选出当前选中的二级菜单
                var secndMenu = menus.filter(function(menu){
                    return menu.secnd=="true";
                });
                return menus.filter(function(menuItem){
                    var flag = false;
                    if(secndMenu!=null&&secndMenu.length>0){
                        flag = menuItem.parentCode==secndMenu[0].resCode;
                    }
                    return flag;
                });
            }
        }



    },
    methods:{
        doSearch:function(){
            this.$parent.dosearch();
        },
        menuClass:function(menu){
            var css = menu.resourceCss;
            if(css==null) css="";
            if(this.currentMenu!=null){
                if(menu.resCode == this.currentMenu.resCode){
                    css=css+" state-active";
                    Vue.set(menu,"top","true");
                }
            }
            return css;
        },
        menuSecndClass:function(menu){
            var css = menu.css;
            if(css==null) css="";
            var currentPath = window.location.pathname;
            var secndId = null;
            //查找当前菜单
            for (var i=0;i<this.menus.length;i++){
                //地址一致
                if(currentPath==this.menus[i].uri||this.menus[i].uri == currentPath.substring(0,currentPath.lastIndexOf("/"))){
                    if((this.menus[i].resCode!=menu.resCode&&this.menus[i].parentCode == menu.resCode )||this.menus[i].resCode==menu.resCode){
                        secndId = menu.resCode;
                        Vue.set(menu,"secnd","true");
                    }
                }
            }
            if(menu.resCode==secndId){
                css=css+" current";
            }
            return css;
        },
        menuLeftClass:function(menu){
            var css = menu.css;
            if(css==null) css="";
            var currentPath = window.location.pathname;
            if(currentPath==menu.uri){
                css=css+" current";
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
        nextPage:function(){
            this.pageInfo.pageNum = this.pageInfo.nextPage;
        },
        prePage:function(){
            this.pageInfo.pageNum = this.pageInfo.prePage;
        },
        firstPage:function(){
            this.pageInfo.pageNum = 1;
        },
        lastPage:function(){
            this.pageInfo.pageNum = this.pageInfo.pages;
        }
    }

});
