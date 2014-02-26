/*
*
*++++++++++++++处理划线展示模块
*
*/
/*画线*/
function lineFunc(){
	var _divs = $(".story_show div");
	for(var i=0; i<_divs.length; i++){
		var parTop = parseInt(_divs.eq(i).css('top'));
		var parLeft = parseInt(_divs.eq(i).css('left'));
		var nextArray = _divs.eq(i).attr('next').split(',');
		for(var j=0;j<nextArray.length;j++){
			if(nextArray[j]!=''){
				var curDiv = $('#'+nextArray[j]);
				var curTop = parseInt(curDiv.css('top'));
				var curleft = parseInt(curDiv.css('left'));
				makeLine(_divs.eq(i).attr('id')+'_'+curDiv.attr('id'),parLeft+60,parTop+73,curleft+60,curTop+15,'stroke:red;stroke-width:1')
			}
			
		}
	};
}

// 移动线
var flag = false; //是否移动线
var moveDiv = null;  //若移动，则代表当前移动的元素
var ePoint=[];//鼠标点击位置
var divPoint=[];//div位置
$('.story_show').on('mousedown','div',function(e){
	if(e.which == 1){  //鼠标左键按下移动的情况
		flag = true;
		moveDiv=$(this);
		ePoint[0]=e.pageX;
		ePoint[1]=e.pageY;
		divPoint[0]=parseInt(moveDiv.css('left'));
		divPoint[1]=parseInt(moveDiv.css('top'));
	}
	return false;
});
$(document).on('mousemove','*',function(e){
	if(flag){
		var positionX = e.pageX-(ePoint[0]-divPoint[0]);
		var positionY = e.pageY-(ePoint[1]-divPoint[1]);  //鼠标在元素的位置
		moveDiv.css({'left':positionX,'top':positionY});
		var thisParent = moveDiv.attr('parent');
		var thisChild = moveDiv.attr('next').split(',');
		var thisId = moveDiv.attr('id');
		var thisTop = parseInt(moveDiv.css('top'));
		var thisLeft = parseInt(moveDiv.css('left'));
		if(thisParent){
			var thisParTop = parseInt($('#'+thisParent).css('top'));
			var thisParLeft = parseInt($('#'+thisParent).css('left'));
			var thisParlineId = thisParent+'_'+thisId;
			var thisParLine = $('#'+thisParlineId);
			thisParLine.attr('x1',thisParLeft+60);
			thisParLine.attr('y1',thisParTop+73);
			thisParLine.attr('x2',thisLeft+60);
			thisParLine.attr('y2',thisTop+15);
		}
		if(thisChild){
			for(var i=0;i<thisChild.length; i++){
				var thisChildTop = parseInt($('#'+thisChild[i]).css('top'));
				var thisChildLeft = parseInt($('#'+thisChild[i]).css('left'));
				var thisChildLine = $('#'+thisId+'_'+thisChild[i]);
				thisChildLine.attr('x1',thisLeft+60);
				thisChildLine.attr('y1',thisTop+73);
				thisChildLine.attr('x2',thisChildLeft+60);
				thisChildLine.attr('y2',thisChildTop+15);
			}
		}

	}
	return false;
});
$(document).on('mouseup','*',function(){
	flag = false;
	moveDiv =null;
	ePoint=[];
	divPoint=[]
	return false;
});


/*划线模块*/
function makeLine(id,x1,y1,x2,y2,style) {
	var style = style || 'stroke:red;stroke-width:1'
	if(isNaN(x1)||isNaN(x2)||isNaN(y1)||isNaN(y2)) return false; //若坐标不为数字则跳出
    var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
    lineWrapper = $('#linewrapper');
    newLine.setAttribute('id',id);
    newLine.setAttribute('x1',x1);
    newLine.setAttribute('y1',y1);
    newLine.setAttribute('x2',x2);
    newLine.setAttribute('y2',y2);
    newLine.setAttribute('style',style);
    lineWrapper.append(newLine);
};

