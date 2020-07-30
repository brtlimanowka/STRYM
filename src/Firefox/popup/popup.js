function listenForClicks() {
    document.addEventListener("click", function(e) {
        removeActiveClass()
        if (e.target.classList.contains("filter")) {
            e.target.classList.add("active")
            browser.tabs.query({
                active: true,
                currentWindow: true
            }).then(getIconClass)
        } else if (e.target.classList.contains("reset")) {
            e.target.classList.add("active")
            browser.tabs.query({
                active: true,
                currentWindow: true
            }).then(reset)
        }
        saveOptions()
        function getIconClass(tabs) {
            let iconClass = e.target.id
            browser.tabs.sendMessage(tabs[0].id, {
                command: "service",
                passedValue: iconClass
            })
        }
        function reset(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "reset"
            })
        }
        function removeActiveClass() {
            let activeButtons = document.getElementsByClassName("filter")
            for (let _ of activeButtons) {
                _.classList.remove("active")
            }
        }
    })
}
function saveOptions() {
    browser.storage.local.set({
        active_id: document.getElementsByClassName("active")[0].id
    })
}
function restoreOptions() {
    function setCurrent(result) {
        let activeFilter = document.getElementById(result.active_id)
        if (activeFilter) { activeFilter.classList.add("active") }
    }
    var getting = browser.storage.local.get("active_id")
    if (getting) { getting.then(setCurrent) }
}
document.addEventListener("DOMContentLoaded", restoreOptions)
browser.tabs.executeScript({
    file: "/content_scripts/filter.js"
}).then(listenForClicks)
