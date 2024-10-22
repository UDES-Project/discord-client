import { UDES_Script } from "@udes-lib/web-ext"

var UDES = new UDES_Script()

// WebSocket.prototype._send = WebSocket.prototype.send

// WebSocket.prototype.send = function(payload) {
//     payload = JSON.parse(payload)

//     if (payload.event == "message" && payload.data.content) {

//         UDES.encryptMessage(payload.data.content, "secret", async (pUDESlic_id, key, counter, error) => {

//             if (error) {
//                 alert("UDES error: " + error)
//                 return
//             }

//             payload.data.content = await UDES.messageForm(pUDESlic_id, key, counter)
//             this._send(JSON.stringify(payload))
//         })

//     } else {
//         this._send(JSON.stringify(payload))
//     }
// }

const waitFor = setInterval(() => {
    console.error("[UDES] webpackChunkdiscord_app:", window.webpackChunkdiscord_app)
    if (window.webpackChunkdiscord_app) {
        console.error("[UDES] webpackChunkdiscord_app found !", window.webpackChunkdiscord_app)
        clearInterval(waitFor)
        window.webpackChunkdiscord_app.push(
            [
                [Math.random()],
                {},
                async (req) => {

                    if (!req.c) {
                        console.error("[UDES] req.c not found, req: ", req)
                        return
                    }

                    console.error("[UDES] Loading...")

                    if (req.c["904245"]) {
                        console.error("[UDES] req.c['904245'] found:", req.c['904245'])
                        var f = req.c["904245"].exports.Z
                        var oldSend = f.sendMessage

                        function send(e, t) {

                            UDES.encryptMessage(t.content, "secret", async (pUDESlic_id, key, counter, error) => {

                                if (error) {
                                    alert("UDES error: " + error)
                                    return
                                }

                                t.content = await UDES.messageForm(pUDESlic_id, key, counter)
                                oldSend(e, t)
                            })

                            console.error("[UDES] SEND MESSAGE", e, t)
                        }

                        f.sendMessage = send

                        console.error("[UDES] Loaded")
                    } else {
                        console.error("[UDES] req.c['819689'] not found, req: ", req)
                    }
                }
            ]
        )
    }
}, 1)