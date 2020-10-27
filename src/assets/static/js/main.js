//top-search
$(function(){
	$("#global-search").on("focus",function(){
		$(this).parent().addClass("state-input");
	});	
	$("#global-search").on("blur", function(){
		$(this).parent().removeClass("state-input");
	});
});
//user-right-top
$(function(){
	$(".user-name").mouseover(function(event){
		event.stopPropagation();
		$(".user-list").show();
		$(this).addClass("culon");
	});
	$(document).mouseout(function (event) {
		$(".user-list").hide();
		$(".user-name").removeClass("culon");
	});
});
//task-nav-more
$(function(){
	$(".nav-more").click(function(event){
		event.stopPropagation();
		$(".scd-nav-more-list").toggle();
	});
	 $(document).click(function (event) { $(".scd-nav-more-list").slideUp() });
	 //$(".scd-nav-more-list").click(function (event) { $(this).fadeOut(1000) }); 
});
//
$(function(){
	$(".cate-more").click(function(){
		$(".cate-more-list").slideDown();
		$(".cate-more").hide();
	});
	$(".cate-more-up").click(function(){
		$(".cate-more-list").slideUp();
		$(".cate-more").show();
	});
});
//
$(function(){
	//
	$(".item-func .handle .more-icon").click(function(){
		$(".more-menu").toggle();
	});
	$(".item-func .replies-btn").click(function(){
		$(".reply-head-tit").toggle();
		$(".reply-txtbox").hide();
		//$(".reply-detail").toggle();
	});
	$(".item-func .aj-Reply").click(function(){
		$(".reply-txtbox").toggle();
		$(".reply-head-tit").hide();
		//$(".reply-detail").toggle();
	});

});

//advance-search
$(function(){
	$(".btn-query").on("click",function(event){
		event.stopPropagation();
		$(".m-select-bd").slideToggle();
	});
});

//
$(window).scroll(function(){ 
varscroll = parseInt($(document).scrollTop());
 if(varscroll >= 100 || screen.width <= 768){
 $('.t-edit-btn').addClass('featurebg');
 $('.m-head-btn').addClass('mbtnbg');
 }else{
 $('.t-edit-btn').removeClass('featurebg');
  $('.m-head-btn').removeClass('mbtnbg');
 }
});

function refreshMenu(){
    $(".menu-tit").unbind();
    $(".menu-tit").click(function(){
        $(this).toggleClass("currentM").siblings(".menu-tit").removeClass("currentM");
        $(this).next(".second-box").slideToggle(300).siblings(".second-box").slideUp(500);
    });
    currentMenu();
}

function currentMenu(){
    var href = window.location.pathname;
    $("a[href='"+href+"']").addClass("current");
    $("a[href='"+href+"']").parent().parent().prev().addClass("currentM");
    $("a[href='"+href+"']").parent().parent().prev().next(".second-box").slideToggle(300).siblings(".second-box").slideUp(500);
}




