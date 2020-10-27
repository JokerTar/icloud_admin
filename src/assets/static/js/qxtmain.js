//left-tab-----menu
$(function(){
	var $left_tab_li = $(".qxt-tabs-tit li");
	$(".qxt-tabs > div").hide();
	$(".qxt-tabs > div.qxt-group").show();
	$left_tab_li.click(function(){
		$(this).addClass("on").siblings().removeClass("on");
		var index = $left_tab_li.index(this);
		$(".qxt-tabs > div").eq(index).show().siblings().hide();
	});	
});
//main-tab-----chat
$(function(){
	var $chat_li = $(".chat-tabs-tit li");
	$(".chat-tabs-con > div").hide();
	$(".chat-tabs-con > div.msg-wrapper").show();
	$chat_li.click(function(){
		$(this).addClass("on").siblings().removeClass("on");
		var index = $chat_li.index(this);
		$(".chat-tabs-con > div").eq(index).show().siblings().hide();
	});	
});
//J-group
$(function(){
	$("#J-chat-close").click(function(){
		$("#J-default").show();
		$("#J-chatArea").hide();
		$("#J-group").hide();
	});
	$("#J-group").click(function(){
		$(this).addClass("on");
		$("#J-default").hide();
		$("#J-chatArea").show();
		$(".chat-records").hide();
		});
	});
//
$(function(){
	//j-ss-input
	$("#j-ss-input").focus(function(){
		$(".qxt-search .ss-field").addClass("ss-field-focus");
		$(".ss-result-area").show();
	});
	$(".ss-clear").click(function(){
		$(".ss-result-area").hide();
		$(".qxt-search .ss-field").removeClass("ss-field-focus");
	});
	
	//chat-list
	$(".chat-list").hover(function(){
		$(this).find(".close").toggle();
	});
	//group-menu
	$(".group-menu h3").click(function(){
		$(this).toggleClass("title-expand").siblings(".group-menu h3").removeClass("title-expand");
		$(this).next(".secondbox").slideToggle(300).siblings(".secondbox").slideUp(500);
	});
	//switch-send-hotkey
	$(".switch-send-hotkey").on("click",function(event){
		event.stopPropagation();
		$(".switch-send-hotkey").find("i").toggleClass("active");
		$(".send-hotkey-wrapper").toggle();
	});
	$(document).click(function (event) {
		 $(".send-hotkey-wrapper").hide();
		 $(".switch-send-hotkey").find("i").removeClass("active");
	});
	//send-hotkey
	$(".send-hotkey-wrapper li").on("click",function(){
		$(this).addClass("active").siblings().removeClass("active");
	});
});
//J-records-close
$(function(){
	$(".item-history").click(function(){
		$(".chat-window").hide();
		$(".chat-records").show();
	});
	$(".chat-records #J-records-close").click(function(){
		$(".chat-window").show();
		$(".chat-records").hide();
	});

});
//J-window-close
$(function(){
	$("#J-window-close").click(function(){
		$(".qxt-wrapper").hide();
	});
	$("#J-window-min").click(function(){
		$(".qxt-wrapper").hide();
	});
	$(".qxt-session").click(function(){
		$(".qxt-wrapper").show();	
	});
});
//J-emotion
$(function(){
	$("#J-emotion").click(function(event){
		event.stopPropagation();
		$(".emotion-wrapper").toggle();
	});
	$(document).click(function (event) {
		 $(".emotion-wrapper").hide();
	});
//	$("#J-emotion").click(function(){
//		$(".emotion-wrapper").toggle();
//	});
	$("#J-emotion-close").click(function(){
		$(".emotion-wrapper").hide();
	});
});
//imggray
