/*
*
*++++++++++++++剧情的添加、修改、提交
*
*/
/*编辑框显示*/
$('#stroy_keywords').on('click','li',function(){
	var liTxt = $(this).text();
	$('.plot h2').text(liTxt)
	if(liTxt=='剧情开始'){
		$('.plot').show();
		$('.plot li').show().eq(0).hide();
		$('.plot li:last').hide();
		$('.plot li').eq(-2).hide();
	}else{
		$('.plot').show();
		$('.plot li').show();

	}
	return false;
});

/*编辑框隐藏及取消*/ 
$('#plotCancel').click(function(){
	$('.plot').hide();
	$('.plot input').val('');
	$('.plot li input').css('border','#ccc solid 1px');
});

/*必填项检测,用颜色进行标识*/
$('.plot li input').blur(function(){
	var _name = $(this).attr('name');
	if(_name=='plotIndex'||_name=='plotCtn'||_name=='plotParent'){
		if($(this).val()==''){
			$(this).css('border','#EB730A solid 1px');
		}else{
			$(this).css('border','#ccc solid 1px');
		}
	}
});

/*添加剧情*/
var plotFlag = null; //当前操作是添加新剧情还是修改原有剧情
var _beforeParent=null;//之前父级元素
$('#plotSubmit').click(function(){
	var _inputIndex = $('input[name=plotIndex]').val();
	var _inputCtn = $('input[name=plotCtn]').val();
	var _inputParent = $('input[name=plotParent]').val();

	if($('.plot h2').text()=='剧情开始'){
		if(_inputCtn=='') return false;
	}else{
		if(_inputParent==''||_inputCtn==''||_inputIndex=='') return false; //若必填项没有填，则跳出
	}
	

	if(plotFlag){  //修改原有剧情
		var _modifyDivId = plotFlag.attr('id');
		var _modifyDivParent = plotFlag.attr('parent');
		for(var i=0;i<plotData.length;i++){
			if(_modifyDivId=='000000'){    //剧情开始
				if(plotData[i][0]=='剧情开始'){
					plotData[i]=(getInputData())['data']
				}
			}else{  //非剧情开始

				//新父级元素加next
				if(plotData[i][0]==_inputParent){
					var _parentNext = plotData[i][plotData[i].length-1];
					var _parentNextArray = _parentNext.match(/\d+/g)
					var _index = $.inArray(_modifyDivId,_parentNextArray);
					if(_index==-1){
						_parentNextArray[_parentNextArray.length] = _modifyDivId;
						plotData[i][plotData[i].length-1] ='next['+_parentNextArray.join(',')+']\n'
					}
				}
				if(_inputParent=='000000'){
					if(plotData[i][0]=='剧情开始'){
						var _parentNext = plotData[i][plotData[i].length-1];
						var _parentNextArray = _parentNext.match(/\d+/g)
						var _index = $.inArray(_modifyDivId,_parentNextArray);
						if(_index==-1){
							_parentNextArray[_parentNextArray.length] = _modifyDivId;
							plotData[i][plotData[i].length-1] ='next['+_parentNextArray.join(',')+']\n'
						}
					}
				}

				//删除旧父级中的next
				if(_beforeParent){
					if(_beforeParent=='000000'){
						if(plotData[i][0]=='剧情开始'){
							var _parentNext = plotData[i][plotData[i].length-1];
							var _parentNextArray = _parentNext.match(/\d+/g)
							var _index = $.inArray(_modifyDivId,_parentNextArray);
							_parentNextArray.splice(_index,1);
							if(_parentNextArray.length==0){
								plotData[i][plotData[i].length-1]='\n'
							}else{
								plotData[i][plotData[i].length-1] ='next['+_parentNextArray.join(',')+']\n'
							}
						}
					}else{
						if(plotData[i][0]==_beforeParent){
							console.log(plotData[i][0]+'BBB')
							var _parentNext = plotData[i][plotData[i].length-1];
							var _parentNextArray = _parentNext.match(/\d+/g)
							var _index = $.inArray(_modifyDivId,_parentNextArray);
							_parentNextArray.splice(_index,1);
							if(_parentNextArray.length==0){
								plotData[i][plotData[i].length-1]='\n'
							}else{
								plotData[i][plotData[i].length-1] ='next['+_parentNextArray.join(',')+']\n'
							}
						}
					}
				}

				if(plotData[i][0]==_modifyDivId){
					if((getInputData())['sync'].length!=0){
						if(plotData[i-1].length==2){ //已存在延迟
							plotData.splice(i-1,1,(getInputData())['sync']);
							plotData[i]=(getInputData())['data'];
							newDivFunc(plotFlag);
							return false;   //跳出，否则则数组则无限增长形成死循环
						}else{
							plotData.splice(i,0,(getInputData())['sync']);
							plotData[i+1]=(getInputData())['data'];
							newDivFunc(plotFlag);
							return false;   //跳出，否则则数组则无限增长形成死循环
						}
					}else{
						plotData[i]=(getInputData())['data'];
						newDivFunc(plotFlag);
					}
				}
			}


		};

		// console.log('444444')
		// modifyDiv(getInputData());
		// modifyLine();//修改画线
		$(window.frames['story_iframe'].document).find('#linewrapper').html('');
		$(window.frames['story_iframe'].document).find('div.story_show').html('');
		window.frames['story_iframe'].plotShowFunc();
		$('#storySubmit').click();
		$('#showData').click();
	}else{  //添加新剧情
		var _newData = getInputData();
		if(_newData['sync'].length!=0){ //有延迟
			var _syncData = _newData['sync'];
			plotData[plotData.length] = _syncData;
			plotData[plotData.length] = _newData['data'];

			for(var p=0;p<plotData.length;p++){  //next处理
				if(plotData[p][0]==_newData['parent']){
					if(plotData[p][plotData[p].length-1].search(/next/)!=-1){  //现有next
						var _nextContent = plotData[p][plotData[p].length-1];
						var _nextCtnTxt = _nextContent.match(/\d+?/g);
						var _flag = $.inArray(_newData['id'],_nextCtnTxt);
						if(_flag==-1){
							_nextCtnTxt[_nextCtnTxt.length] = _newData['id'];
							plotData[p][plotData[p].length-1] ='next['+_nextCtnTxt.join(',')+']\n'
						}
					}else{
						plotData[p][plotData[p].length]='next['+_newData['id']+']\n'
					}
				}
				if(plotData[p][1]==_newData['parent']){
					if(plotData[p][plotData[p].length-1].search(/next/)!=-1){  //现有next
						var _nextContent = plotData[p][plotData[p].length-1];
						var _nextCtnTxt = _nextContent.match(/\d+?/g);
						var _flag = $.inArray(_newData['id'],_nextCtnTxt);
						if(_flag==-1){
							_nextCtnTxt[_nextCtnTxt.length] = _newData['id'];
							plotData[p][plotData[p].length-1] ='next['+_nextCtnTxt.join(',')+']\n'
						}
					}else{
						plotData[p][plotData[p].length]='next['+_newData['id']+']\n'
					}
				}
			}

			var _div = $(window.parent.document).contents().find("#story_iframe")[0].contentWindow.plotShowDiv(_newData['id'],_newData['parent'],_newData['next'],_newData['sync'],_newData['title'],_newData['ctn'],_newData['txt']);
			newDivFunc(_div)
			$(window.frames['story_iframe'].document).find('.story_show').append(_div);
			modifyDiv(getInputData());
			$(window.parent.document).contents().find("#story_iframe")[0].contentWindow.reLine();
		}else{ //无延迟
			plotData[plotData.length] = _newData['data'];

			for(var p=0;p<plotData.length;p++){ //next处理
				if(plotData[p][0]==_newData['parent']){
					if(plotData[p][plotData[p].length-1].search(/next/)!=-1){  //现有next
						var _nextContent = plotData[p][plotData[p].length-1];
						var _nextCtnTxt = _nextContent.match(/\d+/g);
						var _flag = $.inArray(_newData['id'],_nextCtnTxt);
						if(_flag==-1){
							_nextCtnTxt[_nextCtnTxt.length] = _newData['id'];
							plotData[p][plotData[p].length-1] ='next['+_nextCtnTxt.join(',')+']\n'
						}
					}else{
						plotData[p][plotData[p].length]='next['+_newData['id']+']\n';
					}
				}

				if(plotData[p][0]=='剧情开始'){
					if(plotData[p][plotData[p].length-1].search(/next/)!=-1){  //现有next
						var _nextContent = plotData[p][plotData[p].length-1];
						var _nextCtnTxt = _nextContent.match(/\d+/g);
						var _flag = $.inArray(_newData['id'],_nextCtnTxt);
						if(_flag==-1){
							_nextCtnTxt[_nextCtnTxt.length] = _newData['id'];
							plotData[p][plotData[p].length-1] ='next['+_nextCtnTxt.join(',')+']\n'
						}
					}else{
						plotData[p][plotData[p].length]='next['+_newData['id']+']\n';
					}
				}

			}

			var _div = $(window.parent.document).contents().find("#story_iframe")[0].contentWindow.plotShowDiv(_newData['id'],_newData['parent'],_newData['next'],_newData['sync'],_newData['title'],_newData['ctn'],_newData['txt']);
			newDivFunc(_div)
			$(window.frames['story_iframe'].document).find('.story_show').append(_div);
			modifyDiv(getInputData());
			$(window.parent.document).contents().find("#story_iframe")[0].contentWindow.reLine();
		}

	}

	plotFlag = null;
	_beforeParent=null
	$(window.parent.document).contents().find("#story_iframe")[0].contentWindow.isSync();
	$('#plotCancel').click();

});

