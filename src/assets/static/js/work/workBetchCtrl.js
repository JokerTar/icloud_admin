var vueObj;
vueObj = new Vue({
    el: '#vueObj',
    data: {
        vm :{activeTab:7,show_search:0,show_list:0,searchParam:0},
        baseInfo:{},
        pageInfo: {
            searchValue:null,pageNum:1,pageSize:10,startTime:null,endTime:null
        },
        pageInfo1: {
            searchValue:null,pageNum:1,pageSize:10,startTime:null,endTime:null
        },
        schedulePageInfo:{ searchValue:null,pageNum:1,pageSize:10,executionTime:null,status:null},
        count:0,
        user:{},
        workflowToDoTaskCount:0,
        businessToDoTaskList:[],
        userDateList:[],
        noticeList:[],
        noticeImpList:[],
        calendar:new Date(),
        leftschedule:false,
        dateFlag:false,
        scheduleInfo:{},
        search:{},
        unReadyList:[],
        unReadySendList:[],
        imptContentList:[],
        scheduleList:[],
        scheduleAllList:[],
        scheduleDayList:[],
        executeStatus:[],
        userDateList:[],
        dict: {applyStatus: []},
        selectedTr: {},
        count:0,
        uploadcfg:{
            path:'/upload/file',
            downpath:"/download/file?fileToken="
        },
        photoSrcUrl:null,
    },
    created: function () {
        var self = this;
        var executeStatus=[{code:0,mark:"全部"},{code:1,mark:"未执行"},{code:2,mark:"已执行"}];
        Vue.set(self.dict,'executeStatus',executeStatus);
        self.dosearch();

        self.businessTodoTaskNode();
        self.scheduleSearch();
        self.scheduleSearch2();
    },
    mounted: function () {
        var self=this;
        $.post("/rbac/ajax/user/current/info").then(function (data) {
            self.user = data;
        });
        self.businessTodoTaskNode();

    },
    computed:{
        photoSrc:function(){
            var srcStr = "";
            var self = this;
            if(this.user.photoToken!=null&&this.user.photoToken.length>0){
                srcStr=this.uploadcfg.downpath+this.user.photoToken;
                if(srcStr!=null){
                    $.post(srcStr).then(function(data){
                        Vue.set(self,'photoSrcUrl',data.linkUrl);
                    })
                }
            }else{
                srcStr="/images/photo.jpg";
            }
            return srcStr;
        }
    },
    methods: {
        /**=========业务审批开始===============*/
        /**
         * 查询当前登录人的业务审批任务
         */
        businessTodoTaskNode:function () {
            var self=this;
            Vue.set(self.vm,'activeTab',7);
            $.post("/work/ajax/business/list").then(function (data) {
                self.businessToDoTaskList = data;
            });
        },
        toBusinessTodoTask:function (item) {
            window.location.href = item.url+"?param="+item.param;
        },


        /**=========日程模块处理开始===============*/
        middleScheduleNode:function () {
            var self=this;
            Vue.set(self.vm,'activeTab',3);
            Vue.set(self,'leftschedule',true);
            self.scheduleSearch();
            self.scheduleSearch2();

            self.search.searchValue=null;
        },
        executeType:function (item) {
            var self=this;
            Vue.set(self.schedulePageInfo,'status',null);
            self.executeStatus=item.code;
            self.scheduleRecordCount=0;
            if(item.code==1){
                Vue.set(self.schedulePageInfo,'status',0);
            }
            if(item.code==2){
                Vue.set(self.schedulePageInfo,'status',1);
            }
            self.scheduleSearch2();
        },
        queryScheduleByDate:function (val) {
            var self=this;
            Vue.set(self.schedulePageInfo,'searchValue',self.search.searchValue);
            Vue.set(self.schedulePageInfo,'executionTime',val);
            $.http.$post("/rbac/ajax/schedule/list",self.schedulePageInfo)
                .then(function(data){
                    Vue.set(self,'scheduleList',data);
                    data.searchValue=self.schedulePageInfo.searchValue;
                    self.schedulePageInfo.searchValue = data.searchValue;
                });
        },
        scheduleSearch:function () {
            var self=this;
            var workflowToDoTaskCount=0;
            Vue.set(self.schedulePageInfo,'searchValue',self.search.searchValue);
            Vue.set(self.schedulePageInfo,'executionTime',new Date());
            $.http.$post("/rbac/ajax/schedule/list",self.schedulePageInfo)
                .then(function(data){
                    Vue.set(self,'scheduleDayList',data);
                    self.scheduleDayList.forEach(function (item,index) {
                        if(item.yn==0 ){
                            workflowToDoTaskCount=workflowToDoTaskCount+1;

                        }
                    });
                    Vue.set(self,'workflowToDoTaskCount',workflowToDoTaskCount);
                    Vue.set(self,'scheduleList',data);
                    self.search.searchValue = self.schedulePageInfo.searchValue;

                });
        },
        scheduleSearch2:function () {
            var self=this;
            Vue.set(self.schedulePageInfo,'searchValue',self.search.searchValue);
            Vue.set(self.schedulePageInfo,'pageNum',self.pageInfo1.pageNum);
            Vue.set(self.schedulePageInfo,'pageSize',self.pageInfo1.pageSize);

            $.http.$post("/rbac/ajax/schedule/allList",self.schedulePageInfo)
                .then(function(data){
                    data.searchValue=self.search.searchValue;
                    self.scheduleAllList = data.list;
                    data.searchValue=self.schedulePageInfo.searchValue;
                    self.pageInfo1=data;
                    self.search.searchValue = data.searchValue;
                    if(self.pageInfo1==null){ self.pageInfo1={}; }
                });
        },
        schedulePopUp:function (size,item) {
            var self=this;
            if(item!=null){
                Vue.set(self,'scheduleInfo',item);
            }else{
                Vue.set(self,'scheduleInfo',{});
            }
            var now = new Date();
            var day = ("0" + now.getDate()).slice(-2);

            var month = ("0" + (now.getMonth() + 1)).slice(-2);
            var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
            Vue.set(self.scheduleInfo,'executionTime',today);
            var index=layer.load(1, {
                shade: [0.1, '#fff'], //0.1透明度的白色背景
            })
            $("#Popup-schedule-add").reveal("{data-animation:'none'}");
            layer.closeAll('loading');
        },
        add:function () {
            var self=this;
            $.http.$post("/rbac/ajax/schedule/info/add",self.scheduleInfo)
                .then(function(data){
                    if(data.code==200){
                        layer.msg('操作成功！',{icon: 1});
                        self.scheduleSearch();
                        self.scheduleSearch2();
                        $("#Popup-schedule-add").trigger('reveal:close');
                    } else {
                        layer.msg('操作失败！',{icon: 2});
                    }
                });
        },
        update:function () {
            var self=this;
            $.http.$post("/rbac/ajax/schedule/info/update",self.scheduleInfo)
                .then(function(data){
                    if(data.code==200){
                        layer.msg('操作成功！',{icon: 1});
                        self.scheduleSearch();
                        self.scheduleSearch2();
                        $("#Popup-schedule-add").trigger('reveal:close');
                    } else {
                        layer.msg('操作失败！',{icon: 2});
                    }
                });
        },
        ok:function () {
            var self=this;
            var content;
            if(self.scheduleInfo.content!= null){
                content=trim(self.scheduleInfo.content);

            }
            if (content== undefined||content==null||content=="") {
                layer.alert('请输入日程内容！',{icon: 7});
                return false;
            }


            if (self.scheduleInfo.content.length >= 200) {
                layer.alert('输入内容不得超过200汉字！',{icon: 7});
                self.scheduleInfo.content = self.scheduleInfo.content.substr(0, 200);
            }
            if(self.scheduleInfo.id!=null&&self.scheduleInfo!=''){
                self.update()
            }else{
                self.add();
            }
        },
        performProcessing:function (item) {
            var self=this;
            $.post("/rbac/ajax/schedule/processStatus/perform",{scheduleCode:item.scheduleCode})
                .then(function(data){
                    if(data.code==200){
                        layer.msg('操作成功！',{icon: 1});
                        self.scheduleSearch();
                        self.scheduleSearch2();
                    }else{
                        layer.msg('操作失败！',{icon: 2});
                    }
                });
        },
        deleteScheduleData:function (item) {
            var self=this;
            if(item == null){
                layer.msg('请选择需要删除的数据！',{icon: 7});
                return;
            }
            layer.confirm('确定删除日程数据吗？', {
                btn: ['确定', '取消']
            }, function (index) {
                layer.close(index);
                var index = layer.load(1, {shade: [0.1, '#fff']});
                $.post("/rbac/ajax/schedule/info/delete",{scheduleCode:item.scheduleCode})
                    .then(function(data){
                        if(data.code==200){
                            layer.msg('操作成功！',{icon: 1});
                            self.scheduleSearch();
                            self.scheduleSearch2();
                            self.queryScheduleByDate(item.executionTime);
                        }else{
                            layer.msg('操作失败！',{icon: 2});
                        }
                    });
            });

        },


        /**=========通知模块处理开始===============*/
        intiSearchParamConfig:function () {
            var self=this;
            // 阅读状态
            self.baseInfo.isReady = 0;
            // 优先级
            self.baseInfo.contLevel = 0;
            //开始时间
            self.baseInfo.startDate = "";
            // 截止时间
            self.baseInfo.endDate = "";
        },
        showInfo:function (num) {
            var self=this;
            self.intiSearchParamConfig();
            switch(num){
                case 5://左侧通知按钮 显示所有通知信息
                    self.vm.activeTab=5;
                    self.vm.searchParam=0;
                    self.dosearch();
                    self.dosearchImp();
                    break;
                case 6://上侧通知按钮 显示所有未读信息
                    self.vm.activeTab=5;
                    self.doSearchUnReady();
                    break;
                case 7://右侧通知按钮 显示所有重要通知信息
                    self.vm.activeTab=5;
                    self.vm.searchParam=0;
                    self.dosearch();
                    self.dosearchImp();
                    break;
                case 8://未读
                    self.vm.activeTab=5;
                    self.baseInfo.IS_READY=1;
                    self.dosearch();
                    self.dosearchImp();
                    break;
                default:
                    break;
            }
        },
        dosearch:function () {
            var self=this;
            $.http.$post("/rbac/ajax/contents/content/info/platform",self.pageInfo)
                .then(function(data){
                    data.searchValue=self.pageInfo.searchValue;
                    data.starteDate=self.pageInfo.starteDate;
                    data.endDate=self.pageInfo.endDate;
                    self.pageInfo = data;
                    Vue.set(self,'noticeList',data.list);
                    if(self.pageInfo==null){ self.pageInfo={}; }
                });
        },
        showSearch:function () {
            var self=this;
            if(self.vm.show_search==0){
                self.vm.show_search=1;
            }else{
                self.vm.show_search=0;
            }
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
        },
        nextPage1:function(){
            this.pageInfo1.pageNum = this.pageInfo1.nextPage;
        },
        prePage1:function(){
            this.pageInfo1.pageNum = this.pageInfo1.prePage;
        },
        firstPage1:function(){
            this.pageInfo1.pageNum = 1;
        },
        lastPage1:function(){
            this.pageInfo1.pageNum = this.pageInfo1.pages;
        },
    }
});