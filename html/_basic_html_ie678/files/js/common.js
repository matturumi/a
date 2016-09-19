// UTF-8
/**
 * scrollsmoothly.js
 * Copyright (c) 2008 KAZUMiX
 * http://d.hatena.ne.jp/KAZUMiX/
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(){
		var easing = 0.25;
		var interval = 20;
		var d = document;
		var targetX = 0;
		var targetY = 0;
		var targetHash = '';
		var scrolling = false;
		var splitHref = location.href.split('#');
		var currentHref_WOHash = splitHref[0];
		var incomingHash = splitHref[1];
		var prevX = null;
		var prevY = null;

		// ドキュメント読み込み完了時にinit()を実行する
		addEvent(window, 'load', init);

		// ドキュメント読み込み完了時の処理
		function init(){
				// ページ内リンクにイベントを設定する
				setOnClickHandler();
				// 外部からページ内リンク付きで呼び出された場合
				if(incomingHash){
						if(window.attachEvent && !window.opera){
								// IEの場合はちょっと待ってからスクロール
								setTimeout(function(){scrollTo(0,0);setScroll('#'+incomingHash);},50);
						}else{
								// IE以外はそのままGO
								scrollTo(0, 0);
								setScroll('#'+incomingHash);
						}
				}
		}

		// イベントを追加する関数
		function addEvent(eventTarget, eventName, func){
				if(eventTarget.addEventListener){
						// モダンブラウザ
						eventTarget.addEventListener(eventName, func, false);
				}else if(window.attachEvent){
						// IE
						eventTarget.attachEvent('on'+eventName, function(){func.apply(eventTarget);});
				}
		}
		
		function setOnClickHandler(){
				var links = d.links;
				for(var i=0; i<links.length; i++){
						// ページ内リンクならスクロールさせる
						var link = links[i];
						var splitLinkHref = link.href.split('#');
						if(splitLinkHref[1]=="estimation"){
						}else{
								if(currentHref_WOHash == splitLinkHref[0] && d.getElementById(splitLinkHref[1])){
										addEvent(link, 'click', startScroll);
								}
						}
				}
		}

		function startScroll(event){
				// リンクのデフォルト動作を殺す
				if(event){ // モダンブラウザ
						event.preventDefault();
						//alert('modern');
				}else if(window.event){ // IE
						window.event.returnValue = false;
						//alert('ie');
				}
				// thisは呼び出し元になってる
				setScroll(this.hash);
		}

		function setScroll(hash){
				// ハッシュからターゲット要素の座標をゲットする
				var targetEle = d.getElementById(hash.substr(1));
				if(!targetEle)return;
				// スクロール先座標をセットする
				var ele = targetEle
				var x = 0;
				var y = 0;
				while(ele){
						x += ele.offsetLeft;
						y += ele.offsetTop;
						ele = ele.offsetParent;
				}
				targetX = x;
				targetY = y;
				targetHash = hash;
				// スクロール停止中ならスクロール開始
				if(!scrolling){
						scrolling = true;
						scroll();
				}
		}

		function scroll(){
				var currentX = d.documentElement.scrollLeft||d.body.scrollLeft;
				var currentY = d.documentElement.scrollTop||d.body.scrollTop;
				var vx = (targetX - currentX) * easing;
				var vy = (targetY - currentY) * easing;
				var nextX = currentX + vx;
				var nextY = currentY + vy;
				if((Math.abs(vx) < 1 && Math.abs(vy) < 1)
					 || (prevX === currentX && prevY === currentY)){
						// 目標座標付近に到達していたら終了
						scrollTo(targetX, targetY);
						scrolling = false;
						location.hash = targetHash;
						prevX = prevY = null;
						return;
				}else{
						// 繰り返し
						scrollTo(parseInt(nextX), parseInt(nextY));
						prevX = currentX;
						prevY = currentY;
						var scope = this;
						setTimeout(function(){scroll.apply(scope)},interval);
				}
		}

}());

/*----------------------------------------------

jquery.cookie.js

----------------------------------------------*/

