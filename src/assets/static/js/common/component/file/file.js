var fileSuffixs=["doc","pdf","ppt","swf","xls","png","gif","jpg","mp3"];
Vue.component("vue-file-edit",{
    data:function(){
        return {
        };
    },
    props:{
        filelist:Array,
        index:Number,
        fitem:Object,
        uploadcfg:Object
    },
    template:"#vue-file-edit",
    mounted:function(){
    },
    computed:{
    },
    methods:{
        size:function(fileSize){
            if(fileSize==null||isNaN(fileSize)){
                return "";
            }
            var showsize = "";
            if(fileSize*1<1000){
                showsize= fileSize+"B";
            }else if(1000<=fileSize && fileSize<1000*1000){
                showsize = Math.round(fileSize *1.0/1000*10)/10+"K"
            }else if(1000*1000<=fileSize && fileSize<1000*1000*1000){
                showsize = Math.round(fileSize *1.0/1000/1000*10)/10+"MB"
            }else{
                showsize = Math.round(fileSize *1.0/1000/1000/1000*10)/10+"G"
            }
            return showsize;
        },
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
            if(fitem==null||fitem==undefined||fitem.fileName==null){
                classStyle["ico-file-broken"]=true;
                return classStyle;
            }
            var suffix =fitem.fileName.substring(fitem.fileName.lastIndexOf(".")+1);
            suffix = suffix.toLowerCase();
            if(suffix=="jpeg"){
                suffix="jpg";
            }
            var cssName ="ico-file-file";
            if(fileSuffixs.indexOf(suffix)>-1){
                cssName ="ico-file-"+suffix;
            }
            classStyle[cssName]=true;
            return classStyle;
        },
        down:function(fitem){
            var fileToken = fitem.fileToken;
            var location=this.uploadcfg.downpath+"fileToken="+fitem.fileToken;
            $.post(location).then(function(data){
                window.location = data.linkUrl;
            })
        },
        delFile:function(fitem){
            if(this.filelist!=null && this.filelist!='undefined'){
                this.filelist.splice(this.index,1);
            }else{
                this.$emit("delete",fitem.fileToken);
            }

        },
        viewFile:function(fitem){
            //判断是否可预览
            if(fitem==null||fitem==undefined||fitem.fileName==null){
                layer.msg("文件不存在!",{icon:5})
                return false;
            }
            var suffix =fitem.fileName.substring(fitem.fileName.lastIndexOf(".")+1);
            suffix = suffix.toLowerCase();
            if(suffix=="jpeg"){
                suffix="jpg";
            }
            if("jpg"==suffix||"png"==suffix||"gif"==suffix||"bmp"==suffix){
            }else{
                layer.msg("预览功能仅支持图片格式文件!",{icon:5});
                return false;
            }
            var self = this;
            var image = new Image();
            var location=this.uploadcfg.downpath+"fileToken="+fitem.fileToken;
            $.post(location).then(function(data){
                image.src = data.linkUrl;
                var viewer = new Viewer(image, {
                    hidden: function () {
                        viewer.destroy();
                    },
                });
                viewer.show();
            })

        }
    },


});

Vue.component("vue-file-view",{
    data:function(){
        return {
        };
    },
    props:{
        fitem:Object,
        uploadcfg:Object
    },
    template:"#vue-file-view",
    mounted:function(){
    },
    computed:{
    },
    methods:{
        size:function(fileSize){
            if(fileSize==null||isNaN(fileSize)){
                return "";
            }
            var showsize = "";
            if(fileSize*1<1000){
                showsize= fileSize+"B";
            }else if(1000<=fileSize && fileSize<1000*1000){
                showsize = Math.round(fileSize *1.0/1000*10)/10+"K"
            }else if(1000*1000<=fileSize && fileSize<1000*1000*1000){
                showsize = Math.round(fileSize *1.0/1000/1000*10)/10+"MB"
            }else{
                showsize = Math.round(fileSize *1.0/1000/1000/1000*10)/10+"G"
            }
            return showsize;
        },
        fileIcon:function(fitem){
            var classStyle={};
            if(fitem==null||fitem==undefined||fitem.fileName==null){
                classStyle["ico-file-broken"]=true;
                return classStyle;
            }
            var suffix =fitem.fileName.substring(fitem.fileName.lastIndexOf(".")+1);
            suffix = suffix.toLowerCase();
            if(suffix=="jpeg"){
                suffix="jpg";
            }
            var cssName ="ico-file-file";
            if(fileSuffixs.indexOf(suffix)>-1){
                cssName ="ico-file-"+suffix;
            }
            classStyle[cssName]=true;
            return classStyle;
        },
        down:function(fitem){
            var fileToken = fitem.fileToken;
            var location=this.uploadcfg.downpath+"fileToken="+fitem.fileToken;
            console.info(location)
            $.post(location).then(function(data){
                window.location = data.linkUrl;
            })
        },
        viewFile:function(fitem){
            //判断是否可预览
            if(fitem==null||fitem==undefined||fitem.fileName==null){
                layer.msg("文件不存在!",{icon:5})
                return false;
            }
            var suffix =fitem.fileName.substring(fitem.fileName.lastIndexOf(".")+1);
            suffix = suffix.toLowerCase();
            if(suffix=="jpeg"){
                suffix="jpg";
            }
            if("jpg"==suffix||"png"==suffix||"gif"==suffix||"bmp"==suffix){

            }else{
                layer.msg("预览功能仅支持图片格式文件!",{icon:5});
                return false;
            }
            var self = this;
            var image = new Image();
            var location=this.uploadcfg.downpath+"fileToken="+fitem.fileToken;
            $.post(location).then(function(data){
                image.src = data.linkUrl;
                var viewer = new Viewer(image, {
                    hidden: function () {
                        viewer.destroy();
                    },
                });
                viewer.show();
            })

        }
    },


});


