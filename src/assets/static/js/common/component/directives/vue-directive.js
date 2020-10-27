Vue.directive("valid",function(el,binding,vnode){
    if(vnode.context.v_valid!=false){
        var v=vnode.context.$v;
        var model;
        if(vnode.data.model){
            model = vnode.data.model.expression;
        }else{
            var models = vnode.data.directives.filter(function(el){
                return el.name=='model';
            })
            if(models!=null){
                model = models[0].expression;
            }
        }
        var attrs = model.split(".");
        for(var i=0;i<attrs.length;i++){
            if(v){
                v = v[attrs[i]];
            }
        }
        if(v&&v.$invalid){
            $(el).addClass("error");
        }else{
            $(el).removeClass("error");
        }
    }
});