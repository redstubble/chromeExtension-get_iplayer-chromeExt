
function click(e) {
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
		var specTab = tabs[0];
		chrome.tabs.insertCSS(specTab.id, {file: "styles.css"});
		chrome.tabs.executeScript(specTab.id, {file: "script.js"});
	})
	
}

chrome.browserAction.onClicked.addListener(click);