jQuery.cookie = function(name, value, options) {
		if (typeof value != 'undefined') { // name and value given, set cookie
				options = options || {};
				if (value === null) {
						value = '';
						options.expires = -1;
				}
				var expires = '';
				if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
						var date;
						if (typeof options.expires == 'number') {
								date = new Date();
								date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
						} else {
								date = options.expires;
						}
						expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
				}
				var path = options.path ? '; path=' + options.path : '';
				var domain = options.domain ? '; domain=' + options.domain : '';
				var secure = options.secure ? '; secure' : '';
				document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
		} else { // only name given, get cookie
				var cookieValue = null;
				if (document.cookie && document.cookie != '') {
						var cookies = document.cookie.split(';');
						for (var i = 0; i < cookies.length; i++) {
								var cookie = jQuery.trim(cookies[i]);
								// Does this cookie string begin with the name we want?
								if (cookie.substring(0, name.length + 1) == (name + '=')) {
										cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
										break;
								}
						}
				}
				return cookieValue;
		}
};


/*----------------------------------------------
*
* 	jBRollover 1.1
* 	since:11-02-23
*		MIT license.
* 	© 2011 Bridge Corporation Inc.
*
----------------------------------------------*/
 
(function($){
		$.fn.jBRollover = function(options) {
				
				// 初期値、オプションの初期値を設定
				var set = $.extend({
						offName : "_off",
						onName : "_on",
						preload : true,
						preloadTime : 3
				},options || {}); // optionsに値があれば上書き
				
				var self = $(this);
				
				//offName. を探すためのRegExp
				var m = new RegExp(set.offName + "\.");
				
				// ロールオーバー処理内容
				var rollover = function() {
						var img = $(this);					
						//src属性にoffName.が含まれる場合に実行
						if(img.attr("src").match(m)) {
								//src属性のoffName.をonName.に置換
								img.attr("src",img.attr("src").replace(set.offName+".", set.onName+"."));
								img.mouseout(function(){
										//マウスアウトでsrc属性のonName.をoffName.に置換
										img.attr("src",img.attr("src").replace(set.onName+".", set.offName+"."));
								})
						}
				};
				
				// セレクタで指定した要素を処理
				self.mouseover(rollover);

				//プリロード処理
				var preloadTimer = function(){
						self.each(function(i) {
								var preimg = $(this);
								if(preimg.attr("src").match(m)) {
										var img = $("<img>").attr("src",preimg.attr("src").replace(set.offName+".", set.onName+"."));
								}
						})
				};

				// preload が true の時オンマウス画像をプリロード
				if(set.preload === true) {
						setTimeout(preloadTimer, set.preloadTime*1000);
				};

				return this;
				
		};
})(jQuery);


