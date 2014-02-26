/*
*
*++++++++++++++处理剧情展示模块
*
*/
var plotDataShow //获取父级框体的plotDataShow
function plotShowFunc(){
	plotDataShow='';
	plotDataShow = window.parent.plotData //获取父级框体的plotDataShow
	insertDivFunc() //生成div
	resiz()//画布大小
	positionPlot() //div定位
	isSync()//若有延迟，加标注
	repairPosition()//矫正重合
	lineFunc() //画线

}


/* 剧情div定位 */
function positionPlot(){

	var _divs = $('.story_show div');
	var _divPar = $('.story_show');

	if(_divs.length==0) return false;  //div个数为0，跳出
	plotDivPosition(_divs.eq(0),$('.story_show'),0)  //根元素定位

	pollFunc(_divs.eq(0));

	function pollFunc(_pars){  //从父级元素通过next值查找到子元素，对子元素进行定位

		if(_pars==null) return false;  //div的长度为0 的时候，跳出
		var _next = _pars.attr('next').split(',');
		for(var i=0;i<_divs.length;i++){
			for(var k=0;k<_next.length;k++){  //next的长度
				if(_divs.eq(i).attr('id')==_next[k]){  //next[k]的值与第i个div的id相等，则确定子元素的id为
					plotDivPosition(_divs.eq(i),_pars,k,_next.length);
					pollFunc(_divs.eq(i));
				}
			}
		}
			

	}

}

/* 剧情展示div */
function plotDivPosition(thisDiv,parDiv,index,indexLength){   //分别为当前元素，父级元素，当前元素是父级元素的索引值,父级元素拥有子元素数目

	if(!parDiv) return false;  //父级元素不存在，直接跳出

	if(parDiv.attr('class') == 'story_show fn-clear'){   //当父级元素为外围元素，即当前元素为第一个div
		var _parWidth = parDiv.width();
		var _parHeight = parDiv.height();
		thisDiv.css({'top':'20px','left':_parWidth/2});
	}else{
		var _parTop = parseInt(parDiv.css('top'));   //模块固定大小为 120*60;
		var _parLeft = parseInt(parDiv.css('left'));
		thisDiv.css({'top':_parTop+100,'left':_parLeft+index*80+(index+1-indexLength)*80}) //80为120+40的一半; 
	}

}

/*判定是否延迟*/
function isSync(){

	var _divs = $('.story_show div');
	for (var i = 0; i <_divs.length; i++) {
		if((_divs.eq(i).attr('sync')).search(/延迟/)!= -1){
			_divs.eq(i).css('border','#20AEF1 solid 1px');
		}else{
			_divs.eq(i).css('border','#FB7805 solid 1px');
		}
	};

};


/* 矫正是否元素完全重合 */
function repairPosition(){
	var _divs = $(".story_show div");
	for(var i=0;i<_divs.length;i++){
		var _iTop = parseInt(_divs.eq(i).css('top'));
		var _iLeft = parseInt(_divs.eq(i).css('left'));
		for(var j=0;j<_divs.length;j++){
			if(i!=j){
				var _jTop = parseInt(_divs.eq(j).css('top'));
				var _jLeft = parseInt(_divs.eq(j).css('left'));
				if(_iTop==_jTop&&_iLeft==_jLeft){
					_divs.eq(i).css("left",_iLeft+60);
					_divs.eq(j).css("left",_jLeft-60);
				}
			}
		}

	}
}

//定义画布大小
function resiz(){
	var childDivNum = $('.story_show div');
	var pararNext = /(next)\[((\d)+(\,)?)+\]/g;
	var nexts = (plotDataShow.join(',')).match(pararNext);
	var nextCtnSize =0;
	var nextCtnSize2=0; //next内容大于2的个数
	for(var k=0;k<nexts.length;k++){
		if((nexts[k].match(/(\d)+(\,)?/g)).length>1){nextCtnSize2++};
		nextCtnSize = (nexts[k].match(/(\d)+(\,)?/g)).length>nextCtnSize?(nexts[k].match(/(\d)+(\,)?/g)).length:nextCtnSize
	}
	$('.story_show,.frame_body,#linewrapper').css({'height':childDivNum.length*100,'width':nextCtnSize*4*160})
	$(window.parent.document).find('#story_iframe').css({'height':childDivNum.length*100,'width':nextCtnSize*4*160})
}