//修改画线问题
function modifyLine(){
	
	//
	/////////////////////浏览器崩溃问题
	//

}

//添加新剧情时候，根据parent的值确定div位置，并且在id为parent的
function newDivFunc(div){

	var _curPar = div.attr('parent');
	var _id = div.attr('id');
	var _divs = $(window.frames['story_iframe'].document).find('.story_show').find('div');
	for(var i=0;i<_divs.length;i++){
		if(_curPar==_divs.eq(i).attr('id')){
			if(_divs.eq(i).attr('next').length==0){
				_divs.eq(i).attr('next',_id);
			}else{
				var _nextFlag = true;
				var _nextCtn = (_divs.eq(i).attr('next')).split(',');
				for(var m=0;m<_nextCtn.length;m++){
					if(_nextCtn[m]==_id){
						_nextFlag = false;
					}
				}
				if(_nextFlag){
					_divs.eq(i).attr('next',_divs.eq(i).attr('next')+','+_id);
				}
			}
			var _parTop = parseInt(_divs.eq(i).css('top'));
			var _parLeft = parseInt(_divs.eq(i).css('left'));
			div.css({'top':_parTop+80,'left':_parLeft+80})
		}
	}

}


//修改div数据
function modifyDiv(data){   //参数分为当前div与获取的表单数据getInputData

	var _div = $(window.frames['story_iframe'].document).find('#'+data['id']);
	_div.attr('parent',data['parent']);
	_div.attr('next',data['next']);
	_div.attr('ctn',data['ctn']);
	_div.attr('sync',data['sync']);
	_div.attr('title',data['title']);
	_div.find('span').text(data['txt']);

}


