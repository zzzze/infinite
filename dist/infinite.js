/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict"; //严格模式

	var AttractPoint = __webpack_require__(1);
	var globalVar = __webpack_require__(5);
	var VisualObject = __webpack_require__(6);
	var Particle = __webpack_require__(4);
	var ButtonPlus = __webpack_require__(7);
	var FilterButton = __webpack_require__(9);
	__webpack_require__(10);

	var sketch = function (p){
		globalVar.width = Math.max(document.documentElement.clientWidth,960);
		globalVar.height = Math.max(document.documentElement.clientHeight,600);
		globalVar.pp = p;
		var nextPage,
			perPage;
		p.preload = function () {
			try{
				p.soundFormats('wav', 'ogg');
				globalVar.SOUNDFILE = p.loadSound('sound/water2.wav');
			}catch(e){
				console.log(e.message);      //貌似ie不支持soundformats方法
			}

			var optionL = {
				"p":p,
				"position" : new p5.Vector(globalVar.width / 2 - 250,globalVar.height * 0.6),
				"strength" : 0.1,
				"vortex" : true
			};
			var optionR = {
				"p":p,
				"position" : new p5.Vector(globalVar.width / 2 + 250,globalVar.height * 0.6),
				"strength" : 0.1,
				"clockwise" : true,
				"vortex" : true
			};
			globalVar.attractPtL = new AttractPoint(optionL);
			globalVar.attractPtR = new AttractPoint(optionR);
			
			nextPage = $("#nextPage");
			perPage = $("#perPage");

		};
		p.setup = function (){
			p.createCanvas(globalVar.width, globalVar.height);
			p.canvas.id = "infinite";
			p.canvas.innerHTML = "您的浏览器不支持Canvas标签！"
			globalVar.displayArray.backgroundBall = [];
			for(var i = 0; i < 100; i++){
				var size = Math.random()*20 + 15;
				var optionsVO = {
					position : new p5.Vector((Math.random() * p.width - 100) + 50,(Math.random() * p.height - 60) + 30),
					width : size,
					height : size,
					p : globalVar.pp,
					fillCol : globalVar.pp.color(200,200,200,50)
				};
				var options = {
					visualObject : new VisualObject(optionsVO),
					p : globalVar.pp
				};
				globalVar.displayArray.backgroundBall.push(new Particle(options));
			}
		};

		p.draw = function (){
			p.background(255);
			// globalVar.transTarget.totalPage = 3;
			// globalVar.attractPtL.display();
			// globalVar.attractPtR.display();
			if (globalVar.alignState && globalVar.translate.currentPage < globalVar.transTarget.totalPage - 1){
				nextPage.fadeIn();
			}else{
				nextPage.fadeOut();
			}
			if (globalVar.alignState && globalVar.translate.currentPage > 0){
				perPage.fadeIn();
			}else{
				perPage.fadeOut();
			}
			for(var objType in globalVar.displayArray){
				if (objType === "ButtonParticle"){     
					if (ButtonPlus.prototype.hoverObjCount > 0){    //假如没有button处于hover/click状态，则不进行排序，减少计算次数
						resortButtonParticle(globalVar.displayArray);   //重新排序控制绘图顺序
					}
					ButtonPlus.pushMatrix(globalVar.pp);
					globalVar.translate.x += (globalVar.transTarget.x - globalVar.translate.x) * 0.2;
					globalVar.translate.y += (globalVar.transTarget.y - globalVar.translate.y) * 0.2;
					ButtonPlus.translate(globalVar.translate.x, globalVar.translate.y, globalVar.pp);
				}

				for(var i = 0, length = globalVar.displayArray[objType].length;i < length;i++){
					globalVar.displayArray[objType][i].display();
				}

				if (objType === "ButtonParticle") {
					ButtonPlus.popMatrix(globalVar.pp);
				}
			}
		};	
	};

	new p5(sketch,'sketch');

	var doc = document;
	setTimeout(resizeCanvas,0);    //延迟执行，不然canvas的width跟heigth的值为0；

	function resizeCanvas(){       //调整canvas的大小与位置
	    var sketch = doc.getElementById("sketch");
		globalVar.width = Math.max(doc.documentElement.clientWidth ,960);
	    globalVar.height = Math.max(doc.documentElement.clientHeight ,600);
	    var left,top;
	    globalVar.pp.resizeCanvas(globalVar.width, globalVar.height);
	    if (doc.documentElement.clientWidth  < 960){
	        left = (doc.documentElement.clientWidth - globalVar.width) / 2;
	    }else{
	        left = (globalVar.width - doc.documentElement.clientWidth) / 2;
	    }
	    if (doc.documentElement.clientHeight - 50  < 600){
	        top = (doc.documentElement.clientHeight + 50 - globalVar.height) / 2;
	    }else{
	        top = (globalVar.height - doc.documentElement.clientHeight + 50) / 2;
	    }
		
		if (sketch.style.top < 0){   //5.23修复bug.表现为当窗口resize时,sketch会重新定位,如果之前sketch被移到上部的话,会被移回
			sketch.style.top = sketch.style.top + top + "px";
		} 
	    sketch.style.left = left + "px";
	    
		
		/**
		 * resize后button自适应位置
		 */
		if (globalVar.displayArray.ButtonParticle !== undefined){     //假如画面中没有ButtonParticle，则不运行
			var len = globalVar.displayArray.ButtonParticle.length;
			var w = globalVar.countPerRow * globalVar.cellSize;
			left = (globalVar.width - w) / 2 + 0.5 * globalVar.cellSize;
			if (globalVar.alignState){
				for(var k = 0; k < len; k++){
					var i = k % globalVar.countPerRow;
					var j = Math.floor(k / globalVar.countPerRow) + 2;
					globalVar.displayArray.ButtonParticle[k].attractPt.position =  new p5.Vector(i * globalVar.cellSize + left, j * globalVar.cellSize);
				}
			}else{
				globalVar.attractPtL.position.x = globalVar.width / 2 - 250;  //调整画布时,attractPtL与attractPtR也得更改位置
				globalVar.attractPtR.position.x = globalVar.width / 2 + 250;
				globalVar.attractPtL.position.y = globalVar.height * 0.6;
				globalVar.attractPtR.position.y = globalVar.height * 0.6;
			}
		}
	}

	function resizeInfoBody(){
		var infoBody = doc.getElementById("infoBody");
		if(infoBody){
			infoBody.style.left = ((doc.documentElement.clientWidth - parseInt($("#introduction").css("width")) - parseInt($("#introduction").css("padding-left")) * 2) / 2) + "px";
		}
		// console.log(doc.documentElement.clientWidth);
		//console.log($("#introduction").css("width"));
	}

	function resortButtonParticle(bp){
		/**
		 * 为displayArray.ButtonParticle重新排序
		 */
		var newList = [],
			selectObj = [];
		for(var i = 0, len = bp.ButtonParticle.length; i < len; i++){
			if(bp.ButtonParticle[i].visualObject.pState === "mouseOut"){
				newList.push(bp.ButtonParticle[i]);
			}else{
				selectObj.push(bp.ButtonParticle[i]);
			}
		}
		if(selectObj.length !== 0){
			newList = newList.concat(selectObj);
		}
		bp.ButtonParticle = newList;
	}

	$(doc).ready(function(){
		doc.body.style.overflow = 'hidden';
	    var getInfo = __webpack_require__(14);
		//默认获取用户
		getInfo("posts","special_invitation");
		
		$("body").click(function (e){              //事件委托
			if ($(e.target).is("#getUsers") || $(e.target).is("#getUsers div")){      //相当于刷新，所有很多状态要重置
				// ButtonPlus.stateReset();    //状态重置
				// globalVar.alignState = false;    //状态重置

				// var doc = document;                             ////重置infoFrame
				// var infoFrame = doc.getElementById("infoFrame");
				// if(infoFrame){
				// 	infoFrame.style.visibility = "hidden";
				// }

				// getInfo("users","special_invitation");
			}else if ($(e.target).is("#getPosts") || $(e.target).is("#getPosts div")){      //相当于刷新，所有很多状态要重置
				ButtonPlus.stateReset();    //状态重置
				globalVar.alignState = false;    //状态重置

				//重置infoFrame
				var infoFrame = doc.getElementById("infoFrame");
				if(infoFrame){
					infoFrame.style.visibility = "hidden";
				}

				getInfo("posts");
				ButtonPlus.prototype.hoverObjCount += 1; //由于按钮是在FliterBar上，getInfo的时候被重置了，所以+1
			}else if($(e.target).is("#align") || $(e.target).is("#align div")){
				var w = globalVar.countPerRow * globalVar.cellSize;
				var left = (globalVar.width - w) / 2 + 0.5 * globalVar.cellSize;
				
				if (globalVar.alignState){
					globalVar.transTarget.x = 0;
					globalVar.transTarget.y = 0;
					globalVar.translate.currentPage = 0;
				}
				globalVar.alignState = ~globalVar.alignState;
				var len = globalVar.displayArray.ButtonParticle.length;
				if (globalVar.alignState){
					for(var k = 0; k < len; k++){
						var i = k % globalVar.countPerRow;
						var j = Math.floor(k / globalVar.countPerRow) + 2;
						
						var options = {
							"position" : new p5.Vector(i * globalVar.cellSize + left, j * globalVar.cellSize),
							"strength" : 1.5,
							"vortex" : false
						};
						var attractPt = new AttractPoint(options);
						globalVar.displayArray.ButtonParticle[k].attractPt = attractPt;
						globalVar.displayArray.ButtonParticle[k].vortexAttract = false;
					}
				}else{
					for(var k = 0; k < len; k++){
						globalVar.displayArray.ButtonParticle[k].attractPt = globalVar.attractPtL;
						globalVar.displayArray.ButtonParticle[k].vortexAttract = true;
					}
				}
			}else if($(e.target).is("#nextPage")){
				scrollDown();
			}else if($(e.target).is("#perPage")){
				scrollUp();
			}else if($(e.target).is("#filterBarBtn")){
				$("#filter").slideDown("slow");      //下拉显示fliter
			}
		});
	});

	//窗口尺寸改变
	$(window).resize(function() {
		$("#infoFrame").css("width", $(window).width());
		resizeCanvas();   //调整canvas位置与大小
		resizeInfoBody();  //调整infoBody位置
	});


	$("#sketch").mouseenter(function (e){
		$("#filter").slideUp("fast");
	});

	// firefox
	doc.body.addEventListener("DOMMouseScroll", function(event) {
		if (globalVar.alignState){
			var direction= event.detail && (event.detail > 0 ? "mousedown" : "mouseup");
			if (direction === "mouseup"){
				scrollUp();
			}else{
				scrollDown();
			}
		}    
	});

	// chrome and ie
	doc.body.onmousewheel = function (event) {
		$("#filter").slideUp("fast");     //隐藏fliter
		console.log(globalVar.translate.currentPage,globalVar.transTarget.totalPage);
		if (globalVar.alignState){
			event = event || window.event;
			var direction = event.wheelDelta && (event.wheelDelta > 0 ? "mouseup" : "mousedown");
			if (direction === "mouseup"){
				scrollUp();
			}else{
				scrollDown();
			}
		}
	};

	function scrollUp(){
		if (globalVar.translate.currentPage > 0){
			console.log("xxx");
			globalVar.transTarget.y += globalVar.scrollDis;
			globalVar.translate.currentPage -= 1;
		}
	}
	function scrollDown(){
		if (globalVar.translate.currentPage < globalVar.transTarget.totalPage - 1){
			console.log("yyy");
			globalVar.transTarget.y -= globalVar.scrollDis;
			globalVar.translate.currentPage += 1;
		}
	}


	$("#filterT, #filterBarBtn, #btnGroup").mouseover(function (){       //让鼠标选择不中FilterBar下面的button
		if (ButtonPlus.prototype.hoverObjCount < 1){
			ButtonPlus.prototype.hoverObjCount += 1;
		}
	});

	$("#filterT, #filterBarBtn, #btnGroup").mouseout(function (){
		if (ButtonPlus.prototype.hoverObjCount > 0){
			ButtonPlus.prototype.hoverObjCount -= 1;
		}
	});

	var options_2010 = {
		id : "2010",
		text : "2010年",
		parentId : "year",
		keyword : "creationDate",
		value : "2010"
	};

	var options_2011 = {
		id : "2011",
		text : "2011年",
		parentId : "year",
		keyword : "creationDate",
		value : "2011"
	};

	var options_2012 = {
		id : "2012",
		text : "2012年",
		parentId : "year",
		keyword : "creationDate",
		value : "2012"
	};

	var options_2013 = {
		id : "2013",
		text : "2013年",
		parentId : "year",
		keyword : "creationDate",
		value : "2013"
	};

	var options_2014 = {
		id : "2014",
		text : "2014年",
		parentId : "year",
		keyword : "creationDate",
		value : "2014"
	};

	var options_2015 = {
		id : "2015",
		text : "2015年",
		parentId : "year",
		keyword : "creationDate",
		value : "2015"
	};

	var options_2016 = {
		id : "2016",
		text : "2016年",
		parentId : "year",
		keyword : "creationDate",
		value : "2016"
	};

	var options3 = {
		id : "qgbd",
		text : "情感表达",
		parentId : "type",
		keyword : "cat",
		value : "情感表达"
	};
	var options4 = {
		id : "gnyh",
		text : "功能优化",
		parentId : "type",
		keyword : "cat",
		value : "功能优化"
	};
	var options5 = {
		id : "shht",
		text : "社会话题",
		parentId : "type",
		keyword : "cat",
		value : "社会话题"
	};
	var options6 = {
		id : "clyy",
		text : "材料应用",
		parentId : "type",
		keyword : "cat",
		value : "材料应用"
	};
	var options7 = {
		id : "kjzp",
		text : "跨界作品",
		parentId : "type",
		keyword : "cat",
		value : "跨界作品"
	};

	var options8 = {
		id : "syxf",
		text : "实验先锋",
		parentId : "type",
		keyword : "cat",
		value : "实验先锋"
	};

	var options9 = {
		id : "rqyj",
		text : "人群研究",
		parentId : "type",
		keyword : "cat",
		value : "人群研究"
	};

	var options10 = {
		id : "syyy",
		text : "商业运用",
		parentId : "type",
		keyword : "cat",
		value : "商业运用"
	};

	var options11 = {
		id : "whcc",
		text : "文化传承",
		parentId : "type",
		keyword : "cat",
		value : "文化传承"
	};

	var options12 = {
		id : "qt",
		text : "其他",
		parentId : "type",
		keyword : "cat",
		value : "其他"
	};

	var options_sjcd = {
		id : "sjcd",
		text : "视觉传达",
		parentId : "major",
		keyword : "major",
		value : "视觉传达"
	};

	var options_gysj = {
		id : "gysj",
		text : "工业设计",
		parentId : "major",
		keyword : "major",
		value : "工业设计"
	};

	var options_fssj = {
		id : "fssj",
		text : "服饰设计",
		parentId : "major",
		keyword : "major",
		value : "服饰设计"
	};

	var options_jzyhy = {
		id : "jzyhy",
		text : "建筑与环艺/展示",
		parentId : "major",
		keyword : "major",
		value : "建筑与环艺(展示)"
	};

	var options_smdh = {
		id : "smdh",
		text : "数媒与动画",
		parentId : "major",
		keyword : "major",
		value : "数字多媒体与动画影像"
	};

	var options_ys = {
		id : "ys",
		text : "艺术",
		parentId : "major",
		keyword : "major",
		value : "艺术"
	};

	globalVar.filterButton.push(new FilterButton(options_2010));
	globalVar.filterButton.push(new FilterButton(options_2011));
	globalVar.filterButton.push(new FilterButton(options_2012));
	globalVar.filterButton.push(new FilterButton(options_2013));
	globalVar.filterButton.push(new FilterButton(options_2014));
	globalVar.filterButton.push(new FilterButton(options_2015));
	globalVar.filterButton.push(new FilterButton(options_2016));

	globalVar.filterButton.push(new FilterButton(options3));
	globalVar.filterButton.push(new FilterButton(options4));
	globalVar.filterButton.push(new FilterButton(options5));
	globalVar.filterButton.push(new FilterButton(options6));
	globalVar.filterButton.push(new FilterButton(options7));
	globalVar.filterButton.push(new FilterButton(options8));
	globalVar.filterButton.push(new FilterButton(options9));
	globalVar.filterButton.push(new FilterButton(options10));
	globalVar.filterButton.push(new FilterButton(options11));
	globalVar.filterButton.push(new FilterButton(options12));

	globalVar.filterButton.push(new FilterButton(options_sjcd));
	globalVar.filterButton.push(new FilterButton(options_gysj));
	globalVar.filterButton.push(new FilterButton(options_fssj));
	globalVar.filterButton.push(new FilterButton(options_jzyhy));
	globalVar.filterButton.push(new FilterButton(options_smdh));
	globalVar.filterButton.push(new FilterButton(options_ys));


	var options_cancelAll = {
		id : "bcancelAll",
		type : "cancel",
		class : "cancel",
		parentId : "cancelAll",
		title: "全部取消",
		text : ""
	};

	var options_search = {
		id : "filterBar_search",
		type : "search",
		class : "search",
		keyword : "search",
		parentId : "search",
		title: "搜索",
		text : "搜索"
	};

	globalVar.filterButton.push(new FilterButton(options_cancelAll));
	globalVar.filterButton.push(new FilterButton(options_search));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * 吸引点
	 */
	var ButtonParticle = __webpack_require__(2);

	var AttractPoint = function (options){
		this.position = options.position.copy();
		//this.strength = options.strength;
		this.p = options.p;
		this.clockwise = options.clockwise || false;
		this.vortex = options.vortex || false;
	}

	AttractPoint.prototype.attract = function (options){
		var force = this.vortex ? this.vortexAttract(options) : this.linearAttract(options);
		return force;
	}

	AttractPoint.prototype.linearAttract = function (options){
		if(options.b instanceof ButtonParticle){
			var force = p5.Vector.sub(this.position,options.b.visualObject.position);
			var dist = force.mag();
			force.normalize();
			force.mult(dist * 0.618);
			return force;
		}
	}
	AttractPoint.prototype.vortexAttract = function (options){
		if(options.b instanceof ButtonParticle){
			var force = p5.Vector.sub(this.position,options.b.visualObject.position);
			
			var ff = force.copy();
			if(this.clockwise){
				ff.rotate(-Math.PI/2);
			}else{
				ff.rotate(Math.PI/2);
			}
			ff.setMag(options.threshold);
			force.add(ff);
			force.limit(1);
			return force;
		}
	}

	AttractPoint.prototype.display = function(){
		this.p.fill(200);
		this.p.ellipse(this.position.x,this.position.y,50,50);
	}

	module.exports = AttractPoint;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var util = __webpack_require__(3);
	var Particle = __webpack_require__(4);
	var globalVar = __webpack_require__(5);

	var ButtonParticle = function (options){
		Particle.call(this,{
			visualObject : options.visualObject,   //visualObject为实现了display方法的对象
			p : options.p,
			reflect : false,
			topspeed : options.topspeed,   //控制最高速度
			acceleration : options.acceleration,
			velocity : options.velocity
		});
		//this.strength = 0.1;
		this.vortexAttract = options.vortexAttract || true;   //vortexAttract确定button是被直线吸引还是漩涡吸引
		this.xoff = Math.random() * 10;    //用于生产noise随机数
	};
	util.inheritPrototype(ButtonParticle, Particle);

	//粒子作用力
	ButtonParticle.prototype.applyForce = function(force){
		this.acceleration.add(force);
	};

	//更新粒子状态
	ButtonParticle.prototype.update = function(){
		if (this.attractPt){
			var vect = p5.Vector.sub(this.visualObject.position,this.attractPt.position);
			var len = vect.mag();
			if (this.vortexAttract){                  //两种吸引方式，两种运动模式
				var options = {
					b : this,
					threshold : 400 
				};
				var force = this.attractPt.attract(options);   //引力与漩涡力
				this.applyForce(force);
				
				var randomVect = this.velocity.copy();   //影响运行路径的随机向量防止所以的button都在运行一模一样的路径
				randomVect.mult(0.3);
				
				this.xoff += 0.01;    
				var effectAngle = (this.p.noise(this.xoff) - 0.5) * 2    //-1 to 1
				* (Math.PI / 2 * 0.1);  
				randomVect.rotate(effectAngle);
				this.velocity.add(randomVect);
				
				if (this.reflect){
					if(this.visualObject.position.x < this.visualObject.width/2 || this.visualObject.position.x > this.p.width - this.visualObject.width/2){
						this.velocity.x *= -1;
					}
					if(this.visualObject.position.y < this.visualObject.height/2 || this.visualObject.position.y > this.p.height - this.visualObject.height/2){
						this.velocity.y *= -1;
					}
				}
				//无限符号（∞）运动路径的实现
				var angle = vect.heading();
				
				if(!this.attractPt.clocklwise && len < 200 && angle < Math.PI/4 && angle > 0){
					this.attractPt = globalVar.attractPtR;
				}else{
					if(this.attractPt.clockwise && len < 200 && angle < 3 * Math.PI/4 && angle > Math.PI/2){
						this.attractPt = globalVar.attractPtL;
					}
				}
				this.velocity.add(this.acceleration);   //更新速度
				this.velocity.limit(this.topspeed);    //限制最高速度
				this.acceleration.mult(0);  //加速度清零
			}else{       //align模式的吸引方式（easing）
				vect.mult(-0.1);
				this.velocity = vect;
			}
		}
		this.visualObject.position.add(this.velocity);   //更新位置
	};

	//绘制粒子
	ButtonParticle.prototype.display = function(){
		if(this.visualObject.pState != "click" && this.visualObject.pState != "hover" && this.visualObject.pState != "press"){
			this.update();
		}
		this.visualObject.display();
	};

	module.exports = ButtonParticle;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/**
	 * 工具包
	 */
	var util = {
		//用于继承
		inheritPrototype : function (subType,superType){
			var prototype = this.object(superType.prototype);
			prototype.constructor = subType;
			subType.prototype = prototype;
		},
		object : function (o){
			function F(){}
			F.prototype = o;
			return new F();
		},
		
		//用于获取元素的绝对位置
		getElementLeft : function (element){
			var actualLeft = element.offsetLeft;
			var current = element.offsetParent;
			while (current !== null){
				actualLeft += current.offsetLeft;
				current = current.offsetParent;
			}
			return actualLeft;
		},
		getElementTop : function (element){
			var actualTop = element.offsetTop;
			var current = element.offsetParent;
			while (current !== null){
				actualTop += current.offsetTop;
				current = current.offsetParent;
			}
			return actualTop;
		},
		
		getJsonObjLength : function (jsonObj) {
			var Length = 0;
			for (var item in jsonObj) {
			Length++;
			}
			return Length;
		}
	};

	module.exports = util;