/*
 * jQuery Form Tips 1.2.3
 * By Manuel Boy (http://www.manuelboy.de)
 * Copyright (c) 2010 Manuel Boy
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
*/
(function($){
	
	$.fn.formtips = function(options) {
	
		// handle options
		var settings = jQuery.extend({
			tippedClass: "tipped"
		}, options);
	
		return this.each(function() {
			
			// prepare input elements an textareas
			var e = $(this);
			
			// do not apply form tips to inputs of type file, radio or checkbox
			var type = $(e).attr('type');
			if(type != 'file' && type != 'checkbox' && type != 'radio') {
		
				// handle focus event
				$(e).bind('focus', function() {
					var lv = $(this).attr('title');
					if($(e).is('textarea')) {
						if($(this).text() == lv) {
							$(this).text('').removeClass(settings.tippedClass);
						}
					} else {
						if($(this).val() == lv) {
							$(this).val('').removeClass(settings.tippedClass);
						}
					}
					return false;
				});
		
				// handle blur event
				$(e).bind('blur', function() {
					var lv = $(this).attr('title');
					if($(e).is('textarea')) {
						if($(this).text() == '') {
							$(this).text(lv).addClass(settings.tippedClass);
						}
					} else {
						if($(this).val() == '') {
							$(this).val(lv).addClass(settings.tippedClass);
						}
					}
					return false;
				});
		
				// handle initial text
				var lv = $(e).attr('title');
				if($(e).is('textarea')) {
					if($(e).text() == '' || $(e).text() == $(this).attr('title')) {
						$(e).text(lv).addClass(settings.tippedClass);
					} else {
						$(e).removeClass(settings.tippedClass);
					}
				} else {
					if($(e).val() == '' || $(e).val() == $(this).attr('title')) {
						$(e).val(lv).addClass(settings.tippedClass);
					} else {
						$(e).removeClass(settings.tippedClass);
					}
				}
			
				// handle removal of default value
				$(e).parentsUntil('form').parent().submit(function() {
					var lv = $(e).attr('title');
					if($(e).is('textarea')) {
						if($(e).text() == lv) {
							$(e).text('').removeClass(settings.tippedClass);
						}
					} else {
						if($(e).val() == lv) {
							$(e).val('').removeClass(settings.tippedClass);
						}
					}
				});
			
			}
		
		});
	};

})(jQuery);


/*--------------------------------------------
* 	jBTab 1.2
* 	since:11-04-07  update:12-05-16
*		MIT license.
* 	© 2011 Bridge Corporation Inc.
*
----------------------------------------------*/
(function($){
		$.fn.jBTab = function(options) {
				var self = $(this);
				// 初期値、オプションの初期値を設定
				var set = $.extend({
						contentsBody : $("#contentsBody>div"), //内容のセレクタ
						className : "active", //タブに付けるclass名
						defaultShow : 0, //はじめに表示させる内容の番号
						cookie: false,  // cookieを使用するか否か
						expires : 7 //クッキーの保存期間
				},options || {}); // optionsに値があれば上書き

				//クッキーを使用する場合、クッキーに保存されている番号のtabを表示する
				if(set.cookie === true) {
						set.defaultShow = $.cookie('tabNum') ? set.defaultShow = $.cookie('tabNum') : set.defaultShow;
				}
				//ページ内リンクスクリプトとのコンフリクト回避のため
				//タブのhrefから#を除く
				self.find('a').attr('href', function(i, href) {
						return $(this).attr('href').replace('#', '');
				});
				//アクティブなタブにclassを付ける
				self.eq(set.defaultShow).addClass(set.className);
				//設定した番号の内容を表示
				set.contentsBody.hide().eq(set.defaultShow).show();
				// タブ処理内容
				var tab = function() {
						//タブからclassを外す
						self.removeClass(set.className);
						//クリックしたタブにclassを付けて、インデックスを取得
						var tabNum = $(this).addClass(set.className).index();
						//クッキーを使用する場合、はじめに表示させる内容の番号の変更
						if(set.cookie === true) {
								$.cookie("tabNum", null);
								$.cookie("tabNum",tabNum,{expires: set.expires,path:'/'});
								// console.log( "set.defaultShow is " + set.defaultShow );
						}
						//表示・非表示処理
						set.contentsBody.hide().eq(tabNum).show();
						return false;
				};
				// セレクタで指定した要素を処理
				self.click(tab);
				// メソッドチェーン用
				return this;
		};
})(jQuery);

/*----------------------------------------------
*
* 	jQuery ready
*
----------------------------------------------*/

$(function(){

		//javascriptがonの時はclassを取る
		$("html").removeClass("noJS");
		
		//rollover
		$("img,input:image").jBRollover({preloadTime : 5});
		
		//検索フォームヒント		
		var hint = $(".hint");
		hint.formtips();

		//labelにclickイベントをバインド
		$("#main label").each(function(i, l){
			l = $(l);
			l.bind('click', function(){
				var t = $('input[id=' + l.attr('for') + ']');
				t.checked = t.checked ? false : true;
			});
		});

});
