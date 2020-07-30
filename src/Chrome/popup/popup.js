function listenForClicks() {
    document.addEventListener("click", function(e) {
        removeActiveClass()
        if (e.target.classList.contains("filter")) {
            e.target.classList.add("active")
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, getIconClass)
        } else if (e.target.classList.contains("reset")) {
            e.target.classList.add("active")
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, reset)
        }
        saveOptions()
        function getIconClass(tabs) {
            let iconClass = e.target.id
            chrome.tabs.sendMessage(tabs[0].id, {
                command: "service",
                passedValue: iconClass
            })
        }
        function reset(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                command: "reset",
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
    chrome.storage.local.set({
        active_id: document.getElementsByClassName("active")[0].id
    })
}
function restoreOptions() {
    function setCurrent(result) {
        let activeFilter = document.getElementById(result.active_id)
        if (activeFilter) { activeFilter.classList.add("active") }
    }
    chrome.storage.local.get("active_id", setCurrent)
}

document.addEventListener("DOMContentLoaded", restoreOptions)

chrome.tabs.executeScript({
    file: "/content_scripts/filter.js"
}, listenForClicks)
