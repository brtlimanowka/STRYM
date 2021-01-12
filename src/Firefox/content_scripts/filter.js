(function() {
  let rows = document.querySelectorAll(".topcharts_itembox.chart_item_release")
  if (window.hasRun) {
    return
  }
  window.hasRun = true;
  function applyFilter(iconClass) {
    if (document.URL.includes("customchart") || document.URL.includes("charts")) {
      showAllRows()
      let streamingService = document.getElementsByClassName(iconClass)
      for (let row of rows) {
        row.style.display = "none"
      }
      for (let instance of streamingService) {
        instance.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = ""
        if (document.URL.includes("charts")) {
          for (let row of rows) {
            if (row.childElementCount === 1) {
              row.style.display = ""
            }
          }
        }
      }
    }
    saveOptionsFilter(iconClass);
  }
  function showAllRows() {
    for (let row of rows) {
      row.style.display = ""
    }
  }
  function saveOptionsFilter(iconClass) {
    browser.storage.local.set({
      active_class: iconClass
    })
  }
  (function restoreOptionsFilter() {
    function setCurrentFilter(result) {
      if (result.active_class) {
        applyFilter(result.active_class)
      }
    }
    var getting_filter = browser.storage.local.get("active_class")
    if (getting_filter) { getting_filter.then(setCurrentFilter) }
  })()
  browser.runtime.onMessage.addListener(message => {
    if (message.command === "service") {
      applyFilter(message.passedValue)
    } else if (message.command === "reset") {
      browser.storage.local.clear()
      showAllRows()
    }
  })
})()
