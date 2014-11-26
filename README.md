# TiBrowser Widget [![Appcelerator Titanium](http://www-static.appcelerator.com/badges/titanium-git-badge-sq.png)](http://appcelerator.com/titanium/) [![Appcelerator Alloy](http://www-static.appcelerator.com/badges/alloy-git-badge-sq.png)](http://appcelerator.com/alloy/)
This is a widget for the [Alloy](http://projects.appcelerator.com/alloy/docs/Alloy-bootstrap/index.html) MVC framework of [Appcelerator](http://www.appcelerator.com)'s [Titanium](http://www.appcelerator.com/platform) platform.

It provides an in-app browser, with back, forward, and refresh buttons, and options to open the current page in the default browser, or copy the current url into the clipboard.

## Usage
#### In a view
```xml
<Alloy>
  <Widget id="browser" src="be.grincheux.tiBrowser" url="http://www.google.com" color="#f00" tintColor="#fff" autoOpen="true" />
</Alloy>
```
If *autoOpen* is omitted or *false*, don't forget to add the following code in your controller:
```javascript
$.browser.open();
```
#### In a controller
```javascript
Alloy.createWidget("be.grincheux.tiBrowser", {
  url: "http://google.com",
  color: Alloy.Globals.primary,
  tintColor: "#fff"
}).open();
```
Or you can set options after creating the widget if needed.
```javascript
var browser = Alloy.createWidget("be.grincheux.tiBrowser");
browser.setUrl("http://google.com");
browser.setColor("#f00");
browser.setTintColor("#fff");
browser.open();
```
## Available methods
### open()
Opens the browser window.
### setUrl (*string* url)
Sets the url for the loaded in the webview.
### setColor (*string* color)
Sets the main color of the browser (background color of the title bar, tint color of the toolbar).
### setTintColor (*string* color)
Sets the secondary color of the browser (tint color of the toolbar).

## Changelog
* 1.1: Added public methods
* 1.0: Inital commit