/*生成单个div模块*/
function plotShowDiv(divId,divPar,divNext,divSync,divTitle,divCtn,divTxt){

	var _div = $('<div><span></span><em class="story_show_modify"></em><em class="story_show_delete"></em></div>');
	_div.attr('id',divId);
	_div.attr('parent',divPar);
	_div.attr('next',divNext||'');
	_div.attr('title',divTitle);
	_div.attr('sync',divSync||'');
	_div.attr('ctn',divCtn);
	_div.find('span').text(divTxt);
	return _div;

}

/*生成剧情div*/
function insertDivFunc(){
	var _sync='' //存放延迟
	for(var i=0; i<plotDataShow.length;i++){
		if(plotDataShow[i][0]=='剧情开始'){   //剧情开始行
			var _divData = [];
			_divData['id'] = '000000';
			_divData['parent'] = '';
			_divData['next'] = getNextNum(plotDataShow[i]);
			_divData['sync'] = '';
			_divData['title'] = '剧情开始';
			_divData['ctn'] = hasNext(true,plotDataShow[i]);
			_divData['txt'] = '剧情开始';
			
			_sync=''

			$('.story_show').append(plotShowDiv(_divData['id'],_divData['parent'],_divData['next'],_divData['sync'],_divData['title'],_divData['ctn'],_divData['txt']));
		}else if((plotDataShow[i][0].search(/(\d)+/))==0){    //正常剧情
			var _divData = [];
			_divData['id'] = plotDataShow[i][0];
			_divData['parent'] = ''
			_divData['next'] = getNextNum(plotDataShow[i]);
			_divData['sync'] = _sync;
			_divData['title'] = plotDataShow[i][1];
			_divData['ctn'] = hasNext(false,plotDataShow[i]);
			_divData['txt'] = plotDataShow[i][0]+plotDataShow[i][1];

			_sync=''

			$('.story_show').append(plotShowDiv(_divData['id'],_divData['parent'],_divData['next'],_divData['sync'],_divData['title'],_divData['ctn'],_divData['txt']));
		}else if((plotDataShow[i][0].search(/延迟/))!=-1){  //延迟
			_sync = plotDataShow[i][0]+' '+plotDataShow[i][1];
		}else{
			// ///////////////待处理展示数据
		}

	}

	addParentAttr(); //添加parent;

}


/*为div添加parent*/
function addParentAttr(){

	var _parent;
	var _divs = $('.story_show div');
	for(var i=1;i<_divs.length;i++){  //从第二个div开始遍历,即不会遍历root元素
		var _id = _divs.eq(i).attr('id')
		for(var k=0;k<_divs.length;k++){
			var _next = (_divs.eq(k).attr('next')).split(',');
			for(var m=0;m<_next.length;m++){
				if(_next[m]==_id){
					_divs.eq(i).attr('parent',_divs.eq(k).attr('id'));
				}
			}
		}
	};

}

/* 获取next中的数字 */
function getNextNum(data){
	var _data = data.join(',')
	var paraNext = /(next)\[((\d)+(\,)?)+\]/g;
	var nextCtn = _data.match(paraNext);
	if(nextCtn){
		return nextCtn[0].match(/(\d)+/g)
	}else{
		return '';
	}
}

