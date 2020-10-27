Vue.component("editor",{
    data:function(){
        return {
            editorContent: '',
            editor:null
        };
    },
    template:
        "    <div style='width: 100%'>\n" +
        "        <div ref=\"editor\" style=\"text-align:left;width: 100%;\"></div>\n" +
        "    </div>\n",
    props:['value','readonly'],
    methods: {
    },
    mounted:function() {
        var self = this;
        var E = window.richEditor;
        self.editor = new E(this.$refs.editor)
        self.editor.customConfig.onchange = function(html){
            self.editorContent = html
        }
        self.editor.customConfig.onblur = function(html){
            self.editorContent = html
        }
        self.editor.create()
        if(self.readonly!=null&&self.readonly==true){
            self.editor.$textElem.attr('contenteditable', false)
        }
        self.editor.txt.html(self.value)
    },
    watch:{
        value:function(val){
            var self = this;
            if(this.editorContent!=val){
                this.editorContent = val;
                self.editor.txt.html(self.editorContent)
            }
        },
        editorContent:function(nVal,oVal){
            var self = this;
            if(nVal!=oVal){
                self.$emit('input', self.editorContent);
            }
        }
    },
});