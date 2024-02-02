browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "makeRequest") {
        makeRequest(request.url, sendResponse, request.options);
        return true;
    }
});

function makeRequest(url, sendResponse, options) {
    try {
        options = options || {}
        var xhr = new XMLHttpRequest();
        xhr.open(options.method || "GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    sendResponse({ success: true, json: JSON.parse(xhr.responseText) });
                } else {
                    sendResponse({ success: false, error: xhr.statusText });
                }
            }
        };
        const data = typeof options.body == "object" ? JSON.stringify(options.body) : options.body
        console.log("[UB] Request data:", options, data)
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
    } catch (e) {
        console.error("[UB]", e)
        sendResponse({ success: false, error: e });
    }
}
