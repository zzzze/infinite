/**
 * 定义与Button绑定的事件处理程序
 */
var util = require("./util.js");
var globalVar = require("./GlobalVar.js");
var getPostContent = require("./getPostContent.js");

var eventHandleFunc = {
    clicked_animation : function (event){
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
        
        event.target.p.stroke('gray');
        event.target.p.strokeWeight(1);
        if(event.target.clickTimeline < 100){
            event.target.p.line(event.target.position.x, event.target.position.y + event.target.width / 2, event.target.position.x, Math.max(event.target.position.y + 15 * event.target.clickTimeline, event.target.position.y + event.target.width / 2));
        }else{
            event.target.p.line(event.target.position.x, event.target.position.y + event.target.width / 2, event.target.position.x, event.target.position.y + 1500);
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
            // var sketch = document.getElementById("sketch");
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
        var sketch = document.getElementById("sketch");

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

        infoFrame.appendChild(introduction);
        infoFrame.appendChild(postContent);
        doc.body.appendChild(infoFrame);

        $("#infoFrame").css("display", "none");
        $("#infoFrame").fadeIn();
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