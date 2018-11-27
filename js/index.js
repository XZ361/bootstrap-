$(function(){
	/*轮播图*/
	banner();

	/*初始化移动端标签页宽度*/
	initMobileTab();
	/*初始化工具提示*/
	$("[data-toggle='tooltip']").tooltip();

});

// 轮播图实现函数
var banner=function(){
	/*动态创建轮播图*/
	/*1.获取轮播图数据 ajax*/
	/*2.根据熟虑动态渲染 根据当前设备 屏幕宽度判断*/
	// 用来做数据缓存
	var getData=function(callback){
		/*如果缓存数据存在就直接执行渲染，否则就执行ajax请求*/
		if(window.data){
			callback && callback(window.data);
		}else{
			$.ajax({
				type:'get',
				// 由于js是在页面中被使用故加一层相对路径js
				url:'js/data.json',
				// 强制转换后台返回的数据为json对象 
				dataType:'json',
				// 传送的参数为空
				data:'',
				success:function(data){
					// 当第一次请求数据成功时，就可以将请就到额数据缓存好，以便备用并防止ajax重复向后台发起请求
					window.data=data;
					callback && callback(window.data);
				}

			});	
		}
	}
	var render=function(){
		getData(function(data){
			var isMobile=$(window).width()<768 ? true:false;
				/*2.1准备数据*/
				/*2.2把数据转换成HTML格式的字符串（动态创建元素，字符串拼接，模板引擎-artTemplate）*/
				/*使用模板引擎 ：将html的静态内容变成动态的*/
				/*发现两个地方需要动态渲染
				*《1》：点容器《2》轮播图容器
				*新建模板
				*开始使用
				*
				*/
				var pointHtml=template('pointTemplate',{list:data});
				var imageHtml=template('imageTemplate',{list:data,isMobile:isMobile});
				// 2.3把字符渲染到页面当中
				$('.carousel-indicators').html(pointHtml);
				$('.carousel-inner').html(imageHtml);
		})
		
	}
	
	// 2.3测试功能
	$(window).on('resize',function(){
		render();
		// 通过js主动触发事件
	}).trigger('resize');
	// 2.4移动端手势切换
	var startX=0;
	var distanceX=0;
	var isMove=false;
	$('.wjs_banner').on('touchstart',function(e){
		startX=e.originalEvent.touches[0].clientX;
	}).on('touchmove',function(e){
		moveX=e.originalEvent.touches[0].clientX;
		distanceX=moveX-startX;
		isMove=true;
		
	}).on('touchend',function(e){
		// 手势事件的条件
		// 滑动距离满足大于50px且有过滑动
		if(isMove&&Math.abs(distanceX)>50){
			// 左滑手势
			if(distanceX<0){
				$('.carousel').carousel('next');
			}
			// 右滑手势
			else{
				$('.carousel').carousel('prev');

			}

		}
		startX=0;
		moveX=0;
		isMove=false;
	});
}

var initMobileTab=function(){
	// 1.解决标签页在移动端下的换行问题
	var $navTabs=$('.wjs_product .nav-tabs');
	var width=0;
	$navTabs.find('li').each(function(i,item){
		var $currLi=$(this);//$(item)
		var liWidth=$currLi.outerWidth(true);
		width+=liWidth;
	})
	console.log(width);
	$navTabs.width(width);
	// 2.修改结构使之变成区域滑动的结构
	// 通过加一个父容器实现
	// 3、自己实现滑动效果或者使用iscroll插件
	 new IScroll($('.nav-tabs-parent')[0],{
		scrollX:true,
		scrollY:false,
		click:true
	})
}
