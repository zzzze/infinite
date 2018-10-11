"use strict"; //严格模式
import Scene from '@kapok/scene'
import Geometry from 'Geometry'
import ParticleObject from 'Particle_01'
import Bubble from 'Bubble'
import ParticleSystem from 'ParticleSystem'
import Attractor from 'Attractor'
import VortexAttractor from 'VortexAttractor'
import InfiniteVortexAttractor from 'InfiniteVortexAttractor'
var AttractPoint = require("./AttractPoint.js");
var globalVar = require("./GlobalVar.js");
var VisualObject = require("./VisualObject.js");
var Particle = require("./Particle.js");
var ButtonPlus = require("./ButtonPlus.js");
var FilterButton = require("./FilterButton.js");
require('./main.scss');

const scene = new Scene({id: 'canvas'})
let ps_1 = new ParticleSystem()
let ps_2 = new ParticleSystem()
scene.setup = function (ctx) {
  globalVar.displayArray.backgroundBall = [];
  for(var i = 0; i < 100; i++){
    var size = Math.random()*20 + 15;
    const geometry_1 = new Geometry({
      position: new p5.Vector((Math.random() * this.width - 100) + 50,(Math.random() * this.height - 60) + 30),
      width: size,
      height: size,
      scene,
      fillCol : 'rgba(200, 200, 200, .5)'
    })
    const particleObject_1 = new ParticleObject({ geometry: geometry_1, ctx })
    ps_1.addParticle(particleObject_1)

    var size = Math.random()*20 + 15;
    const geometry_2 = new Bubble({
      position: new p5.Vector((Math.random() * this.width - 100) + 50,(Math.random() * this.height - 60) + 30),
      width: size,
      height: size,
      scene,
      fillCol : 'rgba(200, 200, 200, .5)',
      mouseX: scene.mouseX,
      mouseY: scene.mouseY,
    })
    const particleObject_2 = new ParticleObject({ geometry: geometry_2, ctx })
    ps_2.addParticle(particleObject_2)
  }
  const attractPt = new InfiniteVortexAttractor({
    position: new p5.Vector(350, 350),
    threshold: 80,
    dis: 200,
    width: 30,
    height: 30,
    scene,
    fillCol : 'red',
    velocity: new p5.Vector(0, 0),
    acceleration: new p5.Vector(0, 0),
  })
  attractPt.lockPosition = true
  ps_2.addAttractor(new ParticleObject({
    geometry: attractPt,
    ctx,
  }))
}

scene.loop = function (ctx) {
  scene.clean()
  ps_1.update()
  ps_2.update()
}

scene.start()

var sketch = function (p){
  globalVar.width = Math.max(document.documentElement.clientWidth,960);
  globalVar.height = Math.max(document.documentElement.clientHeight,600);
  globalVar.pp = p;
  var nextPage,
    perPage;
  p.preload = function () {
    try{
      // p.soundFormats('wav', 'ogg');
      // globalVar.SOUNDFILE = p.loadSound('sound/water2.wav');
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
    // globalVar.displayArray.backgroundBall = [];
    // for(var i = 0; i < 100; i++){
    // 	var size = Math.random()*20 + 15;
    // 	// var optionsVO = {
    // 	// 	position : new p5.Vector((Math.random() * p.width - 100) + 50,(Math.random() * p.height - 60) + 30),
    // 	// 	width : size,
    // 	// 	height : size,
    // 	// 	p : globalVar.pp,
    // 	// 	fillCol : globalVar.pp.color(200,200,200,50)
    //   // };
    //   const geometry = new Geometry({
    //     position: new p5.Vector((Math.random() * p.width - 100) + 50,(Math.random() * p.height - 60) + 30),
    //     width: size,
    //     height: size,
    //     p: globalVar.pp,
    // 		fillCol : globalVar.pp.color(200,200,200,50)
    //   })
    // 	// var options = {
    // 	// 	visualObject : new VisualObject(optionsVO),
    // 	// 	p : globalVar.pp
    //   // };
    //   const particleObject = new ParticleObject({ geometry })
    // 	globalVar.displayArray.backgroundBall.push(particleObject);
    // }
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
    // for(var objType in globalVar.displayArray){
    // 	if (objType === "ButtonParticle"){
    // 		if (ButtonPlus.prototype.hoverObjCount > 0){    //假如没有button处于hover/click状态，则不进行排序，减少计算次数
    // 			resortButtonParticle(globalVar.displayArray);   //重新排序控制绘图顺序
    // 		}
    // 		ButtonPlus.pushMatrix(globalVar.pp);
    // 		globalVar.translate.x += (globalVar.transTarget.x - globalVar.translate.x) * 0.2;
    // 		globalVar.translate.y += (globalVar.transTarget.y - globalVar.translate.y) * 0.2;
    // 		ButtonPlus.translate(globalVar.translate.x, globalVar.translate.y, globalVar.pp);
    // 	}
    //
    // 	for(var i = 0, length = globalVar.displayArray[objType].length;i < length;i++){
    // 		globalVar.displayArray[objType][i].display();
    // 	}
    //
    // 	if (objType === "ButtonParticle") {
    // 		ButtonPlus.popMatrix(globalVar.pp);
    // 	}
    // }
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
      // globalVar.attractPtL.position.x = globalVar.width / 2 - 250;  //调整画布时,attractPtL与attractPtR也得更改位置
      // globalVar.attractPtR.position.x = globalVar.width / 2 + 250;
      // globalVar.attractPtL.position.y = globalVar.height * 0.6;
      // globalVar.attractPtR.position.y = globalVar.height * 0.6;
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
  var getInfo = require("./getInfo.js").default;
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
