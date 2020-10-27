Vue.component("upload-file-list",{
    data:function(){
        return {};
    },
    props:{
        fitem:Object,
        uploadcfg:Object,
        filelist:Array
    },
    template:"#upload-file-list-tpl",
    mounted:function(){
    },
    computed:{
    },
    methods:{
        fileIcon:function(fitem){
            var classStyle={};
            // word文件ico-file-doc
            // pdf文件ico-file-pdf
            // ppt文件ico-file-ppt
            // swf文件ico-file-swf
            // excel文件ico-file-xls
            // png文件ico-file-png
            // gif文件ico-file-gif
            // jpg文件ico-file-jpg
            // img文件ico-file-img
            // 音乐文件ico-file-mp3
            var suffix =fitem.fileName.substring(fitem.fileName.lastIndexOf(".")+1);
            suffix = suffix.toLowerCase();
            if(suffix=="jpeg"){
                suffix="jpg";
            }
            var cssName ="ico-file-"+suffix;
            classStyle[cssName]=true;
            return classStyle;
        },
        down:function(fitem){
            window.location=this.uploadcfg.downpath+fitem.token;
        },
        delFile:function(fitem){
            Vue.set(fitem,"del",true);
        }
    },


});


Vue.component("upload-file-input",{
    data:function(){
        return {};
    },
    props:{
        uploadcfg:Object,
        filelist:Array
    },
    template:"#upload-file-input-tpl",
    mounted:function(){
    },
    computed:{
    },
    methods:{
        fileStartUp:function(file){
            var fileName =file.name;
            var filesize = "";
            if(file.size<1000){
                filesize= file.size+"B";
            }else if(1000<=file.size&&file.size<1000*1000){
                filesize = Math.round(file.size*1.0/1000*10)/10+"K"
            }else if(1000*1000<=file.size&&file.size<1000*1000*1000){
                filesize = Math.round(file.size*1.0/1000/1000*10)/10+"MB"
            }else{
                filesize = Math.round(file.size*1.0/1000/1000/1000*10)/10+"G"
            }
            var fileItem ={'fileName':fileName,size:filesize,token:"",per:0};
            //增加展示
            this.filelist.push(fileItem);
            return fileItem;
        },
        uploadFileItem:function(event){
            var self = this;
            var file = $(event.currentTarget).get(0).files[0];
            if(file==null){return false;}
            var formData = new FormData();
            formData.append("file",file);
            $.ajax({
                type: "POST",
                url: self.uploadcfg.path,
                data: formData ,
                processData : false,
                contentType : false ,
                xhr: function(){
                    var xhr = $.ajaxSettings.xhr();
                    if(xhr.upload) {
                        xhr.upload.addEventListener("progress" , function(evt){
                            var loaded = evt.loaded;                  //已经上传大小情况
                            var tot = evt.total;                      //附件总大小
                            var per = Math.floor(100*loaded/tot);
                            if(per<100){
                                Vue.set(event.fileItem,'per',per);
                            }else{
                                Vue.set(event.fileItem,'per',per-1);
                            }
                        }, false);
                        xhr.upload.addEventListener("loadstart" , function(evt){
                            event.fileItem =  self.fileStartUp(file);
                        }, false);
                        return xhr;
                    }
                },
                success:function(data){
                    event.fileItem.fileName = data.fileName;
                    event.fileItem.fileSize = data.fileSize;
                    event.fileItem.token =data.token;
                    event.fileItem.fileToken =data.token;
                    Vue.set(event.fileItem,'per',null);
                }
            });
        }
    }
});