var callbacks = {}

function load() {
    const waitFor = setInterval(() => {
        console.log("[UB] webpackChunkdiscord_app:", window.webpackChunkdiscord_app)
        if (window.webpackChunkdiscord_app) {
            console.log("[UB] webpackChunkdiscord_app found !", window.webpackChunkdiscord_app)
            clearInterval(waitFor)
            window.webpackChunkdiscord_app.push(
                [
                    [Math.random()],
                    {},
                    (req) => {

                        if (!req.c) {
                            return
                        }

                        console.log("[UB] Loading...")

                        if (req.c["819689"]) {
                            console.log("[UB] req.c['819689'] found:", req.c['819689'])
                            var f = req.c["819689"].exports.default
                            var oldSend = f.sendMessage

                            function send(e, t) {

                                callbacks[e] = (public_id, key) => {
                                    t.content = `[UMES]${public_id}:${key}`
                                    oldSend(e, t)
                                }

                                window.postMessage(JSON.parse(JSON.stringify({
                                    from: 'web_accessible_resources.js',
                                    event_type: "encrypt_message",
                                    content: t.content,
                                    nonce: e
                                })))

                                console.log("[UB] SEND MESSAGE", e, t)
                            }

                            f.sendMessage = send

                            console.log("[UB] Loaded")
                        } else {
                            console.log("[UB] req.c['819689'] not found, req: ", req)
                        }
                    }
                ]
            )
        }
    }, 1)
}

window.addEventListener(
    "message",
    (event) => {
        console.log("[UMES] message: ", event)

        if (event.data.event_type == "update_message") {
            var callback = callbacks[event.data.nonce]
    
            if (callback) {
                callback(event.data.public_id, event.data.key)

                delete callbacks[event.data.nonce]
            }
        }
    },
    false
);

load()