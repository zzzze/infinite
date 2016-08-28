
var eventHandleFunc = require("./EventHandleFunc.js");
var util = require("./util.js");
var globalVar = require("./GlobalVar.js");
var ButtonParticle = require("./ButtonParticle.js");
var ButtonPlus = require("./ButtonPlus.js");

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