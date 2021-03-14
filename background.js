CmdUtils.deblog("UbiquityWE v" + CmdUtils.VERSION + " background script says hello");

Utils.initSettingsDB(() => {
    Utils.getPref("enableMoreCommands", enableMoreCommands => {
    Utils.getPref("scrapyardPresents", scrapyardPresents => {

        if (enableMoreCommands) {
            for (let cmd of CmdUtils.CommandList)
                if (cmd.builtIn && cmd._namespace === NS_MORE_COMMANDS)
                    cmd._hidden = false;
            CmdUtils.MORE_COMMANDS = true;
        }
        else
            CmdUtils.CommandList = CmdUtils.CommandList.filter(cmd => !(cmd.builtIn && cmd._namespace === NS_MORE_COMMANDS));

        if (!scrapyardPresents)
            CmdUtils.CommandList = CmdUtils.CommandList.filter(cmd => !(cmd.builtIn && cmd._namespace === "Scrapyard"));

        Utils.getPref("debugMode", debugMode => {
            CmdUtils.DEBUG = !!debugMode;
            CmdUtils.CommandList = CmdUtils.CommandList.filter(cmd => CmdUtils.DEBUG || !cmd._hidden);
            CmdUtils.loadCustomScripts(() => {
                Utils.getPref("disabledCommands", disabledCommands => {
                    if (disabledCommands)
                        for (let cmd of CmdUtils.CommandList) {
                            if (cmd.name in disabledCommands)
                                cmd.disabled = true;
                        }

                    for (cmd of CmdUtils.CommandList) {
                        try {
                            if (cmd.init) {
                                Utils.callPersistent(cmd.uuid, cmd, cmd.init);
                            }
                        }
                        catch (e) {
                            console.log(e.message);
                        }
                    }
                });
            });
        });
    });
    });
});

Utils.getPref("maxSuggestions", maxSuggestions => CmdUtils.maxSuggestions = maxSuggestions || 5);
Utils.getPref("rememberContextMenuCommands", rememberContextMenuCommands =>
    CmdUtils.rememberContextMenuCommands = rememberContextMenuCommands);

chrome.i18n.getAcceptLanguages(ll => CmdUtils.acceptLanguages = ll);

Utils.getPref("lingvoApiKey", lingvoApiKey => {
    if (!lingvoApiKey) {
        CmdUtils.lingvoApiKey = "NGNmNTVlNzUtNzg2MS00ZWE1LWIzNWItNjNlMTAyZTM5YmRlOmM3NTg3MDY2Y2MyMDQxY2E4NTQ0MDZhOTQyYTcxMTk2";
        Utils.setPref("lingvoApiKey", CmdUtils.lingvoApiKey)
    }
    else {
        CmdUtils.lingvoApiKey = lingvoApiKey;
    }
});

Utils.getPref("microsoftTranslatorAPIKey", microsoftTranslatorAPIKey => {
    CmdUtils.microsoftTranslatorAPIKey = microsoftTranslatorAPIKey;
});

// Parser2 still depends on this
Utils.getPref("suggestionMemory", suggestionMemory => {
    Utils.suggestionMemory = suggestionMemory || {__proto__: null};
});

Utils.getPref("contextMenuCommands", contextMenuCommands => {
    if (contextMenuCommands)
        CmdUtils.ContextMenuCommands = contextMenuCommands;
    CmdUtils.createContextMenu();
});

Utils.getPref("enableOriginalParser", enableOriginalParser => {
    CmdUtils.parserVersion = enableOriginalParser? 2: 3;
});

// setup selection event sink
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (CmdUtils.DEBUG) {
        //console.log("got message: ", request.message, request.data, request.event );
        //CmdUtils.notify(request.data, request.message+" / "+request.event );
    }
    switch (request.message) {
        case 'selection':
            CmdUtils.selectedText = request.data.text || "";
            CmdUtils.selectedHtml = request.data.html || "";
            break;

        default:
            sendResponse({data: 'Invalid arguments'});
            break;
    }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    //if (CmdUtils.DEBUG) if (tab) console.log("onUpdated", tab.url);
    CmdUtils.updateActiveTab();
});

chrome.tabs.onActivated.addListener(function (actInfo) {
    //if (CmdUtils.DEBUG) console.log("onActivated", actInfo);
    CmdUtils.updateActiveTab();
});

chrome.tabs.onHighlighted.addListener(function (higInfo) {
    //if (CmdUtils.DEBUG) console.log("onHighlighted", higInfo);
    CmdUtils.updateActiveTab();
});

// Scrapyard integration
Utils.getPref("scrapyardID", scrapyardID => {
    if (scrapyardID)
        CmdUtils.SCRAPYARD_ID = scrapyardID;

    chrome.management.onInstalled.addListener((info) => {
        if (info.id === CmdUtils.SCRAPYARD_ID)
            Utils.setPref("scrapyardPresents", true, () => chrome.runtime.reload());
    });

    chrome.management.onUninstalled.addListener((info) => {
        if (info.id === CmdUtils.SCRAPYARD_ID)
            Utils.setPref("scrapyardPresents", false, () => chrome.runtime.reload());
    });

    function checkForScrapyard() {
        chrome.storage.local.set({ 'lastCmd': ""});

        chrome.runtime.sendMessage(CmdUtils.SCRAPYARD_ID, {type: "SCRAPYARD_GET_VERSION"}, version => {
            if (version) {
                Utils.setPref("scrapyardPresents", true);

                if (CmdUtils.scrapyardCommands && CmdUtils.CommandList.indexOf(CmdUtils.scrapyardCommands[0]) < 0)
                    CmdUtils.CommandList = [...CmdUtils.CommandList, ...CmdUtils.scrapyardCommands];
            }
        });
    }

    chrome.runtime.onInstalled.addListener(checkForScrapyard);
    setTimeout(checkForScrapyard, 5000);
});