/*点击修改*/
$(document).on('click','em.story_show_modify',function(){
	var _dataId = $(this).parent('div').attr('id');
	var _dataCtn = $(this).parent('div').attr('ctn');
	var _dataTitle = $(this).parent('div').attr('title');
	if($(this).parent('div').attr('next')) var _dataNext = $(this).parent('div').attr('next');
	if($(this).parent('div').attr('sync')) var _dataSync = $(this).parent('div').attr('sync');
	if($(this).parent('div').attr('parent')) var _dataParent = $(this).parent('div').attr('parent');
	
	var _parentWindow = $(window.parent.document);
	_parentWindow.find('.plot').show();
	_parentWindow.find('.plot h2').text(_dataTitle);
	_parentWindow.find('input[name=plotIndex]').val(_dataId);
	_parentWindow.find('input[name=plotCtn]').val(_dataCtn);
	_parentWindow.find('input[name=plotNext]').val(_dataNext);
	_parentWindow.find('input[name=plotParent]').val(_dataParent);
	
	if(_dataSync) _parentWindow.find('input[name=plotSync]').val(_dataSync.match(/\d+/g));
	window.parent.plotFlag = $(this).parent('div');
	window.parent._beforeParent = _dataParent;
	
	return false;

});


/* 点击删除 */
var _deleteFlag = true;
var _this=null; //删除时候 存储当前em对象

$(window.parent.document).find('#deleteYes').click(function(){

	var _id = _this.parent('div').attr('id');
	var _parId = _this.parent('div').attr('parent');
	var _sync= (_this.parent('div').attr('sync')).match(/\d+/g) || '';
	_this.parent('div').remove();
	reLine();

	console.log(_parId)
	console.log($('#'+_parId))
	console.log($('#'+_parId).attr('next'))
	if(_parId!=''){
		var _parNext = $('#'+_parId).attr('next');
		var _parNextArray = _parNext.split(',');
		for(var m=0;m<_parNextArray.length;m++){
			if(_parNextArray[m]==_id){
				_parNextArray.splice(m,1);
			}
		}
		$('#'+_parId).attr('next',_parNextArray.join(',')); //删除父div中的next
	}

	for(var i=0; i<plotDataShow.length;i++){   

		if(plotDataShow[i][0]=='剧情开始'){  //删除

			if(plotDataShow[i][1]==_id){
				plotDataShow.splice(i,1);
			}

		}else{

			if(plotDataShow[i][0]==_id){
				plotDataShow.splice(i,1);
			}

		}

		if(plotDataShow[i][0]==_parId){ //删除父节点中的对应next
			var _next = plotDataShow[i][plotDataShow[i].length-1];
			_next = _next.slice(5,-2);
			var _nextArray =_next.split(',')
			for(var k=0;k<_nextArray.length;k++){
				if(_nextArray[k]==_id){
					_nextArray.splice(k,1);
				}
			}
			plotDataShow[i][plotDataShow[i].length-1] ='next['+_nextArray.join(',')+']';
		}

	}
	

	if(_sync.length!=0){  //有延迟
		for(var i=0; i<plotDataShow.length;i++){

			if(plotDataShow[i][0]=='延迟'&&plotDataShow[i][1].match(/\d+/g)==_sync[0]){ //正则匹配是去掉换行
				plotDataShow.splice(i,1);
			}
		}

	}

	_this=null;
	$(window.parent.document).find('#deleteModule').hide();
	return false;

})

$(window.parent.document).find('#deleteNo').click(function(){
	_this=null;
	$(window.parent.document).find('#deleteModule').hide();
})

$(document).on('click','em.story_show_delete',function(){

	$(window.parent.document).find('#deleteModule').show();
	_this = $(this);

})



/*判断是否有next,返回内容*/
function hasNext(flag,data){  //flag为true的时候，为剧情开始，否则为其他行
	var newData;
	if((data.join(',')).search(/next/)!=-1){
		if(flag){
			newData = (data.slice(1,data.length-1)).join(' ');
		}else{
			newData = (data.slice(2,data.length-1)).join(' ');
		}
	}else{
		if(flag){
			newData = (data.slice(1)).join(' ');
		}else{
			newData = (data.slice(2)).join(' ');
		}
	}
	return newData;
}


/* 重新划线 */
function reLine(){

	$('#linewrapper line').remove();
	lineFunc();

}