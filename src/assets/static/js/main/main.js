jQuery.each(["get", "post"], function (i, method) {
    jQuery[method] = function (url, data, callback, type) {
        if (url.indexOf("save") > -1 || url.indexOf("update") > -1) {
            layer.load(1, {
                shade: [0.1, '#fff'], //0.1透明度的白色背景
            })
        }
        if(type==null||type==undefined) type="json";
        if (jQuery.isFunction(data)) {
            type = type || callback;
            callback = data;
            data = undefined;
        }
        return jQuery.ajax({
            url: url,
            type: method,
            dataType: type,
            data: data,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                var message = XMLHttpRequest.responseJSON;
                layer.closeAll("loading");
                switch (XMLHttpRequest.status) {
                    case 401:
                        layer.msg("登录超时", {icon: 5});
                        window.location.href = "/logout";
                        break;
                    case 403:
                        layer.msg("部分权限不足", {icon: 5});
                        break;
                    case 404:
                        layer.msg("资源不可用", {icon: 5});
                        break;
                    default:
                        layer.msg(message.message.replace(new RegExp(";","g"),"<br/>"),{icon: 5});
                        ;
                }
            },
            success: function (data) {
                if (url.indexOf("save") > -1 || url.indexOf("update") > -1) {
                    layer.closeAll("loading");
                }
                if (data != null && data.code != null && data.code.indexOf("4") == 0) {
                    switch (data.code) {
                        case "401":
                            layer.msg("登录超时", {icon: 5});
                            window.location.href = "/logout";
                            break;
                        case "403":
                            layer.msg("部分权限不足", {icon: 5});
                            break;
                        default:
                            ;
                    }
                } else {
                    return callback;
                }
            }
        });
    };
});
jQuery.http = {
    $post: function (url, data, callback, type) {
        if (url.indexOf("save") > -1 || url.indexOf("update") > -1) {
            layer.load(1, {
                shade: [0.1, '#fff'], //0.1透明度的白色背景
            })
        }
        if (jQuery.isFunction(data)) {
            type = type || callback;
            callback = data;
            data = undefined;
        }
        return jQuery.ajax({
            url: url,
            type: "post",
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data),
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                layer.closeAll("loading");
                var message = XMLHttpRequest.responseJSON;
                switch (XMLHttpRequest.status) {
                    case 401:
                        layer.msg("登录超时", {icon: 5});
                        window.location.href = "/logout";
                        break;
                    case 403:
                        layer.msg("部分权限不足", {icon: 5});
                        break;
                    case 404:
                        layer.msg("资源不可用", {icon: 5});
                        break;
                    default:
                        layer.msg(message.message.replace(new RegExp(";","g"),"<br/>"),{icon: 5});
                        ;
                }
            },
            success: function (data) {
                layer.closeAll("loading");
                if (data != null && data.code != null && data.code.indexOf("4") == 0) {
                    switch (data.code) {
                        case "401":
                            layer.msg("登录超时", {icon: 5});
                            window.location.href = "/logout";
                            break;
                        case "403":
                            layer.msg("部分权限不足", {icon: 5});
                            break;
                        default:
                            ;
                    }
                } else {
                    return callback;
                }
            }
        });
    }
};
jQuery.getUrlParam = function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null)
        context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
};
