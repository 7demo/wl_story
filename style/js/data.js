/*
*
*++++++++++++++input#main的数据处理
*
*/
var intPlotData = []; //剧情初始化数据
var plotData = [];  //剧情数据
var errorData = []; //存放编辑错误数据


/*
*数据处理
*/
function dataFunc(){
	var paraLine = /(.+)+\n?/mg  //匹配每一行
	var textarearValue = $('#main').val(); //获取文本框内容
	if(textarearValue.length==0) return false; //若文本内容为空，则返回
	var textareaArray = textarearValue.match(paraLine);
	dataSeparation(textareaArray);
}

/*获取初剧情始化数据与剧情数据*/
function dataSeparation(textareaArray){

	var paraPlotInt = '剧情初始化' //剧情初始化正则，剩下的为待展示数据集合
	var paraPlotShow = /^(\d)(.+)+\n?/g //正常剧情正则
	var paraPlotStart = /剧情开始/  //剧情开始

	for(var i=0; i<textareaArray.length; i++){

		if(textareaArray[i][0]==' '){
			textareaArray[i] = textareaArray[i].slice(1)   //若每一行开始有空格，则去掉
		}
		if(textareaArray[i].search(paraPlotInt)==-1){
			plotData[plotData.length] = textareaArray[i].split(' ');  //若第I行没有找到‘剧情初始化’，则放入剧情数据
		}else{
			intPlotData[intPlotData.length] = textareaArray[i].split(' ');  //若第I行找到‘剧情初始化’，则放入剧情初始数据
		}

	};
}

/*点击数据处理按钮开始处理数据*/
$('#showData').click(function(){

	$('#story').show();

	dataFunc();//处理数据
	plotInt();//剧情初始化处理
	window.frames['story_iframe'].plotShowFunc();//剧情展示处理
})


/*提交数据*/
$(document).on('click','#storySubmit',function(){
	var intData = getIntData()
	var _resultData = intData.concat(plotData);
	var _resultVal='';

	for(var i=0;i<_resultData.length; i++){

		_resultVal +=_resultData[i].join(' ');

	}
	
	$("#main").val(_resultVal);

	$('#storyClose').click();
})
// $('#storySubmit').click(function(){



// 	var intData = getIntData()
// 	var _resultData = intData.concat(plotData);
// 	var _resultVal='';

// 	for(var i=0;i<_resultData.length; i++){

// 		_resultVal +=_resultData[i].join(' ');

// 	}
	
// 	$("#main").val(_resultVal);

// 	$('#storyClose').click();

// });

/* 获得最新剧情初始化数据 */
function getIntData(){

	var _intData = [];
	var _lis = $('.story_int li');
	for(var i=0;i<_lis.length;i++){
		_intData[_intData.length] = (_lis.eq(i).attr('data')).split(',');
	};

	return _intData;

}

/* 关闭编辑 */
$('#storyClose').click(function(){

	intPlotData = [];
	plotData = [];

	$('.story_int ul li').remove();
	$(window.frames['story_iframe'].document).find('.story_show div').remove();	
	$(window.frames['story_iframe'].document).find('#linewrapper line').remove();	

	$('#story').hide();

	return false;

});


/* 调整画布大小*/
$('#larger').click(function(){
	var iframe = $(window.frames['story_iframe'].document);
	sizeAdjust($('#story_iframe'),"+",150);
	sizeAdjust(iframe.find('.story_show'),"+",150);
	sizeAdjust(iframe.find('#linewrapper'),"+",150);
	sizeAdjust(iframe.find('.frame_body'),"+",150);

});

function sizeAdjust(div,sizeDir,sizeLength){
	var _thisWidth = div.width();
	var _thisHeight = div.height();
	if(sizeDir=='+'){
		div.css({'width':_thisWidth+sizeLength,'height':_thisHeight+sizeLength})
	}else if(sizeDir=='-'){
		div.css({'width':_thisWidth-sizeLength,'height':_thisHeight-sizeLength})
	}
	
}

$('#smaller').click(function(){
	var iframe = $(window.frames['story_iframe'].document);
	sizeAdjust($('#story_iframe'),"-",150);
	sizeAdjust(iframe.find('.story_show'),"-",150);
	sizeAdjust(iframe.find('#linewrapper'),"-",150);
	sizeAdjust(iframe.find('.frame_body'),"-",150);
});

