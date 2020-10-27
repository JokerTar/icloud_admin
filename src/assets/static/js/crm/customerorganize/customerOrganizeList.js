var vueObj;
vueObj = new Vue({
    el: "#vueObj",
    data: {
        pTree: null,
        compCode:'',
        selectComp:-1,
        compList:[]
    },
    mounted: function () {
        var self = this;
        $.post("/crm/ajax/organize/comp/list").then(function (data){
            Vue.set(self,'compList',data)
        });
        self.pTree = $.fn.zTree.init($("#pTree"), {
            noExpand: true,
            async: {
                enable: true,
                url:"/crm/ajax/organize/organize/list",
                autoParam: ["compCode=parentCode"],
                otherParam: {compCode:this.compCode},
                dataFilter: self.dataTree
            },
            callback: {
                onClick: self.clickTree,
                onNodeCreated: self.onNodeCreated
            }
        });
    },
    computed: {
        parentCode: function () {
            var id = 0;
            if (this.pTree.selectedTree != null) {
                id = this.pTree.selectedTree.compCode;
            }
            return id;
        }
    },
    methods: {
        dataTree: function (treeId, parentNode, responseData) {
            var data = responseData;
            for (var i = 0; i < data.length; i++) {
                data[i].open = false;
                if(data[i].isExist==0){
                    data[i].isParent = false;
                }else{
                    data[i].isParent = true;
                }

                if (data[i].custType == 1) {
                    data[i].name = data[i].compName;
                    data[i].icon = ZTREE_ICON.CHAPTER;
                } else {
                    data[i].name = data[i].compName;
                    data[i].icon = ZTREE_ICON.ORGANIZE;
                }
            }
            return data;
        },
        onNodeCreated: function (event, treeId, treeNode) {
            if (treeNode != null) {
                if ($.fn.zTree.getZTreeObj(treeId).setting.noExpand) {
                    $.fn.zTree.getZTreeObj(treeId).reAsyncChildNodes(treeNode, "refresh", true)
                } else {
                    $.fn.zTree.getZTreeObj(treeId).expandNode(treeNode, true, false, false);
                }

            }
        },
        selectAction:function () {
            var self=this;
            this.compCode = this.compList[this.selectComp].compCode;
            this.pTree.destroy();
            this.pTree = $.fn.zTree.init($("#pTree"), {
                noExpand: false,
                async: {
                    enable: true,
                    url:"/crm/ajax/organize/organize/list",
                    autoParam: ["compCode=parentCode"],
                    otherParam: {compCode:this.compCode},
                    dataFilter: self.dataTree
                },
                callback: {
                    onClick: self.clickTree,
                    onNodeCreated: self.onNodeCreated
                }
            });
        }
    }
});