//apps
$(function(){
	$(".AppsMenu").click(function(){
		$(this).toggleClass("currentM").siblings(".AppsMenu").removeClass("currentM");
		$(this).next(".apps-con").slideToggle(300).siblings(".apps-con").slideUp(500);
		$(this).next(".apps-con").children(":first-child").find("a").addClass("current");
	});
});
//more-option-btn
$(function(){
	$(".showbtn").on("click",function(){
		if($(".showbtn").text()=="展开"){
			$(".rows-showmore").slideDown();
			$(this).addClass("hidebtn");
			$(".showbtn").text("收起");
		}else{
			$(".rows-showmore").slideUp();
			$(this).removeClass("hidebtn");
			$(".showbtn").text("展开");
		}
	});
});
//checked-box
// $(function(){
// 	$(".mn-checkbox-item").click(function() {
// 		if($(this).attr("class")==("mn-checkbox-item")){
// 			$(this).addClass("mn-selected");
// 		}else{
// 			$(this).removeClass("mn-selected");
// 		};
// 	});
// });
//customers-follow
$(function(){
	$(".customers-follow").addClass("customers-nofollow").click(function() {
		if($(this).attr("class")==("customers-follow customers-nofollow")){
			$(this).toggleClass("customers-nofollow").addClass("customers-following");
			$(this).attr("title","取消关注");
		}else{
			$(this).addClass("customers-nofollow").removeClass("customers-following");
			$(this).attr("title","关注");
		};
	});
});
//follow-switch
$(function(){
	$(".follow-switch").addClass("nofollow").click(function() {
		if($(this).attr("class")==("follow-switch nofollow")){
			$(this).toggleClass("nofollow").addClass("following");
			$(this).text("已关注");
		}else{
			$(this).addClass("nofollow").removeClass("following");
			$(this).text("关注");
		};
	});
});
//info-edit
$(function(){
	$(".baseinfo-bd-edit").hide();
	$("#info-save").hide();
	$("#info-edit").click(function(){
		$(".baseinfo-bd-edit").show();
		$(".baseinfo-bd-area").hide();
		$("#info-save").show();
		$("#info-edit").hide();
	});
	$("#info-save").click(function(){
		$(".baseinfo-bd-edit").hide();
		$(".baseinfo-bd-area").show();
		$("#info-save").hide();
		$("#info-edit").show();
	});
});

//addtab-info-show
$(function(){
	$(".addtab-show").on("click",function(){
		if($(".addtab-show").text()=="收起"){
			$(".mod-info-edbox").slideUp();
			$(this).addClass("addtab-hide");
			$(".addtab-show").text("展开");
		}else{
			$(".mod-info-edbox").slideDown();
			$(this).removeClass("addtab-hide");
			$(".addtab-show").text("收起");
		}
		
	});
});



//toTop
$(function(){
	$("#to-top").hide();
	$(function(){
		$(window).scroll(function(){
			if ($(window).scrollTop()>30){
				$("#to-top").fadeIn();
			}else{
				$("#to-top").fadeOut();
			}
		});
		$("#to-top").click(function(){
			$('body,html').animate({scrollTop:0},1000);
			return false;
		});
	});
});

//sidebar-fixed
$.fn.smartFloat = function() {
 var position = function(element) {
  var top = element.position().top, pos = element.css("position");
  $(window).scroll(function() {
   var scrolls = $(this).scrollTop();
   if (scrolls > top) {
    if (window.XMLHttpRequest) {
     element.css({
      position: "fixed",
      top: 0
     }); 
    } else {
     element.css({
      top: scrolls
     }); 
    }
   }else {
    element.css({
     position: pos,
     top: top
    }); 
   }
  });
 };
 return $(this).each(function() {
  position($(this));      
 });
};

//
$(function(){
if(!placeholderSupport()){   // placeholder
    $('[placeholder]').focus(function() {
        var input = $(this);
        if (input.val() == input.attr('placeholder')) {
            input.val('');
            input.removeClass('placeholder');
        }
    }).blur(function() {
        var input = $(this);
        if (input.val() == '' || input.val() == input.attr('placeholder')) {
            input.addClass('placeholder');
            input.val(input.attr('placeholder'));
        }
    }).blur();
};
})
function placeholderSupport() {
    return 'placeholder' in document.createElement('input');
}
//dateTable-resizableColumns
$(function () {
    $(".mod-datatable").resizableColumns({
        store: store
    });
});
//top-wechat
$(function(){
    $(".t_wei").mouseover(function(event){
        event.stopPropagation();
        $("#wechat-pop").show();
    });
    $(document).mouseout(function (event) {
        $("#wechat-pop").hide();
    });
});

// $(function () {
//     history.pushState(null, null, document.URL);
//     window.addEventListener('popstate', function () {
//         history.pushState(null, null, document.URL);
//     });
// });