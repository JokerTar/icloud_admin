var vueObj;

vueObj = new Vue({
    el: "#vueObj",
    data: {
        compFileList: [],
        compFile: {},
        ids:[],
        selectedIndex: null,
        selectedTr: {},
        dict:{fileTypes:{}},
        billdata:{id:null},
        uploadcfg:{
            fileType:"CRM",
            path:'/upload/file',
            downpath:"/download/file?"
        },


    },
    created: function () {
       this.dosearch();
    },
    mounted: function () {
        var self=this;
        $.post("/crm/ajax/compFile/list/dict").then(function(data){
            self.dict = data;
        });
      if( self.compFileList!=null&& self.compFileList.length!=0){
          self.compFileList.forEach(function (item, index) {
              Vue.set(self, 'compFile', [{id: item.id, fileType: item.fileType}])
              if(item.files==null||item.files.length()==0){
                Vue.set(item,'files',[])
              }
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
            var self=this;
            var compId = $("#id").val();
            self.compFileList = [];
            $.post("/crm/ajax/compFile/list", {compCode:$.getUrlParam("compCode")}).then(function (data) {
                self.compFileList = data;
                self.compFileList.forEach(function(item,index) {
                    if (item.files==null||item.files==undefined) {
                        item.files=[];
                    }
                })
            })
        },
        selected: function (model, index) {
            Vue.set(this, 'selectedTr', model);
            Vue.set(this, 'selectedIndex', index);
        },
        addAction: function () {
            this.compFileList.push({
                yn: 1,
                id:null,
                files:[]
            });
        },
        uploadFile:function(event,files){
            files.pop();
            $(event.currentTarget).prev("div").children("input[type='file']").val('');
            $(event.currentTarget).prev("div").children("input[type='file']").click();
        },
        delFunction:function(item,model){
            var self=this;
            var files = model.files;
            files.splice(item,1);
            Vue.set(model,'files',files);
        },
        deleteAction: function () {
            var self=this;
            if(self.selectedIndex==null){
                layer.msg('请选择有效数据！',{icon: 7});
                return false;
            }
            if(self.selectedTr!=null&&self.selectedIndex!=null){
                self.compFileList.splice(self.selectedIndex,1);
                Vue.set(self,"selectedIndex",null);
            }
            if(self.selectedTr.id!=null&&self.selectedTr.id!=undefined&&self.selectedTr.id!="") {
                self.ids.push(self.selectedTr.fileCode);
                Vue.set(self,"selectedTr",{});
            }
        },
        save:function () {
            var self=this;
            var compCode = $.getUrlParam("compCode");
            self.compFileList.forEach(function (item, index) {
                item.compCode=compCode;
                if(item.id==null&&(item.fileType==null||item.fileType=="")){
                    Vue.set(item,'fileType',11);
                }
            });
            if(self.compFileList!=null&&self.compFileList.length!=0) {
                $.http.$post("/crm/ajax/compFile/info/save", self.compFileList)
                    .then(function (data) {
                        layer.closeAll('loading');
                        if (data.code = 200) {
                            layer.msg('保存成功！', {icon: 1});
                            self.dosearch();
                        }
                        Vue.set(self, "selectedIndex", null);
                        Vue.set(self, "selectedTr", {});
                    })
            }else{
                layer.msg('请填写信息后在保存！', {icon: 7});
            }
        },

        del:function () {
            var self=this;
            var compId = $("#id").val();
            $.http.$post("/crm/ajax/compFile/info/del",self.ids)
                .then(function(data) {
                    layer.closeAll('loading');
                    if (data.code== 200) {
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
            if(self.compFileList!=null&&compCode!=null&&compCode!=''){
                if(self.compFileList!=null&&self.compFileList.length!=0) {
                    self.save();
                }else{
                    layer.msg('保存成功！', {icon: 1});
                }
            }
            self.dosearch();
        },
        //判断每种类型的文件只能有一个
        checkFileType:function (index) {
            var self=this;
            var fileType=self.compFileList[index].fileType;
            if(fileType!=11){
                for(var i=0;i<self.compFileList.length;i++){
                    if(i!=index && self.compFileList[i].fileType==fileType){
                        layer.msg('该类型文件已经存在！', {icon: 2});
                        self.compFileList[index].fileType="";
                        return false;
                    }
                }

            }
        }
    },
});




