
(function(window,$,undefined){
	window._g={
		 //ajax请求前缀
		ajaxurl:true ? "http://192.168.6.151:8080" : "http://192.168.6.91:9691/",
		//http://192.168.6.85:8090  何欢
		//保存和设置localStorage
		owner: {
			token: function(token) {
				var settings = _g.owner.settings();
				if(!!arguments.length) {
					settings.token = token;
					_g.owner.settings(settings);
				} else {
					return(settings && settings.token) || "";
				}
			},
			settings: function(settings) {
				if(!!arguments.length) {
					settings = settings || {};
					localStorage.setItem('h5_settings', JSON.stringify(settings));
				} else {
					var settingsText = localStorage.getItem('h5_settings') || "{}";
					return JSON.parse(settingsText);
				}
			}
		},
		ajax: function(url, data, callback,authLogin,indexC) {
			if(authLogin){//true
				var isLogin = false;
				if (!isLogin) {//true
					var token = _g.owner.token();
					if (token != null && token.trim() != "") {
						isLogin = true;
					}
				}
				// 登录，从APP获取登录信息
				if (!isLogin) {
					var loginData=window.Hybid.getLoginData();
					// 授权H5登录
					if (loginData != null && loginData != "") {
						// 将授权信息保存
						_g.owner.token(loginData);
						isLogin=true;
					}
				}
				// 未登录，则跳转到登录页面
				if (!isLogin && !indexC) {
					_g.jumpAppLogin()
					return false;
				}
			}
			if($.isFunction(data)) {
				callback = data;
				data = {}
			}
			$.ajax({
				type: 'POST',
				url: (url.indexOf("http") > -1 ? url : _g.ajaxurl + url),
				data:JSON.stringify(data),
                contentType: "application/json",
				timeout: 10000, //超时时间设置 ，单位毫秒
				dataType: "json",
				beforeSend: function(xhr) {
					Vue.$indicator.open({
						spinnerType: 'fading-circle'
					});
					// 设置token
					if(window.Hybid== undefined || window.Hybid==''){
						return
					}
					var token = window.Hybid.getLoginData();
					if (token != null && token.trim() != "") {
						xhr.setRequestHeader('X-Auth-Token', token);
					}
					else{
						xhr.setRequestHeader('X-Auth-Token', _g.owner.token());
					}
				},
				complete: function(XMLHttpRequest,status) {
					Vue.$indicator.close()
					if(status == "timeout" || XMLHttpRequest.status =='0') {
						mui.toast("网络有问题，请检查后再次连接")
					}
				},
				error: function(XMLHttpRequest) {
					console.log(JSON.stringify(XMLHttpRequest));
					//mui.toast(JSON.stringify(XMLHttpRequest.statusText))
				},
				success: function(fun){
					if (!fun.state && (fun.code == '0002' || fun.code == '0003')) {
						var btnArr = ['登录'];
						mui.confirm(fun.msg,"",btnArr,function(e){
							if(e.index == 0){
								_g.logoutH5();
								_g.jumpAppLogin()
							}else{
								_g.goBack()
								mui.toast('已取消')
							}
						})
						_g.logoutH5();
						return;
					}
					callback(fun);
				}
			})
		},
		GetqueryUrl: function (name) {    //解析Url  获取需要字段
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r!=null)return  decodeURI(unescape(r[2]),"utf-8"); return null;
		},
		logoutH5:function(){  //退出登录
			_g.owner.token(null);
		},
		//判断登录
		jumpAppLogin: function () {
			window.Hybid.jumpForceAppLogin()
		},
		// 由App来控制页面的后退
		goBack: function () {
			window.Hybid.onBack()
		},
		//单独返回首页
		goIndex:function(){
			window.Hybid.onBackIndex();
		},
		// 调用原生的APP文件上传
		fileUpload: function(){
			window.Hybid.fileUpload();
		},
		//分享链接
		toShare:function(url,imageShowUrl,infos){
			window.Hybid.jumpShareShopGoods(url,imageShowUrl,infos)
		},
		getShopCarCount:function(){
			_g.ajax("/h5/index/getCartCount",{},function(res){
				if(res.state == true){
					Vm.$data.countNum=res.data
				}else{
					Vm.$data.countNum=0
				}
			})
		},
		//搜索
		searchShop: function () {
			window.Hybid.searchShop();
		},
		//调用摄像头
		takePhoto: function () {
			window.Hybid.takePhoto();
		},
		//选择文件
		pickPhoto:function(){
			window.Hybid.pickPhoto();
		},
		jumpToCircleDetail: function (id) {  //跳转圈子详情
			window.Hybid.jumpToCircleDetail(id)
		},
		jumpToSmallUserCard: function (id) {  //跳转微名片
			window.Hybid.jumpToSmallUserCard(id)
		},
		//ios关闭页面
		goNextControllerWithDeleteLastController:function(){
			window.Hybid.goNextControllerWithDeleteLastController()
		}
	}
})(window,jQuery,undefined)
/*****************************************/
document.write("<script src='../../js/fastclick.js'></script>")
//document.write("<script src='../../js/vconsole.min.js'></script>")
$(function () {    //绑定class  Url_href，无需a标签
	mui('.h5_wrapper').on('tap','.Url_href',function(){
		var _href=this.getAttribute('href');
		if(_href){
			window.location.href=_href
		}
	})
	FastClick.attach(document.body);
})
//jq封装倒计时插件
$.extend($.fn,{
	fnTimeCountDown:function(nowdata){
		this.each(function(){
			var $this = $(this);
			var timeone=nowdata.getTime()/1000
			var nowd= (new Date()).getTime()/1000;
			var timeOff=false;
			if(timeone.toString().slice(0,7)==nowd.toFixed(0).toString().slice(0,7)){
				timeOff=true
			}
			var o = {
				sec: $this.find(".sec"),
				mini: $this.find(".mini"),
				hour: $this.find(".hour"),
				day: $this.find(".day"),
			};
			var f = {
				haomiao: function(n){
					if(n < 10)return "00" + n.toString();
					if(n < 100)return "0" + n.toString();
					return n.toString();
				},
				zero: function(n){
					var _n = parseInt(n, 10);//解析字符串,返回整数
					if(_n > 0){
						if(_n <= 9){
							_n = "0" + _n
						}
						return String(_n);
					}else{
						return "00";
					}
				},
				dv: function(){
					var _d = $this.data("end");
					var endDate = new Date(_d);
					var nowda= (new Date()).getTime()/1000;
					var timeGo=null;
					if(timeOff){
						timeGo=nowda
					}
					else{
						timeGo=timeone
						//mui.toast('您的时间设置不正确')
					}
					var dur = (endDate/1000 - timeGo), mss = endDate - timeGo*1000 ,pms = {
						sec: "00",
						mini: "00",
						hour: "00",
						day: "00",
					};
					if(mss > 0){
						pms.hm = f.haomiao(mss % 1000);
						pms.sec = f.zero(dur % 60);
						pms.mini = Math.floor((dur / 60)) > 0? f.zero(Math.floor((dur / 60)) % 60) : "00";
						pms.hour = Math.floor((dur / 3600)) > 0? f.zero(Math.floor((dur / 3600)) % 24) : "00";
						pms.day = Math.floor((dur / 86400)) > 0? f.zero(Math.floor((dur / 86400)) % 30) : "0";
						pms.month = Math.floor((dur / 2629744)) > 0? f.zero(Math.floor((dur / 2629744)) % 12) : "00";
						if(pms.month>=1){
							pms.day=Math.floor(pms.day)+Math.floor(pms.month*30)
						}
					}else{
						pms.day=pms.hour=pms.mini=pms.sec="00";
						$($this).hide()
						$($this).parent('.time').siblings('.pin').hide()
						$($this).parent('.time').hide()
						return false;
					}
					return pms;
				},
				datatime: function () {
					timeone++
				},
				ui: function(onOff){
					f.datatime()
					o.sec.text(f.dv().sec);
					o.mini.html(f.dv().mini);
					o.hour.html(f.dv().hour);
					o.day.html(f.dv().day);
					//setTimeout(f.ui, 1000);
				}
			};
			f.ui();
			var timer=setInterval(function () {
				f.ui();
			},1000)
		});
	}
});
