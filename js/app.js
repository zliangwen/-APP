//重新登录后调用刷新页面
function backReload(){
	window.location.reload();
}
//三个圈子初始化
function circleReload(){
	Vm.$data.items=[];
	Vm.$data.footershow=false;
	Vm.$data.pageId=1;
	Vm.$data.startLoaing=false;
	Vm.initData()
}
//关注与粉丝初始化
function followReload(){
	Vm.$data.dataList=[];
	Vm.$data.dataListOne=[];
	Vm.$data.pageId=1;
	Vm.$data.pageIds=1;
	Vm.$data.footershow1=false;
	Vm.$data.footershow2=false;
	Vm.$data.startLoaing=false;
	Vm.initAttention();
	Vm.initFuns();
}
//我收到的礼物返回重新刷新数据
function reloadGift(){
	Vm.$data.recommends=[];
	Vm.$data.listQuery.pageId=1;
	Vm.$data.shopTrue = false;
	Vm.$data.liwuTrue = true;
	Vm.$data.show = false;
	Vm.GetliwuShopList();
}
//我的商品库刷新数据
function reloadShopKu(){
	console.log(Vm)
	Vm.$data.recommends=[];
	Vm.$data.listQuery.pageId=1;
	Vm.$data.shopTrue = true;
	Vm.$data.liwuTrue = false;
	Vm.$data.show = false;

	Vm.GetShopKuList();

}
//返回购物车的数据刷新
function shopCarReload(){
	Vm.$data.recommends = [];
	Vm.$data.delectList.list= [];    
    Vm.$data.delectList.totalPrice=null;
    Vm.$data.allChecked = false;
    Vm.$data.totalPrice = 0;
	Vm.getShopCarList();
}

function androidAndIos(){
	var u = navigator.userAgent, app = navigator.appVersion;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
	var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	if (isAndroid) {
		//这个是安卓操作系统
		_g.goBack();
	}
	if (isIOS) {
	　　//这个是ios操作系统
		_g.goNextControllerWithDeleteLastController()
	}
}
