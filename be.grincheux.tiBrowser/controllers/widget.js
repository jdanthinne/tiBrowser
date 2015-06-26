var args = arguments[0] || {};

var history = [];
var history_position = -1;
var browsing_direction = "";
var loadedTimeout;
if (OS_ANDROID) {
	var menu;
	var backMenu;
	var forwardMenu;
	var refreshMenu;
}

// Apply arguments
if (typeof args.url != "undefined" && args.url != "") setUrl(args.url);
if (typeof args.color != "undefined" && args.color != "") setColor(args.color);
if (typeof args.titleColor != "undefined" && args.titleColor != "") setTitleColor(args.titleColor);
if (typeof args.tintColor != "undefined" && args.tintColor != "") {
	setTintColor(args.tintColor);
	if (typeof args.toolbarTintColor == "undefined") setToolbarTintColor(args.tintColor);
}
if (typeof args.toolbarTintColor != "undefined" && args.toolbarTintColor != "") setToolbarTintColor(args.toolbarTintColor);
if (typeof args.autoOpen != "undefined" && args.autoOpen) open();

// History & Navigation handler
function pageLoaded() {
	if (typeof loadedTimeout == "number") clearTimeout(loadedTimeout);
	loadedTimeout = setTimeout(doLoaded, 500); // Set a timeout so redirects are not taken into account.
}
function doLoaded() {
	$.showActions.enabled = true;
	if (browsing_direction == ""
	&& $.webView.url != history[history_position]
	&& $.webView.evalJS("document.querySelector('body').innerHTML").length) { // Update history only if a link has been clicked, not on back, previous or refresh action.
		history_position++;
		history.length = history_position; // Trim the array because a new link cancels all following history.
		history.push($.webView.url);
	}
	var pageTitle = $.webView.evalJS("document.title");
	if (pageTitle != '') $.win.title = pageTitle; // Set the window title according to the html <title> tag.
	checkPrevPage();
	checkNextPage();
	setRefresh(true);
	browsing_direction = "";
}

// Navigation
function prevPage() {
	browsing_direction = "prev";
	setRefresh(false);
	history_position--;
	if (history_position < 0) history_position = 0;
	checkPrevPage();
	$.webView.url = history[history_position];
}

function nextPage() {
	browsing_direction = "prev";
	setRefresh(false);
	history_position++;
	if (1 + history_position >= history.length) history_position = history.length - 1;
	checkNextPage();
	$.webView.url = history[history_position];
}

function refreshPage() {
	browsing_direction = "refresh";
	setRefresh(false);
	$.webView.reload();
}

function checkPrevPage() {
	if (history_position > 0) {
		if (OS_IOS) $.prevPage.enabled = true;
		if (OS_ANDROID) {
			backMenu.enabled = true;
			backMenu.icon = WPATH("images/ic_arrow_back_grey600_36dp.png");
		}
	} else {
		if (OS_IOS) $.prevPage.enabled = false;
		if (OS_ANDROID) {
			backMenu.enabled = false;
			backMenu.icon = WPATH("images/ic_arrow_back_black_36dp.png");
		}
	}
}

function checkNextPage() {
	if (1 + history_position < history.length) {
		if (OS_IOS) $.nextPage.enabled = true;
		if (OS_ANDROID) {
			forwardMenu.enabled = true;
			forwardMenu.icon = WPATH("images/ic_arrow_forward_grey600_36dp.png");
		}
	} else {
		if (OS_IOS) $.nextPage.enabled = false;
		if (OS_ANDROID) {
			forwardMenu.enabled = false;
			forwardMenu.icon = WPATH("images/ic_arrow_forward_black_36dp.png");
		}
	}
}

function setRefresh(enabled) {
	if (OS_IOS) $.refreshPage.enabled = enabled;
	if (OS_ANDROID) {
		refreshMenu.enabled = enabled;
		if (enabled) {
			refreshMenu.icon = WPATH("images/ic_refresh_grey600_36dp.png");
		} else {
			refreshMenu.icon = WPATH("images/ic_refresh_black_36dp.png");
		}
	}
}

// Actions
function showDialog() {
	$.dialog.show();
}
function actions(e) {
	switch(e.index) {
		case 0:
			openBrowser();
			break;
		case 1:
			copyLink();
			break;
	}
}
function openBrowser() {
	Ti.Platform.openURL($.webView.url);
}
function copyLink() {
	Ti.UI.Clipboard.setText($.webView.url);
}

// Public methods
function setUrl(url) {
	$.webView.url = url;
}
exports.setUrl = setUrl;

function setColor(color) {
	if (OS_IOS) {
		$.navWin.applyProperties({
			backgroundColor: color,
			barColor: color
		});
	}
	$.win.barColor = color;
}
exports.setColor = setColor;

function setTitleColor(color) {
	if (OS_IOS) $.win.setTitleAttributes({color: color});
}
exports.setTitleColor = setTitleColor;

function setTintColor(color) {
	if (OS_IOS) $.navWin.tintColor = color;
}
exports.setTintColor = setTintColor;

function setToolbarTintColor(color) {
	if (OS_IOS) $.toolbar.tintColor = color;
}
exports.setToolbarTintColor = setToolbarTintColor;

function open() {
	if (OS_IOS) $.navWin.open({modal: true});
	if (OS_ANDROID) $.win.open({modal: true});
}
exports.open = open;

// Events
function initWin() {
	$.win.activity.invalidateOptionsMenu();
	$.win.activity.onPrepareOptionsMenu = function(e) {
		menu = e.menu;
		backMenu = menu.findItem("1");
		forwardMenu = menu.findItem("2");
		refreshMenu = menu.findItem("3");
	};
}

function closeWin() {
	if (OS_IOS) $.navWin.close();
	if (OS_ANDROID) $.win.close();
}

if (OS_IOS) {
	$.navWin.addEventListener("close", function() { $.destroy();});
	$.navWin.addEventListener("open", function() { 
		$.prevPage.image = WPATH("images/765-arrow-left-toolbar.png");
		$.nextPage.image = WPATH("images/766-arrow-right-toolbar.png");
		$.refreshPage.image = WPATH("images/713-refresh-1-toolbar.png");
	});
}
if (OS_ANDROID) $.win.addEventListener("close", function() { $.destroy();});