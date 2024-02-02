const BASE_URL = "http://localhost:5000/api"

function randomKey(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for(var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function makeRequest(url, callback, options) {
    console.log("[UB] Request to", url)
    browser.runtime.sendMessage({ action: "makeRequest", url: url, options: options }, callback);
}

function encryptMessage(content, callback) {
    const key = randomKey(128)
    makeRequest(`${BASE_URL}/message/encrypt?content=${content}&key=${key}`, (res) => {
        if (!res.success) {
            alert(res.error)
            console.log("[UMES] encryptMessage error:", res.error)
            return
        }

        var encrypted = res.json.result

        makeRequest(`${BASE_URL}/message`, (res) => {
            if (!res.success) {
                alert(res.error)
                console.log("[UMES] encryptMessage error:", res.error)
                return
            }
            
            console.log("[UMES] callback:", res.error)
            callback(res.json.public_id, key)
        }, {
            "method": "POST",
            "body": {
                "content": encrypted
            }
        })
    })
}

function handleFromWeb(event) {
    console.log("[UMES] handleFromWeb:", event.data)
    if (event.data.event_type == "encrypt_message") {
        encryptMessage(event.data.content, (public_id, key) => {
            event.source.postMessage(
                {
                    event_type: "update_message",
                    public_id: public_id,
                    key: key,
                    nonce: event.data.nonce
                },
                event.origin,
            );
        })
    }
};

window.addEventListener('message', handleFromWeb);

function injectScript(file_path, tag) {
    if (document.getElementById("[UMES]script")) {
        location.reload()
    }

    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    script.setAttribute('id', '[UMES]script')
    node.appendChild(script);
}

injectScript(browser.extension.getURL('web_accessible_resources.js'), 'body');

var currentMessagesContainer = undefined;

function tryDecodeMessage(contentContainer) {
    try {
        var content = ""

        Array.from(contentContainer.querySelectorAll("span")).forEach((text) => {
            content += text.textContent
        })
        console.log(`[UMES] Found content: ${content}`)

        if (!content.startsWith("[UMES]")) {
            return
        }

        var content = content.replace("[UMES]", "")
        var public_id = content.split(":")[0]
        var key = content.split(":")[1]

        makeRequest(`${BASE_URL}/message?public_id=${public_id}`, (res) => {
            if (!res.success) {
                console.error("[UMES] Get message error:", res.error)
                return
            }

            makeRequest(`${BASE_URL}/message/decrypt?content=${res.json.content}&key=${key}`, (res) => {
                if (!res.success) {
                    console.error("[UMES] Decrypt message error:", res.error)
                    return
                }

                var decoded = res.json.result

                var span = document.createElement("span")
                span.textContent = decoded
        
                contentContainer.innerHTML = ""
                contentContainer.appendChild(span)
        
                console.log(`[UMES] Decoded content: ${decoded}`)
            })
        })
    } catch (e) {
        console.error("[UB]", e)
    }
}

function handleMutation(mutationsList) {
    mutationsList.forEach(function (mutation) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function (node) {
                tryDecodeMessage(node.querySelector("div > div > div"))
            });
        }
    });
}

function allMessages() {
    Array.from(currentMessagesContainer.children).forEach((message) => {
        if (message.nodeName == "LI") {
            tryDecodeMessage(message.querySelector("div > div > div"))
        }
    })
}

function waitForObject() {
    var intervalId = setInterval(function () {

        console.log("CHECK");
        var parentDiv = document.querySelector('.scrollerInner__059a5');

        if (parentDiv && parentDiv != currentMessagesContainer) {
            console.log("FOUND");

            currentMessagesContainer = parentDiv

            allMessages()

            var observer = new MutationObserver(handleMutation);

            var observerConfig = { childList: true };

            observer.observe(parentDiv, observerConfig);
        }

    }, 1000);
}

console.log("WAITING");
waitForObject();