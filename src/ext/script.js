import { UDES_Script } from "@udes-lib/web-ext"

const chunkId = "904245"

var UDES = new UDES_Script()

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

                    if (req.c[chunkId]) {
                        console.error(`[UDES] req.c['${chunkId}'] found:`, req.c[chunkId])
                        var f = req.c[chunkId].exports.Z
                        var oldSend = f.sendMessage

                        function send(e, t) {

                            UDES.encryptMessage(t.content, "secret", async (public_id, key, counter, error) => {

                                if (error) {
                                    alert("UDES error: " + error)
                                    return
                                }

                                t.content = await UDES.messageForm(public_id, key, counter)
                                oldSend(e, t)
                            })

                            console.error("[UDES] SEND MESSAGE", e, t)
                        }

                        f.sendMessage = send

                        console.error("[UDES] Loaded")
                    } else {
                        console.error(`[UDES] req.c['${chunkId}'] not found, req: `, req)
                    }
                }
            ]
        )
    }
}, 1)