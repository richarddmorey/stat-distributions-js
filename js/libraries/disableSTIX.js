MathJax.Hub.Register.LoadHook("[MathJax]/jax/output/HTML-CSS/fonts/STIX/fontdata.js", function () {
  var HTMLCSS = MathJax.OutputJax["HTML-CSS"];

  MathJax.Hub.Browser.Select({
    Safari: function (browser) {
      browser.STIXfontBug = browser.versionAtLeast("5.1") && browser.isMac;
    },
    Chrome: function (browser) {
      var match = navigator.appVersion.match(/AppleWebKit\/(\d+)/);
      if (match && parseInt(match[1]) > 534) {browser.STIXfontBug = true}
    }
  });
  if (MathJax.Hub.Browser.STIXfontBug) {
    HTMLCSS.FONTDATA.FONTS["STIXGeneral"].family = "STIXGeneral-Regular";
    HTMLCSS.FONTDATA.FONTS["STIXGeneral-italic"].family = "STIXGeneral-Italic";
    delete HTMLCSS.FONTDATA.FONTS["STIXGeneral-italic"].style;
  }
});