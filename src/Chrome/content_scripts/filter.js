(function() {
  let rows = document.getElementsByTagName("tr")
  if (window.hasRun) {
    return
  }
  window.hasRun = true;
  function applyFilter(iconClass) {
    if (document.URL.includes("customchart") || document.URL.includes("charts")) {
      showAllRows()
      let streamingService = document.getElementsByClassName(iconClass)
      for (let row of rows) {
        row.hidden = true
      }
      for (let instance of streamingService) {
        instance.parentElement.parentElement.parentElement.parentElement.hidden = false
        if (document.URL.includes("charts")) {
          for (let row of rows) {
            if (row.childElementCount === 1) {
              row.hidden = false
            }
          }
        }
      }
    }
    saveOptionsFilter(iconClass);
  }
  function showAllRows() {
    for (let row of rows) {
      row.hidden = false
    }
  }
  function saveOptionsFilter(iconClass) {
    chrome.storage.local.set({
      active_class: iconClass
    })
  }
  (function restoreOptionsFilter() {
    function setCurrentFilter(result) {
      if (result.active_class) {
        applyFilter(result.active_class)
      }
    }
    chrome.storage.local.get("active_class", setCurrentFilter)
  })()
  chrome.runtime.onMessage.addListener(message => {
    if (message.command === "service") {
      applyFilter(message.passedValue)
    } else if (message.command === "reset") {
      chrome.storage.local.clear()
      showAllRows()
    }
  })
})()
