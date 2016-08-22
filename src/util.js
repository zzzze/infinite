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





