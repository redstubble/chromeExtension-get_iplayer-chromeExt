 window.clicks = 0;

 function handler(e) {
 	window.clicks = 0;
	var radios = document.getElementsByName('bbcFormat');
	var value = (function(){
		var value;
		for (var i = 0, length = radios.length; i < length; i++) {
			if (radios[i].checked) {
		   		//	 do whatever you want with the checked radio
			    return  (radios[i].value);
			    // only one radio can be logically checked, don't check the rest
			    break;
			}
		}
	});
	clearText(value() + " ");
}

function newElem(el, attrs) {
	temp = document.createElement(el);
	for(var key in attrs) {
		temp.setAttribute(key, attrs[key]);
	}
	return temp;
}

function absolutePath(href) {
    var link = document.createElement("a");
    link.href = href;
    return (link.protocol+"//"+link.host+link.pathname+link.search+link.hash);
}


function animate(elem,style,unit,from,to,time) {
    if( !elem) return;
    var start = new Date().getTime(),
        timer = setInterval(function() {
            var step = Math.min(1,(new Date().getTime()-start)/time);
            elem.style[style] = (from+step*(to-from))+unit;
            if( step == 1) clearInterval(timer);
        },25);
    elem.style[style] = from+unit;
}

function getRadioBtnValue() {
	var radios = document.getElementsByName('bbcFormat');
	btnValue = function(){
		for (var i = 0, length = radios.length; i < length; i++) {
			if (radios[i].checked) {
			    return (radios[i].value);
			    break;
			}
		};
	}
	alert(btnValue);
}


function init() {
	console.log("Content Script (script.js) : init()");

	if (document.body.firstChild.nodeType == 1 && document.body.firstChild.getAttribute("id") == "content")
		return;


	var content = newElem("div", {"id": "content"});
	while (document.body.firstChild) {
		var child = document.body.removeChild(document.body.firstChild);
		content.appendChild(child);
	}
	document.body.appendChild(content);
	
	var slider = newElem("div", {"id": "viewport", "class": "slider"});
	document.body.appendChild(slider);

	var sliderWrapper = newElem("div", {"class": "sliderWrapper"});
	slider.appendChild(sliderWrapper);

	var h = newElem("H2", {"class": "title"});
	var t = document.createTextNode("BBC Command Line Tool");
	h.appendChild(t); 
	sliderWrapper.appendChild(h);

	var btnWrapper = newElem("div", {"class": "btnWrapper"});
	slider.appendChild(sliderWrapper);   

	var radioBtnBbcR = document.createElement("input");
    radioBtnBbcR.type = "radio";
    radioBtnBbcR.name = "bbcFormat";
    radioBtnBbcR.value = "bbcr";
    radioBtnBbcR.addEventListener("click", handler);
    var label = newElem("label", {"class": "text"});
    label.innerHTML = "BBC Radio";
    label.appendChild(radioBtnBbcR);
	btnWrapper.appendChild(label); 

    var radioBtnBbcT = document.createElement("input");
    radioBtnBbcT.type = "radio";
    radioBtnBbcT.name = "bbcFormat";
    radioBtnBbcT.value = "bbc";
    radioBtnBbcT.addEventListener("click", handler);
    var labelWater = newElem("label", {"class": "text"});
    labelWater.innerHTML = "BBC TV";
    labelWater.appendChild(radioBtnBbcT);
    btnWrapper.appendChild(labelWater);
    sliderWrapper.appendChild(btnWrapper);

	var input = document.createElement('textarea');
	input.type = "text";
	sliderWrapper.appendChild(input);
	input.className = "textBox";
	chrome.storage.local.get("cmd", function (result) {
		if (typeof result != 'undefined') {
			input.value = result.cmd;
			if (result.cmd.length > 6) window.clicks = 1;
		}
		else
			input.value = "bbc ";
    });
	input.rows = 10;

	window.recordBtn = newElem("Button", {"class": "btn green"});
	recordBtn.innerHTML = "Record";
	sliderWrapper.appendChild(recordBtn);
	recordBtn.addEventListener("click", toggleRecordLinkBtn)

// slider.style.width = 500
animate(slider,"width","%",0,30,1000);
animate(content, "width", "%", 100, 70, 1000)
}

function clearText(msg) {
	var input = document.getElementsByClassName("textBox")[0];
	input.value = msg;
}

function setText(msg) {
	var input = document.getElementsByClassName("textBox")[0];
	input.value = input.value + msg;
	// Save it using the Chrome extension storage API.
    chrome.storage.local.set({"cmd": input.value}, function() {
	// Notify that we saved.
	console.log('Settings saved');
	});  


}

function toggleRecordLinkBtn(e) {
	if (e.target.innerHTML == "Record")
	{
		e.target.innerHTML = "Stop"
		recordLinkClicks(true);
	}
	else {
		e.target.innerHTML = "Record"
		recordLinkClicks(false);
	}
}

function recordLinkClicks(bool) {
	var anchors = document.getElementsByTagName("a");
	for(var z = 0; z < anchors.length; z++){
	    if (bool) anchors[z].addEventListener("click", getLinkData);
	    else anchors[z].removeEventListener("click", getLinkData);
	}
}
function getLinkData(e) {
	path = (absolutePath(this.getAttribute("href")));
	window.clicks++;
	path = (clicks == 1) ? path : "," + path
	setText(path);
	e.preventDefault();
}

// TODO Build Function That Turns Off Recording Links
// TODO Save Links to Storage Component
// TODO Build Native Messaging To Allow to Run Command Directly In Linux



init();

