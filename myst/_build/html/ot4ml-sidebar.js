(function () {
  var openedForPath = null;
  var scheduled = false;

  function openChaptersFolder() {
    scheduled = false;
    var path = window.location.pathname;
    if (openedForPath === path) return;

    var labels = document.querySelectorAll('.myst-primary-sidebar [title="Chapters"]');
    for (var i = 0; i < labels.length; i += 1) {
      var row = labels[i].closest('.myst-toc-item');
      var button = row && row.querySelector('button[aria-expanded="false"]');
      if (button) {
        button.click();
        openedForPath = path;
        return;
      }
      if (row && row.querySelector('button[aria-expanded="true"]')) {
        openedForPath = path;
        return;
      }
    }
  }

  function scheduleOpen() {
    if (scheduled) return;
    scheduled = true;
    window.setTimeout(openChaptersFolder, 0);
    window.setTimeout(openChaptersFolder, 150);
    window.setTimeout(openChaptersFolder, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleOpen, { once: true });
  } else {
    scheduleOpen();
  }

  var lastPath = window.location.pathname;
  var observer = new MutationObserver(function () {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      openedForPath = null;
    }
    scheduleOpen();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
