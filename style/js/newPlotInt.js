/*
*
*++++++++++++++处理剧情初始化化模块
*
*/
function plotInt(){

	for(var i=0;i<intPlotData.length;i++){ //遍历初始化剧情数据，添加初始化剧情div
		$('.story_int ul>em').before(intPlotDiv(intPlotData[i].join()));
	}

	intPlotResizeWidth();//调节外围div大小

}

/* 创建初始化剧情LI */
function intPlotDiv(divData){
	var _liEle = $("<li><span></span><a class='story_int_modify' href='#'></a><a class='story_int_delete' href='#'></a></li>");
	if((divData.split(','))[4]){
		_liEle.find('span').text((divData.split(','))[1]+(divData.split(','))[4]); //若名字存在，则实现为npcid+名字
	}else{
		_liEle.find('span').text((divData.split(','))[1]);
	}
	_liEle.attr('data',divData);
	return _liEle;
};

/*调节初始化剧情外围div宽度调整*/
function intPlotResizeWidth(){
	var intTotalLi = $('.story_int ul li');
	var _width=0;
	var _dis = 30+25; //li padding+margin值
	for(var i=0;i<intTotalLi.length;i++){
		_width +=intTotalLi.eq(i).width()+_dis
	}
	$('.story_int ul').css('width',_width);
}


/* 显示剧情初始化框 */
var intPlotFlag = null; //intPlotFlag为null的时候，表示添加新的初始化剧情，若不为null的时候，为修改原有初始化剧情
var intPlotInputValue = []; //存放添加剧情初始化文本框内容
$(".story_int_add").click(function(){
	$(".story_int_table").show();
	intPlotInputValue = [];
	intPlotFlag = null;
	return false;
});

/* 关闭剧情初始化添加框 */
$(".story_int_table_cancel").click(function(){
	$(".story_int_table li input").val('') //清空文本框
	$(".story_int_table li input").eq(0).val('剧情初始化');
	$(".story_int_table").hide();
	intPlotInputValue = [];
	intPlotFlag = null
	return false;
});

/* 提交初始化剧情框 */
$('.story_int_table_submit').click(function(){

	var intPlotEditInput = $('.story_int_table ul li input')
	for(var i=0;i<intPlotEditInput.length;i++){
		intPlotInputValue[i] = intPlotEditInput.eq(i).val();
	}

	intPlotInputValue[intPlotInputValue.length-1]=intPlotInputValue[intPlotInputValue.length-1]+'\n'; //最后一个加上换行

	if(intPlotFlag){//表示修改
		intPlotFlag.attr('data',intPlotInputValue);
		if(intPlotInputValue[4]){
			intPlotFlag.find('span').text(intPlotInputValue[1]+intPlotInputValue[4]);
		}else{
			intPlotFlag.find('span').text(intPlotInputValue[1]);
		}
	}else{//表示新添
		$('.story_int ul>em').before(intPlotDiv(intPlotInputValue.join(',')));
	}

	intPlotResizeWidth();
	$(".story_int_table_cancel").click()
	intPlotInputValue = [];
	intPlotFlag = null

});

/* 修改初始化剧情 */
$('.story_int ul').on('click','a.story_int_modify',function(){

	intPlotFlag = $(this).parent('li');
	intPlotInputValue = $(this).parent('li').attr('data').split(',');

	$(".story_int_table").show();
	
	var tableBtnInput = $('.story_int_table ul li input');
	for(var i=0;i<tableBtnInput.length;i++){
		tableBtnInput.eq(i).val(intPlotInputValue[i])
	}
	
	return false;

});

/* 删除初始化剧情 */
$('.story_int ul').on('click',"li>a.story_int_delete",function(){
	$(this).parent('li').remove();
	return false;
});