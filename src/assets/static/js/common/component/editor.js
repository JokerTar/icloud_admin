Vue.use(window.tinymce);
Vue.component('tinymce', {
    props: ['value'],
    data:function(){
        return{
            flag:true
        }
    },
    template: '<div><textarea style="height:300px" v-model="value"></textarea></div>',
    watch:{
        value: function(val){
            if(this.flag){
                tinyMCE.activeEditor.setContent(val);
            }
            this.flag=true;
        }
    },
    mounted: function(){
        var component = this;
        tinymce.init({
            target: this.$el.children[0],
            language: "zh_CN",
            menubar: false,
            branding: false,
            valid_elements: "p[style],span[style],ul,ol,li,strong/b,em,h1,h2,h3,h4,h5,h6",
            valid_style: {
                "*":"color,font_size,text-align,line-height"
            },
            upload_image_url: '/upload/cloud', //配置的上传图片的路由
            plugins: " paste,importcss,image,code,table,advlist,fullscreen,link,media,lists,textcolor, colorpicker,preview,hr,searchreplace,insertdatetime,print,imagetools,toc,charmap",
            toolbar: ['fontselect | formatselect | fontsizeselect | forecolor backcolor | bold italic underline strikethrough | image  media | table | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | preview removeformat  hr | paste code  link | undo redo | fullscreen searchreplace  insertdatetime|quickimage print|insertfile|rotateleft rotateright flipv fliph|editimage imageoptions|toc charmap'],
            menubar: 'file edit insert view format table',
            // 配置每个菜单栏的子菜单项（如下是默认配置）
            menu: {
                file: {title: 'File', items: 'newdocument'},
                edit: {title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall'},
                insert: {title: 'Insert', items: 'link media | template hr'},
                view: {title: 'View', items: 'visualaid'},
                format: {title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'},
                table: {title: 'Table', items: 'inserttable tableprops deletetable | cell row column'},
            },

            force_p_newlines: true,
            importcss_append: true,



            insert_button_items: 'image link | inserttable',
            paste_retain_style_properties: 'all',
            paste_word_valid_elements: '*[*]',        // word需要它
            paste_data_images: true,                  // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
            paste_convert_word_fake_lists: false,     // 插入word文档需要该属性
            paste_webkit_styles: 'all',
            paste_merge_formats: true,
            nonbreaking_force_tab: false,
            paste_auto_cleanup_on_paste: false,
            // CONFIG: Font
            fontsize_formats: '10px 11px 12px 14px 16px 18px 20px 24px',
            // CONFIG: StyleSelect
            style_formats: [
                {
                    title: '首行缩进',
                    block: 'p',
                    styles: { 'text-indent': '2em' }
                },
                {
                    title: '行高',
                    items: [
                        { title: '1', styles: { 'line-height': '1' }, inline: 'span' },
                        { title: '1.5', styles: { 'line-height': '1.5' }, inline: 'span' },
                        { title: '2', styles: { 'line-height': '2' }, inline: 'span' },
                        { title: '2.5', styles: { 'line-height': '2.5' }, inline: 'span' },
                        { title: '3', styles: { 'line-height': '3' }, inline: 'span' }
                    ]
                }
            ],

            // Tab
            tabfocus_elements: ':prev,:next',
            object_resizing: true,
            // Image
            imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',

            setup: function(editor) {
                editor.on('input undo redo execCommand', function(e) {
                    component.flag=false;
                    component.$emit('input', editor.getContent());
                })
            },

        });

    },
})
