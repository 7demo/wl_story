
	//height for main
	function docHeight(){
		var wHeight = $('.editor').height();
		var tableHeight = $(".ctn_table").height()+60;

		$('.editor').css("top",-tableHeight)
		// if(wHeight>tableHeight){
		// 	$(".content").css("height",wHeight);
		// }else{
		// 	$(".content").css("height",tableHeight);
		// }
		
	}
	docHeight()

	//liem
	var emEle = $(".city em");
	for(var i=0; i<emEle.length;i++){
		var emUlEle = emEle.eq(i).parent('span').siblings('ul');
		if(emUlEle.length == 0){
			emEle.eq(i).addClass('emDir')
		}else{
			emEle.eq(i).removeClass('emDir')
		}
	}


	// drag
	var ulEle = $(".city>ul");
	var liEle = ulEle.find("li.liDrag");
	var eleDrag=null;
	ulEle.find("li").attr("draggable","true");
	ulEle.on("dragstart","li.liDrag",function(e){
		eleDrag = e.target;
		return true;
	})
	ulEle.on("dragend","li.liDrag",function(e){
		eleDrag = null;
		return false;
	});
	ulEle.on("dragover","li.liDrag",function(e){
		e.preventDefault();
		return true;
	});
	ulEle.on("drop","li.liDrag",function(e){
		var targetIsUl = $(this).children('ul');
		if(eleDrag && targetIsUl){
			if(targetIsUl.length==0){
				var targetUl = $(this).append("<ul></ul>");
				targetUl.find("ul").append(eleDrag)
			}else{
				targetIsUl.eq(targetIsUl.length-1).append(eleDrag)
			}
			return false;
		}
		return false;
	});


	//左边文件拖动
	ulEle.on("dragstart","li.liNoDrag",function(e){
		eleDrag = e.target;
		return true;
	})
	ulEle.on("dragend","li.liNoDrag",function(e){
		eleDrag = null;
			return false;
	})
	ulEle.on("dragover","li.liNoDrag",function(e){
		e.preventDefault();
			return true;
	})


	//文件夹折叠
	$(".city").on("click","li.liDrag>span",function(){
		$(this).siblings().slideToggle();
		$(this).find("em").toggleClass('emDir');
		return false;
	});


	// 点击添加关键词
	var focusEle = null;
	$(".editor_table").on("focus","input,textarea",function(e){
		focusEle = $(this);
	});
	$(".keywords").on("click",'li',function(){
		var liText = $(this).text();
		if(focusEle){
			focusEle.insertContent(liText);
		}
		return false;
	});

	// 编辑页面的开关
	function editorOpen(){
		$(".editor").animate({"right": 0}, 500);
		$(".editor_tips").animate({"right": "15px"}, 500);
	}


	$(".editor_close").click(function(){
		var animateWidth = $(".editor").width()+$(".editor").width()*0.1;
		$(".editor,.editor_tips").animate({"right": -animateWidth}, 500)
	});
	$(".bread_nav a").click(function(){
		editorOpen()
		$(".editor_table input,.editor_table textarea").val('')
		$(".editor_table input[type='checkbox']").attr("checked", false);
		return false;
	});

	//搜索定位
	$("#pop_search").keyup(function() {
		var Txt = []
		var TxtIndex = [];
		var para = /\s/g
		var searchLi = $(".pop ul li");
		for(var i=0; i<searchLi.length; i++){
			Txt[i] = searchLi.eq(i).text().replace(para,"");
			searchLi.hide();
		}
		var iTxt = $(this).val();
		if(iTxt!=""){
			var o=0;
			for(var i=0; i<Txt.length; i++){
				if(Txt[i].search(iTxt)!=-1){
					searchLi.eq(i).css({"background":"#417690","color":"#fff"});
					searchLi.eq(i).show();
					TxtIndex[o] = i;
					o++;	
				}
			}
		}else{
			searchLi.show();
			$(".pop ul li").css({"background":"#fff","color":"#000"})
		}
	});
	

	$(document).on("click","*",function(){
		$(".pop").hide();
	})
	$(".pop").click(function(){
		return false;
	})
	$(".pop_ctn").on("click","li",function(){
		$(this).toggleClass('liActive').siblings().removeClass('liActive');
		return false;
	})

	$("a.directory_move").on("click",function(){
		$(".pop").show();
		return false;
	})


	
	// 处理数据

	