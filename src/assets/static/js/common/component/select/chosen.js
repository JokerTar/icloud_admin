Vue.component("vue-chosen",{
    data:function(){
        return {
            selectel:this.value,
            ele:null
        };
    },
    props:['value','loading'],
    template:"\
        <select style=\"width:100%;\" v-model=\"selectel\" name=\"selectel\" data-placeholder=\"选择排序\">\
                <option />\
                <slot></slot>\
            </select>\
            ",
    watch:{
        value:function (nVal,oVal) {
                this.selectel = nVal;
        },
        selectel:function(nVal,oVal){
            var self = this;
            if(nVal!=oVal&&!this.loading){
                self.$emit('changes', self.selectel);
            }
        }
    },
    beforeUpdate:function(){
        if(this.ele==null){
            this.ele = this.$el.outerHTML;
        }
    },
    updated:function(){
        if(this.ele != this.$el.outerHTML){
            this.rendChosen();
            this.ele =this.$el.outerHTML;
        }else{
            $(this.$el).trigger("chosen:updated");
        }
    },
    mounted:function(){
        var self = this;
        self.rendChosen();
        $(this.$el).change(function(){
            self.selectel = $(this).val();

            self.$emit('input', self.selectel);
        });
    },
    methods:{
        rendChosen:function(){
            $(this.$el).chosen("destroy");
            $(this.$el).chosen({allow_single_deselect:true,inherit_select_classes:true,width: "95%"});
        }
    }
})