Vue.component("vue-file-input",{
    data:function(){
        return {};
    },
    props:{
        uploadcfg:Object,
        filelist:Array,
        filename:String
    },
    template:"#vue-file-input",
    mounted:function(){
    },
    computed:{
    },
    methods:{
        size:function(fileSize){
            if(fileSize==null||isNaN(fileSize)){
                return "";
            }
            var showsize = "";
            if(fileSize*1<1000){
                showsize= fileSize+"B";
            }else if(1000<=fileSize && ffileSize<1000*1000){
                showsize = Math.round(fileSize *1.0/1000*10)/10+"K"
            }else if(1000*1000<=fileSize && fileSize<1000*1000*1000){
                showsize = Math.round(fileSize *1.0/1000/1000*10)/10+"MB"
            }else{
                showsize = Math.round(fileSize *1.0/1000/1000/1000*10)/10+"G"
            }
            return showsize;
        },
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
            var fileItem ={'fileName':fileName,size:filesize,fileToken:"",per:0};
            //增加展示
            this.filelist.push(fileItem);
            return fileItem;
        },
        uploadFileItem:function(event){
            var self = this;
            var file = $(event.currentTarget).get(0).files[0];
            if(file==null){return false;}
            var formData = new FormData();
            formData.append("fileType",self.uploadcfg.fileType);
            if(self.filename!=null&&self.filename.length>0){
                var fileSuffxIndex = file.name.lastIndexOf(".");
                fileSuffxIndex = fileSuffxIndex>-1?fileSuffxIndex:file.name.length;
                var fileNameIndex = self.filename.lastIndexOf(".");
                fileNameIndex = fileNameIndex>-1?fileNameIndex:self.filename.length;
                var newFileName = self.filename.substr(0,fileNameIndex)+file.name.substring(fileSuffxIndex);
                formData.append("file",file,newFileName);
            }else{
                formData.append("file",file);
            }
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
                    layer.msg("文件上传成功!",{icon:1});
                    event.fileItem.fileName = data.fileName;
                    event.fileItem.fileSize = data.fileSize;
                    event.fileItem.fileToken = data.fileToken;
                    Vue.set(event.fileItem,'per',null);
                },
                error:function (XMLHttpRequest, textStatus, errorThrown) {
                    layer.closeAll("loading");
                    var message = XMLHttpRequest.responseJSON;
                    if(message==null||message.message==null){
                        message = {message:"上传失败!"};
                    }
                    Vue.set(event.fileItem,'fileName',null);
                    layer.msg(message.message.replace(new RegExp(";","g"),"<br/>"),{icon:5});
                }
            });
        }
    }
});

Vue.component("vue-file-input-import",{
    data:function(){
        return {};
    },
    props:{
        uploadcfg:Object,
        filelist:Array,
        filename:String
    },
    template:"#vue-file-input",
    mounted:function(){
    },
    computed:{
    },
    methods:{
        size:function(fileSize){
            if(fileSize==null||isNaN(fileSize)){
                return "";
            }
            var showsize = "";
            if(fileSize*1<1000){
                showsize= fileSize+"B";
            }else if(1000<=fileSize && ffileSize<1000*1000){
                showsize = Math.round(fileSize *1.0/1000*10)/10+"K"
            }else if(1000*1000<=fileSize && fileSize<1000*1000*1000){
                showsize = Math.round(fileSize *1.0/1000/1000*10)/10+"MB"
            }else{
                showsize = Math.round(fileSize *1.0/1000/1000/1000*10)/10+"G"
            }
            return showsize;
        },
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
            var fileItem ={'fileName':fileName,size:filesize,fileToken:"",per:0};
            //增加展示
            this.filelist.push(fileItem);
            return fileItem;
        },
        uploadFileItem:function(event){
            var self = this;
            var file = $(event.currentTarget).get(0).files[0];
            if(file==null){return false;}
            var formData = new FormData();
            formData.append("fileType",self.uploadcfg.fileType);
            if(self.filename!=null&&self.filename.length>0){
                var fileSuffxIndex = file.name.indexOf(".");
                fileSuffxIndex = fileSuffxIndex>-1?fileSuffxIndex:file.name.length;
                var fileNameIndex = self.filename.indexOf(".");
                fileNameIndex = fileNameIndex>-1?fileNameIndex:self.filename.length;
                var newFileName = self.filename.substr(0,fileNameIndex)+file.name.substring(fileSuffxIndex);
                formData.append("file",file,newFileName);
            }else{
                formData.append("file",file);
            }
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
                    if(data.status=='200'){
                        Vue.set(event.fileItem,"dataList",data.body);
                        Vue.set(event.fileItem,'per',null);
                        layer.msg('上传成功！',{icon: 1});
                    }else{
                        Vue.set(event.fileItem,'fileName',null);
                        layer.msg(data.msg,{icon: 7});
                    }
                },
                error:function (XMLHttpRequest, textStatus, errorThrown) {
                    layer.closeAll("loading");
                    var message = XMLHttpRequest.responseJSON;
                    if(message==null||message.message==null){
                        message = {message:"上传失败!"};
                    }
                    Vue.set(event.fileItem,'fileName',null);
                    layer.msg(message.message.replace(new RegExp(";","g"),"<br/>"),{icon:5});
                }
            });
        }
    }
});