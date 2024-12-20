import { UDES_ContentScript } from "@udes-lib/web-ext"

(async () => {

    var settings = await browser.runtime.sendMessage("extension@udes.app", { action: "UDES_getSettings" })
    
    var UDES = new UDES_ContentScript(settings["UDES_serverUrl"], true)

    UDES.setMessageContainer(".scrollerInner_e2e187", ".messageContent_f9f2ca span", (messages) => {
        var content = ""
        Array.from(messages).forEach((text) => {
            content += text.textContent
        })
        
        console.log("UDES", content)

        if (UDES.isUDESMessage(content)) {
            UDES.decryptMessage(content, "secret", (decrypted) => {
                console.log("UDES decrypted", decrypted)
                Array.from(messages).forEach((text) => {
                    text.textContent = ""
                })
                messages[0].textContent = decrypted
            })
        }
    }, true)

    UDES.injectScript("script.js", "body")
})()