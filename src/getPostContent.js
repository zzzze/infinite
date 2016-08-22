var globalVar = require("./GlobalVar.js");

var getPostContent = function (id, title){
	//postContent.style.display = "block";//
	$("#postContent").fadeIn();

	var $infoFrame = $("#infoFrame");
	var $sketch = $("#sketch");

	var height = document.documentElement.clientHeight - 50 ;
	$infoFrame.animate({height:height});
	
	//窗口尺寸改变
	$(window).resize(function() {
		if($("#postContent").css("display") !== "none"){ //如果这个框不是停靠在下方时
			$infoFrame.css("height",document.documentElement.clientHeight - globalVar.navigationBarHeight);
		}
	});
	
	//将sketch隐藏并移出显示范围，否则即使被遮盖也会有交互效果
	// setTimeout(function (){$('#sketch').css('position','fixed')},200);
	var top = $sketch.css("top");
	$sketch.css("top", parseInt(top) - 900 + "px");
	// $sketch.fadeOut();

	//折叠FilterBar,并隐藏filterBarBtn
	$("#filter").slideUp("fast",function (){
		$("#filterBarBtn").fadeOut();
	});


	var rightCtrlBar = document.getElementById("rightCtrlBar");

	//滚到顶部
	var toTop = document.getElementById("toTop");
	if(!toTop){
		toTop = document.createElement("button");
		toTop.id = "toTop";
		toTop.title = "返回顶部";
		toTop.onclick = function (){
			$infoFrame.animate({ scrollTop: 0 }, 400);
		};

		rightCtrlBar.appendChild(toTop);
	}

	var $toTop = $("#toTop");

	/*检查滚动*/
	var sTop;
	sTop = document.getElementById("infoFrame").scrollTop;
	if(sTop === 0){
		$toTop.css("display","none");
	}else{
		$toTop.css("display","block");
	}

	$infoFrame.scroll(function(){
		sTop = document.getElementById("infoFrame").scrollTop;
		if(sTop === 0){
			$toTop.fadeOut();
		}else{
			$toTop.fadeIn();
		}
	});

	//返回按钮（关闭）
	var cancel = document.getElementById("postContent_delete");
	if(!cancel){
		cancel = document.createElement("button");
		cancel.id = "postContent_delete";
		cancel.title = "关闭";
		//cancel.innerHTML = "<span class='glyphicon glyphicon-remove'></span>";
		cancel.onclick = function (){
			$infoFrame.animate({height:"100px"});
			$infoFrame.animate({ scrollTop: 0 }, 400);
			$("#postContent").fadeOut();
			//var postContent = document.getElementById("postContent");
			//postContent.style.display = "none";
			var title = document.getElementById("title");
			if (title){
				title.classList.add("title_link");     //添加标题鼠标悬浮样式
			}
			$(this).fadeOut();
			
			var top = $sketch.css("top");
			$sketch.css("top",parseInt(top) + 900 + "px"); //将sketch移回
			$sketch.fadeIn();
			$("#filterBarBtn").fadeIn();
		};
		rightCtrlBar.appendChild(cancel);
	}
	$("#postContent_delete").fadeIn();
	
	$("#loading").fadeIn("fast");
	
	if(window.XMLHttpRequest){
		XMLHTTP=new XMLHttpRequest();
	}else{
		XMLHTTP=new ActiveXObject("Microsoft.XMLHTTP");
	}

	XMLHTTP.onreadystatechange=function(){
		if(XMLHTTP.readyState==4 && XMLHTTP.status==200){
			$("#loading").fadeOut("slow");
			// var navigation_bar = document.getElementById("navigation_bar");
			var infoFrame = document.getElementById("infoFrame");
			var postContent = document.getElementById("postContent");
			if(infoFrame){
				if(postContent){
					postContent.innerHTML = JSON.parse(XMLHTTP.responseText)[id].content;
				}
			}
			// $("#postContent").css("display","none");
			// $("#postContent").fadeIn();
			
		}
	};
	XMLHTTP.open("GET","/api/getPostContent.json");
	XMLHTTP.send();
};


module.exports = getPostContent;