var btnId = null;
var baseBtn = null;
var functionBtn = null;
$(function(){
    btnId = $("#baseBtn");
    if (btnId.html() !=undefined) {
        baseBtn = new Vue({
            el :"#baseBtn",
            data:{
                btns:[]
            },
            computed:{
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
                }

            },
            methods:{
                fns:function(fn){
                    baseBtnAction[fn]();
                }

            }
        });

        functionBtn = new Vue({
            el :"#side-tool",
            data:{
            },
            computed:{
                funBtnLists:function(){
                    baseBtn.btnList;
                    return baseBtn.btns.filter(function(btn){
                        return btn.btnType==20;
                    });
                }
            },
            methods:{
                fns:function(fn){
                    functionBtnAction[fn]();
                }

            }

        })

    }
})