/***/ }),
/* 4 */
/***/ (function(module, exports) {

	var Particle = function (options){
		this.visualObject = options.visualObject;   //visualObject为实现了position属性与display方法的对象
		this.p = options.p;
		this.reflect = false;
		this.topspeed = options.topspeed || Math.random() * 3 + 2;  //控制最高速度
	    this.acceleration = options.acceleration ?  options.acceleration.copy() : new p5.Vector(0,0);  //加速度
	    this.velocity = options.velocity ?  options.velocity.copy() : new p5.Vector(    //速度
	        Math.random()*((Math.random()>0.5)?-0.5:0.5),
	        Math.random()-((Math.random()>0.5)?0.5:1)
	    );
	}

	//粒子作用力
	Particle.prototype.applyForce = function(force){
		this.acceleration.add(force);
	}

	//更新粒子状态
	Particle.prototype.update = function(){
		//速度
		if(!this.velocity){
			var random1 = Math.random()*((Math.random()>0.5)?-0.5:0.5);
			var random2 = Math.random()-((Math.random()>0.5)?0.5:1);
			this.velocity = new p5.Vector(random1,random2);
		}
		
		this.velocity.add(this.acceleration);
		this.acceleration.mult(0);  //加速度清零
		
		if(this.reflect){
			if(this.visualObject.position.x < this.visualObject.width/2 || this.visualObject.position.x > this.p.width - this.visualObject.width/2){
				this.velocity.x *= -1;
			}
			if(this.visualObject.position.y < this.visualObject.height/2 || this.visualObject.position.y > this.p.height - this.visualObject.height/2){
				this.velocity.y *= -1;
			}
		}else{
	        if(this.visualObject.position.x < -this.visualObject.width/2){
	            this.visualObject.position.x = this.p.width + this.visualObject.width - Math.abs(this.visualObject.position.x);
	        } 
	        if(this.visualObject.position.x > this.p.width + this.visualObject.width/2){
				this.visualObject.position.x = this.visualObject.position.x - this.p.width - this.visualObject.width;
			}
	        if(this.visualObject.position.y < -this.visualObject.height/2){
	            this.visualObject.position.y = this.p.height + this.visualObject.height - Math.abs(this.visualObject.position.y);
	        }
	        if(this.visualObject.position.y > this.p.height + this.visualObject.height/2){
				this.visualObject.position.y = this.visualObject.position.y - this.p.height - this.visualObject.height;
			}
	    }
		
		this.velocity.limit(this.topspeed);

		this.visualObject.position.add(this.velocity);
	}

	//绘制粒子
	Particle.prototype.display = function(){
		this.update();
		this.visualObject.display();
	}

	module.exports = Particle;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	/**
	 * infinite程序内部全局变量
	 */

	var GlobalVar = {
	    displayArray : [],
	    filterButton : [],
	    SOUNDFILE : null,
	    pp : null,
	    alignState : false,
	    attractPtL : null,
	    attractPtR : null,
	    countPerRow : 10,   //align模式时，每行的button数量
	    cellSize : 70,    //align模式时，button与button之间的间距
	    select : 0,
	    translate : {
	        x : 0,
	        y : 0,
	        currentPage : 0
	    },
	    transTarget : {
	        x : 0,
	        y : 0,
	        totalPage : 0
	    },
	    scrollDis : 400,
	    navigationBarHeight : 50,
	    width : 0,
	    height : 0
	};

	module.exports = GlobalVar;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	/**
	 * VisualObject
	 * by:Zzzz
	 * date:2016-05-03
	 */
	var VisualObject = function (options) {
		this.position = options.position.copy();  //位置
		this.width = options.width;  //宽度
		this.height = options.height;  //高度
		this.p = options.p;  //p5实例 
		this.fillCol = options.fillCol || this.p.color(200,200,200,100);
	}

	VisualObject.prototype.update = function(){
	}

	//根据不同的状态绘制Button
	VisualObject.prototype.display = function () {
		this.update();
		this.drawGeometry();
	}

	// 绘制几何图形
	VisualObject.prototype.drawGeometry = function () {
		this.strokeCol ? this.p.stroke(this.strokeCol) : this.p.noStroke();
		this.p.fill(this.fillCol);
		this.p.push();
		this.p.translate(this.position.x, this.position.y);
		this.p.ellipse(0, 0, this.width, this.height);
		this.p.pop();
	}


	module.exports = VisualObject;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/*
	基于p5.js,Button
	by:Zzzz
	date:2016-03-03
	*/
	var Button = __webpack_require__(8);
	var util = __webpack_require__(3);

	function ButtonPlus(options) {
		Button.call(this, options);
		this.breath = false;  //是否开启呼吸效果
		this.breathState = false;  //呼吸状态
		this.w = options.width;  //原始宽度数据备份
		this.h = options.height;  //原始高度数据备份
		this.clickTimeline = 0;   //On状态的时间轴
		this.geometryType = "circle";
		this.maxWidth = 100;
		this.filtered = false;   //用于过滤
		
		var translateX = this.constructor.prototype.trans[this.constructor.prototype.trans.length - 1].x,     //p5的bug,translate后,鼠标位置出错.
			translateY = this.constructor.prototype.trans[this.constructor.prototype.trans.length - 1].y;
		this.mouseX = this.p.mouseX - translateX;
		this.mouseY = this.p.mouseY - translateY;
	}
	util.inheritPrototype(ButtonPlus, Button);

	//统计ButtonPlus实例被选中个数，主要目的在于控制每次只能选择一个Button
	ButtonPlus.prototype.hoverObjCount = 0;
	ButtonPlus.prototype.clickObjCount = 0;
	ButtonPlus.prototype.unselectableArea = null;

	//判断ButtonPlus是否被选中（加强版）
	ButtonPlus.prototype.isSelected = function () {
		

		if (this.filtered){     //假如被排除了，那么所有的状态都为未选中（亦即永远选不中）
			return false;
		}
		var width = this.width > 40 ? this.width : 40;
		var height = this.width > 40 ? this.width : 40;
		if (this.width === this.height && this.geometryType === "circle") {
			if (Math.pow((this.mouseX - this.position.x), 2) + Math.pow((this.mouseY - this.position.y), 2) <= Math.pow(width / 2, 2)) {
				if (this.isMouseInUnSectArea(this.mouseX, this.mouseY) && this.pState !== "click" && this.pState !== "press"){
					return false;
				}else{
					return true;
				}
			} else {
				return false;
			}
		} else {
			if (this.mouseX >= this.position.x - width / 2 && this.mouseX <= this.position.x + width / 2 && this.mouseY >= this.position.y - height / 2) {
				if (this.isMouseInUnSectArea(this.mouseX, this.mouseY)){
					return false;
				}
				return true;
			} else {
				return false;
			}
		}
	};

	ButtonPlus.prototype.isMouseInUnSectArea = function (mouseX, mouseY){
		if (this.constructor.prototype.unselectableArea !== null && (Math.pow((mouseX - this.constructor.prototype.unselectableArea.x), 2) + Math.pow((mouseY - this.constructor.prototype.unselectableArea.y), 2) <= Math.pow(this.maxWidth / 2, 2))){
			return true;
		}else{
			return false;
		}
	}

	//判断ButtonPlus的状态（加强版）
	ButtonPlus.prototype.getState = function () {
		/**
		 * hover (pState) ： 鼠标悬浮（被选中）
		 * press (pState) ： 鼠标按下
		 * click (pState) ： 鼠标点击
		 * mouseOut (pState) ： 鼠标从button上移开/未被选中
		 * on (pSwitch) : Button处于开启状态
		 * off (pSwitch) ： Button处于关闭状态
		 */
		if (this.isSelected()) {
			if (this.pState === "click") {
				if (this.p.mouseIsPressed) {
					if (this.pState !== "mouseOut") {
						return "press";
					} else {
						return;
					}
				} else {
					return "click";
				}
			} else {
				if (this.constructor.prototype.hoverObjCount <= 0 || this.pState != "mouseOut") {
					if (this.p.mouseIsPressed) {
						if (this.pState === "mouseOut") {
							return "mouseOut";
						} else {	
							//如果button的大小小于90,则不出现press状态
							if(this.width >= this.maxWidth - 10){
								return "press";
							}else{
								return "hover"
							}
						}
					} else {
						if (this.pState === "press") {
							if (this.pSwitch === "on") {
								this.pSwitch = "off";
								this.fire({ type: "turnOff" });
								this.constructor.prototype.hoverObjCount += 1;
								this.constructor.prototype.clickObjCount -= 1;
								if (this.constructor.prototype.clickObjCount === 0){
									this.constructor.prototype.unselectableArea = null;
								}
								return "hover";
							} else {

								this.pSwitch = "on";
								this.fire({ type: "turnOn" });
								return "click";

							}
						} else {
							if (this.pState !== "hover") {
								//first
								this.constructor.prototype.hoverObjCount += 1;
							}
							return "hover";
						}
					}
				} else {
					return "mouseOut";
				}
			}
		} else {
			if (this.pState == "click") {
				if (this.constructor.prototype.clickObjCount > 1 && this.clickTimeline !== 0){
					this.constructor.prototype.clickObjCount -= 1;
					this.pSwitch = "off";
					return "mouseOut";
				}
				return "click";
			} else {
				if (this.p.mouseIsPressed && this.pSwitch == "on") {
					this.pSwitch = "off";
					this.fire({ type: "turnOff" });
					if (this.constructor.prototype.clickObjCount === 0){
						this.constructor.prototype.unselectableArea = null;
					}
				}
				if (this.pState == "hover" ) {  //|| this.pState == "press"
					this.constructor.prototype.hoverObjCount -= 1;
				}
				return "mouseOut";
			}
		}
	};

	ButtonPlus.prototype.update = function (){
		this.trans_position = new p5.Vector(this.position.x + this.constructor.prototype.trans[this.constructor.prototype.trans.length - 1].x, this.position.y + this.constructor.prototype.trans[this.constructor.prototype.trans.length - 1].y);
		var translateX = this.constructor.prototype.trans[this.constructor.prototype.trans.length - 1].x,     //p5的bug,translate后,鼠标位置出错.
			translateY = this.constructor.prototype.trans[this.constructor.prototype.trans.length - 1].y;
		this.mouseX = this.p.mouseX - translateX;
		this.mouseY = this.p.mouseY - translateY;
	};
	//根据不同的状态绘制ButtonPlus（加强版）
	ButtonPlus.prototype.display = function () {
		this.update();
		if (this.strokeCol) {
			this.p.stroke(this.strokeCol);
		} else {
			this.p.noStroke();
		}

		this.p.rectMode('center');
		this.state = this.getState();
		this.cursorState(this.state);  //鼠标状态
		switch (this.state) {
			case "hover":
				//音效
				if (this.pState == "mouseOut") {         //首次hover
					if (this.sound) this.sound.play();
				}
				this.fillCol = this.buttonCol;
				//this.p.fill(this.fillCol);
				this.drawObj();
				if (this.width > this.maxWidth) {
					this.breath = true;
				}

				var s = 1.1;
				if (this.breath) {
					//呼吸效果
					if (!this.breathState && this.width <= this.maxWidth) {
						this.width *= 1.002;
						this.height *= 1.002;
					} else {
						this.breathState = true;
					}
					if (this.breathState && this.width > this.maxWidth - 10) {
						this.width *= 0.995;
						this.height *= 0.995;
					} else {
						this.breathState = false;
					}
				} else {
					//放大
					if (this.width <= this.maxWidth) {
						this.width *= s;
						this.height *= s;
					} else {

					}
				}
				this.fire({ type: "hover" });
				this.pState = "hover";
				break;
			case "mouseOut":
				if (this.buttonCol) {
					this.fillCol = this.buttonCol;
				}
				this.drawObj();
				this.breath = false;

				//缩小
				var s = 0.95;
				if (this.width > this.w) {
					this.width *= s;
					this.height *= s;
				}

				this.fire({ type: "mouseOut" });
				this.pState = "mouseOut";
				break;
			case "press":
				this.fillCol = this.pressCol;
				this.drawObj();
				this.fire({ type: "press" });
				this.pState = "press";
				break;
			case "click":
				this.fillCol = this.clickCol;
				this.drawObj();

				//点击反馈
				if (this.pState === "press") {    //trunOn
					this.clickTimeline = 0;
					this.constructor.prototype.hoverObjCount -= 1;
					this.constructor.prototype.clickObjCount += 1;
					this.constructor.prototype.unselectableArea = this.position.copy();
				} else {
					this.clickTimeline++;
				}
				
				this.fire({ type: "click" });
				this.pState = "click";
				break;
			default:
				if (this.buttonCol) {
					this.fillCol = this.buttonCol;
				} else {
					this.fillCol = this.p.color(0, 0, 100);
				}
				this.drawObj();
		}
	};

	//ButtonPlus状态重置
	ButtonPlus.stateReset = function () {
		this.prototype.hoverObjCount = 0;
	};

	ButtonPlus.prototype.drawObj = function (){
		if (this.filtered){
			this.drawFilteredObj();
		}else{
			this.drawGeometry();
		}
	};

	ButtonPlus.prototype.drawFilteredObj = function (){
		//this.strokeCol ? this.p.stroke(this.strokeCol) : this.p.noStroke();
		this.p.fill(this.p.color(200,200,200));
		this.p.push();
		this.p.translate(this.position.x, this.position.y);
		this.p.ellipse(0, 0, this.width, this.height);
		this.p.pop();
	};

	ButtonPlus.prototype.trans = [{
		x : 0,
		y : 0
	}];

	ButtonPlus.prototype._trans = null;

	ButtonPlus.translate = function (x, y, p){
		p.translate(x,y);
		this.prototype._trans = {
			x : this.prototype.trans[this.prototype.trans.length - 2].x + x,       //什么bug来的！！！！！Array最后一个竟然是length - 2！！！！！！
			y : this.prototype.trans[this.prototype.trans.length - 2].y + y
		};
	};

	ButtonPlus.pushMatrix = function (p){
		p.push();
		if (this.prototype._trans === null){
			this.prototype.trans.push({
				x : this.prototype.trans[this.prototype.trans.length - 1].x,
				y : this.prototype.trans[this.prototype.trans.length - 1].y
			});
		}else{
			this.prototype.trans.push({
				x : this.prototype._trans.x,
				y : this.prototype._trans.y
			});
		}
	};

	ButtonPlus.popMatrix = function (p){
		if (this.prototype.trans.length > 0){
			p.pop();
			this.prototype.trans.pop();
		}
	};

	module.exports = ButtonPlus;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Button类，基于p5.js
	 * by:Zzzz
	 * date:2016-03-03
	 */

	var util = __webpack_require__(3);
	var VisualObject = __webpack_require__(6);

	var Button = function (options) {
		VisualObject.call(this,{
			position : options.position,  //位置
			width : options.width,   //宽度
			height : options.height,  //高度
			p : options.p,  //p5实例
			fillCol : options.fillCol
		});
		this.pState = "mouseOut";  //Button初始状态
		this.state;
		this.pSwitch = "off";   //Button初始状态
		this.hoverCol = options.hoverCol || this.p.color("#06799F");  //鼠标悬浮时Button的颜色
		this.pressCol = options.pressCol || this.p.color("#D9534F");  //鼠标按下时Button的颜色
		this.clickCol = options.clickCol || this.p.color("#D9534F");  //Button处于on状态时的颜色
		this.positions = [];  //储存位置
		this.handlers = {};  //事件处理程序
	}
	util.inheritPrototype(Button, VisualObject);

	//判断Button是否被选中
	Button.prototype.isSelected = function () {
		var translateX = globalVar.translate[globalVar.translate.length - 1].x,      //p5的bug,translate后,鼠标位置出错.
			translateY = globalVar.translate[globalVar.translate.length - 1].y,
			mouseX = this.p.mouseX - translateX,
			mouseY = this.p.mouseY - translateY;

		if (mouseX >= this.position.x - width / 2 && mouseX <= this.position.x + width / 2 && mouseY >= this.position.y - height / 2 && mouseY <= this.position.y + height / 2) {
			return true;
		} else {
			return false;
		}
	}

	//判断Button的状态
	Button.prototype.getState = function () {
		/**
		 * hover (pState) ： 鼠标悬浮（被选中）
		 * press (pState) ： 鼠标按下
		 * click (pState) ： 鼠标点击
		 * mouseOut (pState) ： 鼠标从button上移开/未被选中
		 * on (pSwitch) : Button处于开启状态
		 * off (pSwitch) ： Button处于关闭状态
		 */
		if (this.isSelected()) {
			if (this.pState == "click") {
				if (this.p.mouseIsPressed) {
					return "press";
				} else {
					return "click";
				}
			} else {
				if (this.p.mouseIsPressed) {
					return "press";
				} else {
					if (this.pState == "press") {
						if (this.pSwitch == "on") {
							this.pSwitch = "off";
							return "hover";
						} else {
							this.pSwitch = "on";
							return "click";
						}
					} else {
						return "hover";
					}
				}
			}
		} else {
			if (this.pState == "click") {
				return "click";
			} else {
				return "mouseOut";
			}
		}
	}

	//鼠标指针图形
	Button.prototype.cursorState = function(state){
		if(this.constructor.prototype.hoverObjCount == 0){
			$(this.p.canvas).css("cursor","default");
		}else{
			if(state != "mouseOut"){
				if(this.isSelected()){
					$(this.p.canvas).css("cursor","pointer");
				}else{
					$(this.p.canvas).css("cursor","default");
				}
			}
		}
	}

	Button.prototype.update = function(){
	}

	//根据不同的状态绘制Button
	Button.prototype.display = function () {
		//this.update();
		if (this.strokeCol) {
			this.p.stroke(this.strokeCol);
		} else {
			this.p.noStroke();
		}
		this.p.rectMode('center');
		this.tate = this.getState();
		switch (this.tate) {
			case "hover":
				this.fillCol = this.hoverCol;
				this.drawGeometry();
				this.fire({ type: "hover" });
				this.pState = "hover";
				break;
			case "mouseOut":
				if (this.buttonCol) {
					this.fillCol = this.buttonCol;
				} else {
					this.fillCol = this.p.color(0, 0, 100);
				}
				this.drawGeometry();
				this.fire({ type: "mouseOut" });
				this.pState = "mouseOut";
				break;
			case "press":
				this.fillCol = this.pressCol;
				this.drawGeometry();
				this.fire({ type: "press" });
				this.pState = "press";
				break;
			case "click":
				this.fillCol = this.clickCol;
				this.drawGeometry();
				this.fire({ type: "click" });
				this.pState = "click";
				break;
			default:
				if (this.buttonCol) {
					this.fillCol = this.buttonCol;
				} else {
					this.fillCol = this.p.color(0, 0, 100);
				}
				this.drawGeometry();
		}
	}


	//事件相关
	Button.prototype.addHandler = function (type, handler) {
		if (typeof this.handlers[type] == "undefined") {
			this.handlers[type] = [];
		}
		this.handlers[type].push(handler);
	}
	Button.prototype.fire = function (event) {
		if (!event.target) {
			event.target = this;
		}
		if (this.handlers[event.type] instanceof Array) {
			var handlers = this.handlers[event.type];
			for (var i = 0, len = handlers.length; i < len; i++) {
				handlers[i](event);
			}
		}
	}
	Button.prototype.removeHandler = function (type, handler) {
		if (this.handlers[type] instanceof Array) {
			var handlers = this.handlers[type];
			for (var i = 0, len = handlers.length; i < len; i++) {
				if (handers[i] === handler) {
					break;
				}
			}
			handlers.splice(i, 1);
		}
	}


	module.exports = Button;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Created by zhang on 2016/5/8 0008.
	 */
	var globalVar = __webpack_require__(5);
	var ButtonPlus = __webpack_require__(7);

	var FilterButton = function (options){
	    this.type = options.type;
	    
	    if (this.type !== "cancel" && this.type !== "search"){
	        this.value = options.value;
	        this.switch = false;
	    }
	    
	    this.keyword = options.keyword;
	    if (options.node){
	        this.node = options.node;
	    }else{
	        this.id = options.id;
	        this.text = options.text;
	        this.class = options.class;
	        this.parentId = options.parentId;
	        this.createElement();
	    }

	    //this.class = options.class;
	    //if (this.class){
	    //    this.node.classList += this.class;
	    //}
	    //this.node.classList += "FilterButton";
	    this.node.title = options.title;
	    this.attachEvent();
	};

	FilterButton.prototype.select = {};

	FilterButton.prototype.createElement = function (){
	    var doc = document;
	    if (this.type === "search"){
	        this.node = doc.createElement("input");
	        this.node.placeholder = this.text;
	        this.node.type = "text";
	    }else{
	        this.node = doc.createElement("button");
	        this.node.innerHTML = this.text;
	    }
	    this.node.id = this.id;
	    this.node.className = this.class;
	    
	    if (this.parentId){
	        var parentNode = doc.getElementById(this.parentId);
	        if (parentNode){
	            parentNode.appendChild(this.node);
	        }else{
	            doc.body.appendChild(this.node);
	        }
	    }else{
	        doc.body.appendChild(this.node);
	    }
	};

	FilterButton.prototype.doFilter = function (){
	    var BP = globalVar.displayArray.ButtonParticle;

	    for(var i = 0, len = BP.length; i < len; i++){
	        BP[i].visualObject.filtered = false;
	    }

	    var status = [];
	    for (i = 0, len = BP.length; i < len; i++) {
	        var m = 0;
	        for (var keyword in this.constructor.prototype.select) {
	            if (this.constructor.prototype.select[keyword].length === 0){      //如果有一列的多选按钮点击个数减少到0，则filter失效
	                if (m === 0){
	                    status[i] = false;    //BP[i].visualObject.filtered = false;
	                }else{
	                    status[i] |= false;
	                }
	                delete this.constructor.prototype.select[keyword];
	            }else{
	                if (keyword === "search"){    //是否是搜索框
	                    var value = this.constructor.prototype.select[keyword];
	                    if (value !== ""){
	                        var re = new RegExp(value + "", "gi");
	                        var resule = re.test(BP[i].visualObject.info["title"]);
	                        if (!resule){
	                            this.changeBtnStatus(BP[i])
	                            if (m === 0){
	                                status[i] = true;
	                            }else{
	                                status[i] |= true;
	                            }
	                        }
	                    }
	                }else if (this.constructor.prototype.select[keyword].indexOf(BP[i].visualObject.info[keyword]) === -1) {     // ===-1说明不存在
	                    this.changeBtnStatus(BP[i])
	                    // if (BP[i].visualObject.pState === "click") {
	                    //     BP[i].visualObject.pState = "mouseOut";       //fliter切换后，将之前“click”状态的button改为普通状态，即状态重置
	                    //     ButtonPlus.prototype.hoverObjCount = 0;        //选中个数也必须重置
	                    //     ButtonPlus.prototype.clickObjCount = 0; 
	                    //     BP[i].visualObject.fire({type: "turnOff"});     //ButtonPlus触发turnOff事件
	                    // }

	                    if (m === 0){
	                        status[i] = true;
	                    }else{
	                        status[i] |= true;
	                    }
	                }else{
	                    if (m === 0){
	                        status[i] = false;
	                    }else{
	                        status[i] |= false;

	                    }
	                }
	            }
	            m ++;
	        }
	    }

	    for(i = 0; i < len; i++){
	        BP[i].visualObject.filtered = status[i];
	    }
	};

	FilterButton.prototype.attachEvent = function (){
	    if (this.type === "cancel"){                                              //如果是删除按钮
	        this.node.onclick = function (){
	            if (this.keyword){       //操作分类删除按钮
	                this.constructor.prototype.select[this.keyword] = [];

	                for (var i in globalVar.filterButton){        //清除某个类型的按钮
	                    if (globalVar.filterButton[i].switch && globalVar.filterButton[i].keyword === this.keyword){
	                        globalVar.filterButton[i].switch = globalVar.filterButton[i].switch ? false : true;
	                        globalVar.filterButton[i].node.classList.remove("active");
	                    }
	                }

	                this.disactiveCancelAll();    //当所有按钮没被按下时,取消激活cancelAll

	            }else{                              //全部清除
	                for (var keyword in this.constructor.prototype.select) {
	                    if (keyword !== "search"){
	                        this.constructor.prototype.select[keyword] = [];     //cancelAll按钮不清楚搜索框的内容
	                    }
	                }
	                for (i in globalVar.filterButton){
	                    if (globalVar.filterButton[i].switch){
	                        globalVar.filterButton[i].switch = globalVar.filterButton[i].switch ? false : true;
	                        globalVar.filterButton[i].node.classList.remove("active");
	                    }
	                    if (globalVar.filterButton[i].type === "cancel"){
	                        globalVar.filterButton[i].node.classList.remove("cancelActive");
	                    }
	                }
	            } 
	            this.node.classList.remove("cancelActive");
	            this.doFilter();
	        }.bind(this);
	    }else if(this.type === "search"){
	        this.node.onchange = function (){
	            var value = this.node.value;
	            if (value === ""){
	                this.constructor.prototype.select["search"] = [];
	            }else{
	                this.constructor.prototype.select["search"] = value;
	            }
	            this.doFilter();
	        }.bind(this);
	    }else{
	        this.node.onclick = function (){
	            this.switch = this.switch ? false : true;

	            if (this.switch){                 //切换FilterButton的显示效果
	                this.node.classList.add("active");

	                if(!this.constructor.prototype.select[this.keyword]){
	                    this.constructor.prototype.select[this.keyword] = [];
	                }
	                this.constructor.prototype.select[this.keyword].push(this.value);

	                for(var i in globalVar.filterButton){                                        //当该类型有按钮被按下时,激活该类型的删除按钮
	                    if (globalVar.filterButton[i].type === "cancel" && globalVar.filterButton[i].keyword === this.keyword){
	                        globalVar.filterButton[i].node.classList.add("cancelActive");
	                    }
	                    if (globalVar.filterButton[i].type === "cancel" && globalVar.filterButton[i].keyword === undefined){
	                        globalVar.filterButton[i].node.classList.add("cancelActive");
	                    }
	                }
	            }else{
	                this.node.classList.remove("active");
	                var keyword = this.constructor.prototype.select[this.keyword];
	                if (keyword !== undefined){
	                    var id = keyword.indexOf(this.value);
	                    keyword.splice(id, 1);
	                }
	                if (keyword.length === 0){       //操作分类删除按钮
	                    for(var i in globalVar.filterButton){                                        //当该类型的所有按钮没被按下时,取消激活该类型的删除按钮
	                        if (globalVar.filterButton[i].type === "cancel" && globalVar.filterButton[i].keyword === this.keyword){
	                            globalVar.filterButton[i].node.classList.remove("cancelActive");
	                        }
	                    }
	                }

	                this.disactiveCancelAll();    //当所有按钮没被按下时,取消激活cancelAll
	            }

	            this.doFilter();
	        }.bind(this);
	    }
	};

	FilterButton.prototype.disactiveCancelAll = function (){   //当所有按钮没被按下时,取消激活cancelAll
	    for (var i in this.constructor.prototype.select){
	        if (this.constructor.prototype.select[i].length !== 0){
	            return;
	        }
	    }
	    for(var i in globalVar.filterButton){
	        if (globalVar.filterButton[i].type === "cancel" && globalVar.filterButton[i].keyword === undefined){
	            globalVar.filterButton[i].node.classList.remove("cancelActive");
	        }
	    }
	};

	FilterButton.prototype.changeBtnStatus = function (btn){ 
	    if (btn.visualObject.pState === "click") {
	        btn.visualObject.pState = "mouseOut";       //fliter切换后，将之前“click”状态的button改为普通状态，即状态重置
	        ButtonPlus.prototype.hoverObjCount = 0;        //选中个数也必须重置
	        ButtonPlus.prototype.clickObjCount = 0; 
	        btn.visualObject.fire({type: "turnOff"});     //ButtonPlus触发turnOff事件
	    }
	}


	module.exports = FilterButton;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	
	var eventHandleFunc = __webpack_require__(15);
	var util = __webpack_require__(3);
	var globalVar = __webpack_require__(5);
	var ButtonParticle = __webpack_require__(2);
	var ButtonPlus = __webpack_require__(7);

	var getInfo = function (type,arg){
		globalVar.displayArray.ButtonParticle = [];
		
		if(window.XMLHttpRequest){
			XMLHTTP=new XMLHttpRequest();
		}else{
			XMLHTTP=new ActiveXObject("Microsoft.XMLHTTP");
		}

		if(type === "posts"){
			XMLHTTP.onreadystatechange=function(){
				if(XMLHTTP.readyState==4 && XMLHTTP.status==200){
					//alert(XMLHTTP.responseText);
					$("#loading").fadeOut();
					var posts = JSON.parse(XMLHTTP.responseText);
					
					for(var item in posts){
						var size = Math.random()*20 + 15;
						var options = {
							position : new p5.Vector((Math.random() * globalVar.width - 100) + 50,(Math.random() * globalVar.height - 60) + 30),
							width : size,
							height : size,
							r : 25,
							p : globalVar.pp
						};
						var optionsBP = {
							visualObject : new ButtonPlus(options),
							p : globalVar.pp,
							vortexAttract : true
						};
						
						var newObj = new ButtonParticle(optionsBP);
						newObj.attractPt = globalVar.attractPtL;

						newObj.visualObject.addHandler("click",eventHandleFunc.clicked_animation);
						newObj.visualObject.addHandler("turnOn",eventHandleFunc.showPostInfo);
						newObj.visualObject.addHandler("turnOn",eventHandleFunc.hideShortInfo);
						newObj.visualObject.addHandler("turnOff",eventHandleFunc.hideInfoFrame);
						newObj.visualObject.addHandler("hover",eventHandleFunc.showShortPostInfo);
						newObj.visualObject.addHandler("mouseOut",eventHandleFunc.hideShortInfo);

						newObj.visualObject.sound = globalVar.SOUNDFILE;
						newObj.visualObject.info = posts[item];
						newObj.visualObject.buttonCol = newObj.visualObject.info["color"] || newObj.visualObject.p.color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
						globalVar.displayArray.ButtonParticle.push(newObj);
					}
					var totalHeight =  globalVar.displayArray.ButtonParticle.length / globalVar.countPerRow * globalVar.cellSize;
					globalVar.transTarget.totalPage = Math.ceil(totalHeight / (globalVar.pp.height -  globalVar.cellSize * 2));
				}else{
					$("#loading").fadeIn();
				}
			};
			XMLHTTP.open("GET","api/getPostInfo.json");
			XMLHTTP.send();
		}else{
			if(type === "users"){
				XMLHTTP.onreadystatechange=function(){
					if(XMLHTTP.readyState==4 && XMLHTTP.status==200){
						var users = JSON.parse(XMLHTTP.responseText);
						//alert(XMLHTTP.responseText);
						//console.log(XMLHTTP.responseText);
						
						$("#loading").fadeOut();
						var i = 0;
						var count = util.getJsonObjLength(users);
						for(var item in users){
							var size = Math.random()*20 + 20;
							var options = {
								position : new p5.Vector((Math.random() * globalVar.width - 100) + 50,(Math.random() * globalVar.height - 60) + 30),
								width : size,
								height : size,
								r : 25,
								p : globalVar.pp
							};
							var optionsBP = {
								visualObject : new ButtonPlus(options),
								p : globalVar.pp,
								vortexAttract : true
							};
							var newObj = new ButtonParticle(optionsBP);
							if(i < count/2){
								newObj.attractPt = globalVar.attractPtL;
							}else{
								newObj.attractPt = globalVar.attractPtR;
							}

							newObj.visualObject.buttonCol = globalVar.pp.color(Math.random()*100, Math.random()*50, Math.random()*200,255);
							newObj.visualObject.addHandler("click",eventHandleFunc.clicked_animation);
							newObj.visualObject.addHandler("turnOn",eventHandleFunc.hideShortInfo);
							newObj.visualObject.addHandler("turnOn",eventHandleFunc.showUserInfo);
							newObj.visualObject.addHandler("turnOff",eventHandleFunc.hideInfoFrame);
							newObj.visualObject.addHandler("hover",eventHandleFunc.showShortUserInfo);
							newObj.visualObject.addHandler("mouseOut",eventHandleFunc.hideShortInfo);
							newObj.visualObject.sound = globalVar.SOUNDFILE;
							newObj.visualObject.info = users[item];
							
							globalVar.displayArray.ButtonParticle.push(newObj);
							i++;
						}
						i = null;
						count = null;
						var totalHeight =  globalVar.displayArray.ButtonParticle.length / globalVar.countPerRow * globalVar.cellSize;
						globalVar.transTarget.totalPage = Math.ceil(totalHeight / globalVar.pp.height);
					}else{
						$("#loading").fadeIn();
					}
				}
				XMLHTTP.open("GET","api/getUserInfo.json" + "?userRole=" + arg);
				XMLHTTP.send();
			}
		}
		
	}


	module.exports = getInfo;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * 定义与Button绑定的事件处理程序
	 */
	var globalVar = __webpack_require__(5);
	var getPostContent = __webpack_require__(16);

	var eventHandleFunc = {
	    clicked_animation : function (event){
	        function linePts(){
	            event.target.pts = [];
	            event.target.pts.push(new p5.Vector(event.target.position.x, event.target.position.y + event.target.width / 2));
	            event.target.pts.push(new p5.Vector(event.target.position.x, event.target.position.y + event.target.width / 2));
	            for (i = 2; i <= count; i++){
	                event.target.pts.push(new p5.Vector(event.target.position.x, event.target.position.y + event.target.width / 2 + (i - 1) * distance));
	            }
	        }
	        event.target.p.noStroke();
	        event.target.p.fill(0);
	        event.target.p.textAlign("center");
	        event.target.p.stroke(255);
	        event.target.p.strokeWeight(5);
	        event.target.p.push();
	        event.target.p.translate(event.target.position.x,event.target.position.y);
	        
	        if (event.target.clickTimeline > 100000000) event.target.clickTimeline = 0;
	        
	        if(event.target.clickTimeline < 40){
	            event.target.p.rotate(event.target.p.map(event.target.clickTimeline,0,40,0,Math.PI/4));
	        }else{
	            event.target.p.rotate(Math.PI/4);
	        }
	        event.target.p.line(-12,0,12,0);
	        event.target.p.line(0,-12,0,12);
	        event.target.p.pop();
	        
	        event.target.p.noFill();
	        var n = event.target.clickTimeline % 200;
	        event.target.p.stroke(200, 200,200, 200 - n);
	        event.target.p.strokeWeight(10 - n / 20);
	        
	        for (var i = 0; i < 1; i++){
	            event.target.p.ellipse(event.target.position.x, event.target.position.y, event.target.height + Math.sqrt((n - 60 * i) * 10, 2), event.target.height + Math.sqrt((n - 60 * i) * 10, 2));
	        }
	        
	        //画线
	        event.target.p.stroke('gray');
	        event.target.p.strokeWeight(0.8);
	        if(event.target.clickTimeline < 100){
	            event.target.p.line(event.target.position.x, event.target.position.y + event.target.width / 2, event.target.position.x, event.target.position.y + event.target.width / 2 
	                                + event.target.p.height * event.target.clickTimeline / 100 + globalVar.translate.currentPage * globalVar.scrollDis);
	            var distance = 50;
	            var count = Math.ceil((event.target.position.y + event.target.width / 2 + event.target.p.height + (globalVar.transTarget.totalPage - globalVar.translate.currentPage - 1) * globalVar.scrollDis) / distance);
	            if (event.target.clickTimeline === 0){
	                linePts();
	            }
	        }else{
	            // event.target.p.line(event.target.position.x, event.target.position.y + event.target.width / 2, event.target.position.x, event.target.position.y + 1500);
	            event.target.p.noFill();
	            // event.target.p.stroke("red");
	            var distance = 50;
	            var count = Math.ceil((event.target.position.y + event.target.width / 2 + event.target.p.height + (globalVar.transTarget.totalPage - globalVar.translate.currentPage - 1) * globalVar.scrollDis) / distance);
	            if (count !== event.target.pts.lenght){
	                linePts();
	            }
	            mouseX = event.target.mouseX;
	            mouseY = event.target.mouseY;
	            event.target.p.beginShape();
	            var pt,mouseX,mouseY;
	            for (i = 0; i < count; i++){
	                pt = event.target.pts[i];
	                
	                if (i > 1){
	                    var dis = Math.sqrt(Math.pow(pt.x - mouseX, 2) + Math.pow(pt.y - mouseY, 2)),
	                        vect = new p5.Vector(mouseX - pt.x, mouseY - pt.y);
	                    
	                    dis = event.target.p.map(dis, 0, 1300, 0, 100);
	                    dis = 100 / event.target.p.constrain(dis,1,100);
	                    vect.normalize();
	                    vect.mult(-dis);
	                    
	                    event.target.p.curveVertex(pt.x + vect.x, pt.y );
	                    // event.target.p.ellipse(pt.x + vect.x, pt.y ,10,10);
	                }else{
	                    event.target.p.curveVertex(pt.x, pt.y);
	                    // event.target.p.ellipse(pt.x,pt.y,10,10);
	                }
	                
	                // event.target.p.ellipse(mouseX,mouseY,10,10);
	            }
	            event.target.p.endShape();
	        }
	    },

	    showShortUserInfo : function (event){
	        if(event.target.pState !== "hover"){ 
	            var top = Math.floor(event.target.position.y + globalVar.navigationBarHeight + event.target.constructor.prototype.trans[event.target.constructor.prototype.trans.length - 1].y);
	            var left = Math.floor(event.target.position.x + event.target.constructor.prototype.trans[event.target.constructor.prototype.trans.length - 1].x);  
	            
	            var sortInfoFrame = document.getElementById("sortInfoFrame");
	            if(sortInfoFrame){
	                $("#sortInfoFrame").fadeIn(0);
	                sortInfoFrame.innerHTML = "";
	            }else{
	                sortInfoFrame = document.createElement("div");
	                sortInfoFrame.id = "sortInfoFrame";
	            }
	            sortInfoFrame.style.top = top - 50 + "px";
	            sortInfoFrame.style.left = left + 80 + "px";

	            var img = document.createElement("img");
	            img.src = event.target.info['avatar'];
	            img.style.cssText = "width:100px;height:100px;border-radius:5px;-moz-border-radius:5px;";
	            sortInfoFrame.appendChild(img);

	            var name = document.createElement("div");
	            name.innerHTML = "<b>名字：</b>" + event.target.info['name'];
	            name.style.cssText = "margin-top:20px";
	            sortInfoFrame.appendChild(name);

	            document.body.appendChild(sortInfoFrame);
	        }

	    },

	    showShortPostInfo : function (event){
	        if(event.target.pState !== "hover"){
	            var top = Math.floor(event.target.position.y + globalVar.navigationBarHeight + event.target.constructor.prototype.trans[event.target.constructor.prototype.trans.length - 1].y);
	            var left = Math.floor(event.target.position.x + event.target.constructor.prototype.trans[event.target.constructor.prototype.trans.length - 1].x);
	               
	            var sortInfoFrame = document.getElementById("sortInfoFrame");
	            if(sortInfoFrame){
	                $("#sortInfoFrame").fadeIn(0);
	                sortInfoFrame.innerHTML = "";
	            }else{
	                sortInfoFrame = document.createElement("div");
	                sortInfoFrame.id = "sortInfoFrame";
	            }
	            sortInfoFrame.style.top = top - 50 + "px";
	            sortInfoFrame.style.left = left + 80 + "px";

	            var img = document.createElement("img");
	            img.src = event.target.info['thumbnail'];
	            img.style.cssText = "width:100px;height:100px;border-radius:5px;-moz-border-radius:5px;";
	            sortInfoFrame.appendChild(img);

	            var title = document.createElement("div");
	            title.innerHTML = "<b>作品：</b>" + event.target.info['title'];
	            title.style.cssText = "margin-top:20px";
	            sortInfoFrame.appendChild(title);

	            document.body.appendChild(sortInfoFrame);
	        }

	    },

	    hideShortInfo : function (event){
	        if (event.target.hoverObjCount === 0 && event.target.pState==="hover") {
	            $("#sortInfoFrame").fadeOut(0);
	        }
	        if (event.target.state === "press") {
	            $("#sortInfoFrame").fadeOut(400);
	        }
	    },

	    showUserInfo : function (event){
	        var doc = document;

	        var infoFrame = document.getElementById("infoFrame");
	        if(infoFrame){
	            infoFrame.style.visibility = "visible";
	            infoFrame.innerHTML = "";    //清空
	        }else{
	            infoFrame = doc.createElement("div");
	            infoFrame.id = "infoFrame";
	        }

	        var introduction = doc.createElement("div");
	        introduction.id = "introduction";

	            var avatar = doc.createElement("img");      //avatar
	            avatar.src = event.target.info['avatar'];
	            avatar.width = 80;
	            avatar.height = 80;
	            avatar.alt = event.target.info['name'];

	            var infoContainer = doc.createElement("div");
	            infoContainer.id = "infoContainer";

	                var name = doc.createElement("div");     //title
	                name.id += "name";
	                name.innerHTML = "<h3>" + event.target.info['name'] + "</h3>";

	                var postList = doc.createElement("div");
	                postList.id = "postList";

	                var ps = event.target.info['posts'];
	                var fragment = doc.createDocumentFragment();
	                for(var i=0;i<ps.length;i++){
	                    var posts = doc.createElement("div");     //author
	                    posts.className += "postList";
	                    posts.title = "posts";
	                    //posts.id = "getPostContentButton" + ps[i].id;
	                    posts.innerHTML = ps[i].title;
	                    posts.data_id = ps[i].id;
	                    posts.onclick = function (){
	                        getPostContent(this.data_id,true);
	                    };
	                    fragment.appendChild(posts);
	                }

	            var fragment_1 = doc.createDocumentFragment();

	            var major = doc.createElement("div");
	            major.className += "postMeta";
	            major.title = "major";
	            major.innerHTML = "专业：" +  "---";

	            var unit = doc.createElement("div");
	            unit.className += "postMeta";
	            unit.title = "unit";
	            unit.innerHTML = "单位/学校：" +  "广州美术学院";

	            var profession = doc.createElement("div");
	            profession.className += "postMeta";
	            profession.title = "profession";
	            profession.innerHTML = "职业：" +  "---";

	            fragment_1.appendChild(major);
	            fragment_1.appendChild(unit);
	            fragment_1.appendChild(profession);

	        var postContent = document.getElementById("postContent");
	        if (!postContent){
	            postContent = document.createElement("div");
	            postContent.id = "postContent"
	            postContent.style.display = "none";
	        }

	        infoContainer.appendChild(name);
	        infoContainer.appendChild(fragment_1);

	        postList.appendChild(fragment);
	        introduction.appendChild(postList);
	        introduction.appendChild(avatar);
	        introduction.appendChild(infoContainer);

	        infoFrame.appendChild(introduction);
	        infoFrame.appendChild(postContent);
	        doc.body.appendChild(infoFrame);
	        
	        $("#infoFrame").css("display", "none");
	        $("#infoFrame").fadeIn();
	    },

	    showPostInfo : function (event){
	        var doc = document;
	        var infoFrame = doc.getElementById("infoFrame");    //infoFrame
	        if(infoFrame){
	            infoFrame.style.visibility = "visible";
	            infoFrame.innerHTML = "";    //清空
	        }else{
	            infoFrame = doc.createElement("div");
	            infoFrame.id = "infoFrame";
	        }
	        
	        var infoBody = doc.createElement("div");
	        infoBody.id = "infoBody";
	        
	        
	        var introduction = doc.createElement("div");
	        introduction.id = "introduction";

	            var thumbnail = doc.createElement("img");      //thumbnail
	            thumbnail.src = event.target.info['thumbnail'];
	            thumbnail.width = 80;
	            thumbnail.height = 80;
	            thumbnail.alt = event.target.info['title'];

	            var infoContainer = doc.createElement("div");
	            infoContainer.id = "infoContainer";

	                var title = doc.createElement("div");     //title
	                title.classList.add("title_link");     //添加标题鼠标悬浮样式
	                title.onclick = function (){
	                    if (this.classList.contains("title_link")){
	                        getPostContent(event.target.info['id'], false);  //false : no title
	                    }
	                    this.classList.remove("title_link");     //删除标题鼠标悬浮样式
	                };
	                title.id += "title";
	                title.innerHTML = "<h3>" + event.target.info['title'] + "</h3>";

	                var author = doc.createElement("div");     //author
	                author.className += "postMeta";
	                author.title = "author";
	                author.innerHTML = "作者：" + event.target.info['author'];

	                var productType = doc.createElement("div");
	                productType.className += "postMeta";
	                productType.title = "productType";
	                productType.innerHTML = "作品类型：" + (event.target.info['productType'] || "-----");

	                var major = doc.createElement("div");
	                major.className += "postMeta";
	                major.title = "major";
	                major.innerHTML = "专业：" + (event.target.info['major'] || "---") + "-" + (event.target.info['subMajor'] || "---");

	                var creationDate = doc.createElement("div");
	                creationDate.className += "postMeta";
	                creationDate.title = "creationDate";
	                creationDate.innerHTML = "创作年份：" + (event.target.info['creationDate'] || "-----") + "年";

	        var postContent = document.createElement("div");
	        postContent.id = "postContent";
	        postContent.style.display = "none";

	        infoContainer.appendChild(title);
	        infoContainer.appendChild(author);
	        infoContainer.appendChild(productType);
	        infoContainer.appendChild(major);
	        infoContainer.appendChild(creationDate);

	        introduction.appendChild(thumbnail);
	        introduction.appendChild(infoContainer);
	        
	        infoBody.appendChild(introduction);
	        infoBody.appendChild(postContent);
	        
	        infoFrame.appendChild(infoBody);
	        doc.body.appendChild(infoFrame);
	           
	        //设置infoBody的位置。。。

	        $("#infoFrame").css("display", "none");
	        $("#infoFrame").fadeIn();
	        
	        //这一句不能放在上两句前面,因为fadeIn执行之前,element的weith为0
	        infoBody.style.left = ((doc.documentElement.clientWidth - parseInt($("#introduction").css("width")) - parseInt($("#introduction").css("padding-left")) * 2) / 2) + "px";

	    },

	    hideInfoFrame : function (event){
	        var doc = document;
	        var infoFrame = doc.getElementById("infoFrame");
	        if (event.target.constructor.prototype.clickObjCount <= 1){
	            $("#infoFrame").fadeOut("fast",function (){infoFrame.style.visibility = "hidden";});
	        }
	    }

	};

	module.exports = eventHandleFunc;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	var globalVar = __webpack_require__(5);

	var getPostContent = function (id, title){
		//postContent.style.display = "block";//
		var loading = $("#loading");
		$("#postContent").fadeIn();

		var $infoFrame = $("#infoFrame");
		var $sketch = $("#sketch");

		var height = document.documentElement.clientHeight - 50 ;
		$infoFrame.animate({height:height});
		
		//窗口尺寸改变
		$(window).resize(function() {
			if($("#postContent").css("display") !== "none"){ //如果这个框不是停靠在下方时
				$infoFrame.css("height",document.documentElement.clientHeight - globalVar.navigationBarHeight);
			}
		});
		
		//将sketch隐藏并移出显示范围，否则即使被遮盖也会有交互效果
		// setTimeout(function (){$('#sketch').css('position','fixed')},200);
		var top = $sketch.css("top");
		$sketch.css("top", parseInt(top) - 900 + "px");
		// $sketch.fadeOut();

		//折叠FilterBar,并隐藏filterBarBtn
		$("#filter").slideUp("fast",function (){
			$("#filterBarBtn").fadeOut();
		});


		var rightCtrlBar = document.getElementById("rightCtrlBar");

		//滚到顶部
		var toTop = document.getElementById("toTop");
		if(!toTop){
			toTop = document.createElement("button");
			toTop.id = "toTop";
			toTop.title = "返回顶部";
			toTop.onclick = function (){
				$infoFrame.animate({ scrollTop: 0 }, 400);
			};

			rightCtrlBar.appendChild(toTop);
		}

		var $toTop = $("#toTop");

		/*检查滚动*/
		var sTop;
		sTop = document.getElementById("infoFrame").scrollTop;
		if(sTop === 0){
			$toTop.css("display","none");
		}else{
			$toTop.css("display","block");
		}

		$infoFrame.scroll(function(){
			sTop = document.getElementById("infoFrame").scrollTop;
			if(sTop === 0){
				$toTop.fadeOut();
			}else{
				$toTop.fadeIn();
			}
		});

		//返回按钮（关闭）
		var cancel = document.getElementById("postContent_delete");
		if(!cancel){
			cancel = document.createElement("button");
			cancel.id = "postContent_delete";
			cancel.title = "关闭";
			//cancel.innerHTML = "<span class='glyphicon glyphicon-remove'></span>";
			cancel.onclick = function (){
				$infoFrame.animate({height:"100px"});
				$infoFrame.animate({ scrollTop: 0 }, 400);
				$("#postContent").fadeOut();
				//var postContent = document.getElementById("postContent");
				//postContent.style.display = "none";
				var title = document.getElementById("title");
				if (title){
					title.classList.add("title_link");     //添加标题鼠标悬浮样式
				}
				this.disabled = true;        //防止双击
				$(this).fadeOut();
				$("#loading").fadeOut("slow");
				var top = $sketch.css("top");
				$sketch.css("top",parseInt(top) + 900 + "px"); //将sketch移回
				$sketch.fadeIn();
				$("#filterBarBtn").fadeIn();
			};
			rightCtrlBar.appendChild(cancel);
		}
		$("#postContent_delete").fadeIn();
		cancel.disabled = false;
		
		loading.fadeIn("fast");
		
		if(window.XMLHttpRequest){
			XMLHTTP=new XMLHttpRequest();
		}else{
			XMLHTTP=new ActiveXObject("Microsoft.XMLHTTP");
		}

		XMLHTTP.onreadystatechange=function(){
			if(XMLHTTP.readyState==4 && XMLHTTP.status==200){
				loading.fadeOut("slow");
				// var navigation_bar = document.getElementById("navigation_bar");
				var infoFrame = document.getElementById("infoFrame");
				var postContent = document.getElementById("postContent");
				if(infoFrame){
					if(postContent){
						var post = JSON.parse(XMLHTTP.responseText)[id];
						postContent.innerHTML = post.content;
					}
				}
				// $("#postContent").css("display","none");
				// $("#postContent").fadeIn();
				
			}
		};
		XMLHTTP.open("GET","api/getPostContent.json");
		XMLHTTP.send();
	};


	module.exports = getPostContent;

/***/ })
/******/ ]);