/*获取表单数据*/
function getInputData(){

	var _inputData = [];
	var _parent;
	var _sync=[];
	var _title;
	var _next;
	var _ctn;
	var _txt;
	var _id

	if($('.plot h2').text()=='剧情开始'){ //剧情开始
		_inputData[_inputData.length] = '剧情开始';
		_inputData[_inputData.length] = $('input[name=plotCtn]').val();
		if($('input[name=plotNext]').val()!='') _inputData[_inputData.length] = 'next['+$('input[name=plotNext]').val()+']\n';
		_parent = '';
		_id='000000';
		_next = $('input[name=plotNext]').val();
		_ctn = $('input[name=plotCtn]').val();
		_txt = '剧情开始';
		_title='剧情开始'

	}else{
		if($('input[name=plotIndex]').val()!='') _inputData[_inputData.length] =  '\n'+$('input[name=plotIndex]').val();
		_inputData[_inputData.length] =  $('.plot h2').text();
		if($('input[name=plotNext]').val()!=''){ //是否之前存在延迟
			_inputData[_inputData.length] =  $('input[name=plotCtn]').val();
			_inputData[_inputData.length] = 'next['+$('input[name=plotNext]').val()+']\n';
		}else{
			_inputData[_inputData.length] =  $('input[name=plotCtn]').val()+'\n';
		}
		_parent = $('input[name=plotParent]').val();
		// if(plotFlag){

		// }
		if($('input[name=plotSync]').val()!=''){
			_sync[0] = '\n延迟';
			_sync[1] = $('input[name=plotSync]').val().match(/\d+/)+'\n';
		} 
		if($('input[name=plotNext]').val()!='') _next = $('input[name=plotNext]').val();
		_ctn = $('input[name=plotCtn]').val()
		_txt = $('.plot h2').text()+$('input[name=plotIndex]').val();
		_title=$('.plot h2').text();
		_id = $('input[name=plotIndex]').val();

	}

	if(_sync){
		var _val={
			'data':_inputData,
			'parent':_parent,
			'sync':_sync,
			'id':_id,
			'next':_next,
			'ctn':_ctn,
			'txt':_txt,
			'title':_title
		};
	}else{
		var _val={
			'data':_inputData,
			'parent':_parent,
			'id':_id,
			'next':_next,
			'ctn':_ctn,
			'txt':_txt,
			'title':_title
		};
	}
	
	return _val; 

}
