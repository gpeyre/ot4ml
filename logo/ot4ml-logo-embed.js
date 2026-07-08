(function initOT4MLLogoEmbed(global) {
  "use strict";

  var scriptEl = document.currentScript;
  var scriptUrl = scriptEl && scriptEl.src ? scriptEl.src : window.location.href;
  var styleId = "ot4ml-logo-embed-style";

  function toElement(target) {
    if (typeof target === "string") return document.querySelector(target);
    return target;
  }

  function resolveUrl(path) {
    return new URL(path, scriptUrl).toString();
  }

  function cssSize(value) {
    if (value == null) return "";
    return typeof value === "number" ? value + "px" : String(value);
  }

  function ensureStyles() {
    if (document.getElementById(styleId)) return;
    var style = document.createElement("style");
    style.id = styleId;
    style.textContent = [
      ".ot4ml-logo-embed{width:100%;margin:0 auto;}",
      ".ot4ml-logo-embed__frame{display:block;width:100%;height:100%;border:0;background:transparent;overflow:hidden;}",
      ".ot4ml-logo-embed--center{margin-left:auto;margin-right:auto;}"
    ].join("");
    document.head.appendChild(style);
  }

  function defaultHeight(width, strip) {
    if (strip) return Math.ceil(0.205 * width + 48);
    if (width < 520) return Math.ceil(5 * width + 205);
    if (width < 950) return Math.ceil(1.5 * width + 125);
    return Math.ceil(0.22 * width + 42);
  }

  function createOT4MLLogo(target, options) {
    var mount = toElement(target);
    var opts = options || {};
    if (!mount) throw new Error("OT4MLLogo.create: target element not found");

    ensureStyles();

    var wrapper = document.createElement("div");
    var iframe = document.createElement("iframe");
    var src = opts.src || "interactive.html?embed=1";
    var minHeight = opts.minHeight == null ? 220 : opts.minHeight;
    var maxHeight = opts.maxHeight == null ? Infinity : opts.maxHeight;
    var strip = opts.layout === "strip" || /(?:[?&])strip(?:=1)?(?:&|$)/.test(src);

    wrapper.className = "ot4ml-logo-embed ot4ml-logo-embed--center";
    if (opts.className) wrapper.className += " " + opts.className;
    if (opts.maxWidth != null) wrapper.style.maxWidth = cssSize(opts.maxWidth);
    if (opts.width != null) wrapper.style.width = cssSize(opts.width);

    iframe.className = "ot4ml-logo-embed__frame";
    iframe.title = opts.title || "OT4ML interactive logo";
    iframe.src = resolveUrl(src);
    iframe.loading = opts.loading || "eager";
    iframe.allowTransparency = "true";
    iframe.setAttribute("scrolling", "no");

    wrapper.appendChild(iframe);
    if (opts.replace === false) {
      mount.appendChild(wrapper);
    } else {
      mount.replaceChildren(wrapper);
    }

    function resize() {
      var width = wrapper.clientWidth || mount.clientWidth || 960;
      var height = opts.height == null ? defaultHeight(width, strip) : opts.height;
      height = Math.max(minHeight, Math.min(maxHeight, height));
      wrapper.style.height = Math.ceil(height) + "px";
    }

    var observer = null;
    if ("ResizeObserver" in global) {
      observer = new ResizeObserver(resize);
      observer.observe(wrapper);
      observer.observe(mount);
    } else {
      global.addEventListener("resize", resize);
    }
    resize();

    return {
      element: wrapper,
      iframe: iframe,
      resize: resize,
      destroy: function destroy() {
        if (observer) observer.disconnect();
        else global.removeEventListener("resize", resize);
        wrapper.remove();
      }
    };
  }

  global.OT4MLLogo = {
    create: createOT4MLLogo,
    mount: createOT4MLLogo
  };
  global.createOT4MLLogo = createOT4MLLogo;
})(window);
