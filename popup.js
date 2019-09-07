//
// UbiquityWE a Ubiquity for Chrome
// rostok@3e.pl
// 
// based on http://github.com/cosimo/ubiquity-chrome/ by Cosimo Streppone, <cosimo@cpan.org>
//
// Original Ubiquity Project: http://labs.mozilla.org/ubiquity/
// jshint esversion: 6 

var ubiq_selected_command = 0;
var ubiq_selected_sent;
var ubiq_suggestions;
var ubiq_parser;

// closes ubiquity popup, it's needed to be defined here to work in Firefox
CmdUtils.closePopup = function closePopup(w) {
    if (typeof popupWindow !== "undefined") 
        popupWindow.close();
    else
        window.close();
};

CmdUtils.getCommandLine = ubiq_get_input;
CmdUtils.setCommandLine = function (text) {
    ubiq_set_input(text);
    ubiq_save_input();
    ubiq_show_matching_commands();
    lcmd = ubiq_get_input();
};

function ubiq_preview_el() {
    return document.getElementById('ubiq-command-preview');
}

function ubiq_suggestion_el() {
    return document.getElementById('ubiq-suggestion-panel');
}

// sets preview panel, prepend allows to add new contnet to the top separated by HR
function ubiq_set_preview(v, prepend) {
    v = v || "";
    prepend = prepend === true;
    var el = ubiq_preview_el();
    if (!el) return;
    v = (v.indexOf("<") >= 0 || v.indexOf(">") >= 0)? v: '<div id="ubiq-help-wrapper">' + v + '</div>';
    ubiq_preview_el().dispatchEvent(new Event("preview-change"));
    el.innerHTML = v + (prepend ? "<hr/>" + el.innerHTML : "");
    //if (v!="") ubiq_set_suggestions("");
}

// sets suttestion panel, prepend allows to add new contnet to the top separated by HR
function ubiq_set_suggestions(v, prepend, hide) {
    v = v || (hide? "": "<ul/>");
    prepend = prepend === true;
    var el = ubiq_suggestion_el();
    if (!el) return;
    el.innerHTML = v + (prepend ? "<hr/>" + el.innerHTML : "");
    if (v!="") ubiq_set_preview("");
}

// clears tip, result and preview panels
function ubiq_clear() {
    ubiq_set_suggestions("");
    ubiq_set_preview("");
}

function ubiq_get_input() {
    var cmd = document.getElementById('ubiq_input');
    if (!cmd) {
        ubiq_selected_command = -1;
        return '';
    }
    return cmd.value;
}

function ubiq_set_input(text) {
    let el = document.getElementById('ubiq_input');
    el.value = text;
}

function ubiq_autocomplete() {
    if (ubiq_selected_sent) {
        let completion = ubiq_selected_sent.completionText.trim();
        let input = ubiq_get_input();
        if (input && completion && completion.length < 100 && input.trim() !== completion)
            ubiq_set_input(completion);
    }
}

function ubiq_show_preview(sent, args) {
    if (sent == null)
        return;

    var commandDef = sent.getCommand();
    if (!commandDef || !commandDef.preview)
        return;

    switch(typeof commandDef.preview)
    {
        case 'undefined':
            ubiq_set_preview( commandDef.description );
            break;
        case 'string':
            ubiq_set_preview( commandDef.preview );
            break;
        default:
            var pfunc = ()=>{
                // zoom overflow dirty fix
                CmdUtils.popupWindow.jQuery("#ubiq-command-preview").css("overflow-y", "auto");
                try {
                    ubiq_preview_el().dispatchEvent(new Event("preview-change"));
                    Utils.callPersistent(commandDef.uuid, sent, sent.preview, ubiq_preview_el());
                } catch (e) {
                    CmdUtils.notify(e.toString(), "preview function error");
                    if (CmdUtils.backgroundWindow && CmdUtils.backgroundWindow.error) {
                        CmdUtils.backgroundWindow.error(e.stack);
                    }
                }
            };

            if (typeof commandDef.require !== 'undefined')
                CmdUtils.loadScripts( commandDef.require, ()=>{ pfunc(); } );
            else
            if (typeof commandDef.requirePopup !== 'undefined')
                CmdUtils.loadScripts( commandDef.requirePopup, ()=>{ pfunc(); }, window );
            else
            pfunc();
    }
}

function ubiq_execute(input) {
    if (ubiq_selected_sent) {
        CmdUtils.commandHistoryPush(input);
        CmdUtils.closePopup();
        Utils.callPersistent(ubiq_selected_sent.getCommand().uuid, ubiq_selected_sent, ubiq_selected_sent.execute);
    }
}

function ubiq_help() {
    var html = "<div id='ubiq-help-wrapper'>Type the name of a command and press Enter to execute it. "
        + "Use <b>help</b> command for assistance.";
    html += "<p>";
    html += "<div class='ubiq-help-heading'>Keyboard Shortcuts</div>";
    html += "<span class='keys'>Ctrl+C</span> - copy preview to clipboard<br>";
    html += "<span class='keys'>Ctrl+Alt+Enter</span> - add selected command to context menu<br>";
    html += "<span class='keys'>Ctrl+Alt+\\</span> - open command history<br>";
    html += "<span class='keys'>Ctrl+Alt+&ltkey&gt;</span> - select list item prefixed with &ltkey&gt;<br>";
    html += "<span class='keys'>&#8593;/&#8595;</span> - cycle through command suggestions<br>";
    html += "<span class='keys'>F5</span> - reload the extension</div>";

    ubiq_set_preview(html);
}

function ubiq_show_command_history() {
    Utils.getPref("commandHistory", items => {
        ubiq_preview_el().dispatchEvent(new Event("preview-change"));
        CmdUtils.previewList(ubiq_preview_el(), items, (i, e) => {
            ubiq_set_input(items[i]);
            ubiq_show_matching_commands();
        });
    });
}

function ubiq_make_context_menu_cmd() {
    let input = ubiq_get_input();
    if (ubiq_selected_sent && input) {
        let command = ubiq_selected_sent.completionText.trim();

        if (!CmdUtils.getContextMenuCommand(command)) {
            CmdUtils.addContextMenuCommand(ubiq_selected_sent.getCommand(), input.trim(), command);
        }
    }
}

function ubiq_focus() {
    el = document.getElementById('ubiq_input');
    if (el.createTextRange) {
        var oRange = el.createTextRange();
        oRange.moveStart("character", 0);
        oRange.moveEnd("character", el.value.length);
        oRange.select();
    } else if (el.setSelectionRange) {
        el.setSelectionRange(0, el.value.length);
    }
    el.focus();
}

// TODO: refactor evil side effects
function ubiq_ensure_command_in_range() {
    let in_range = false;
    // Don't navigate outside boundaries of the list of matches
    if (ubiq_suggestions && ubiq_selected_command >= ubiq_suggestions.length) {
        ubiq_selected_command = ubiq_suggestions.length - 1;
    }
    else if (ubiq_suggestions && ubiq_selected_command < 0) {
        ubiq_selected_command = 0;
    }
    else if (ubiq_suggestions)
        in_range = true;

    return in_range;
}

// TODO: refactor evil side effects
function get_next_comand_index(asc) {
    let index = ubiq_selected_command + (asc? 1: -1);

    // Don't navigate outside boundaries of the list of matches
    if (ubiq_suggestions && index >= ubiq_suggestions.length) {
        index = 0;
    }
    else if (index < 0) {
        index = ubiq_suggestions.length - 1;
    }
    else if (!ubiq_suggestions)
        return -1;

    return index;
}

function ubiq_select_command(index) {
    ubiq_ensure_command_in_range();
    if (ubiq_selected_command != index) {
        let previous_command = ubiq_selected_command;
        ubiq_selected_command = index;
        ubiq_selected_sent = ubiq_suggestions[ubiq_selected_command];

        jQuery("#suggestion-item-" + previous_command).parent().removeClass("selected");
        var elt = jQuery(`#suggestion-item-${index}`);
        elt.parent().addClass('selected');

        ubiq_autocomplete();
        ubiq_set_preview(ubiq_selected_sent.getCommand().description);
        ubiq_show_preview(ubiq_selected_sent);
    }
}

function ubiq_decorate_icon(icon) {
    if (!icon || icon === "http://example.com/favicon.png") {
        icon = '/res/icons/icon-24.png';
    }
    icon = '<img src="' + icon + '" border="0" alt="" align="absmiddle"> ';
    return icon;
}

function ubiq_default_state() {
    ubiq_selected_command = -1;
    ubiq_selected_sent = null;
    ubiq_clear();
    ubiq_help();
}

// will also call preview
function ubiq_show_matching_commands(text) {
    if (!text) text = ubiq_get_input();

    if (text) {
        var query = ubiq_parser.newQuery(text, null, CmdUtils.maxSuggestions, true);

        query.onResults = () => {
            ubiq_suggestions = query.suggestionList;

            //console.log(text);
            //console.log(ubiq_suggestions);

            ubiq_ensure_command_in_range();

            // We have matches, show a list
            if (ubiq_suggestions.length > 0) {
                var suggestions_div = document.createElement('div');
                var suggestions_list = document.createElement('ul');

                if (ubiq_selected_sent && !ubiq_suggestions[ubiq_selected_command].equalCommands(ubiq_selected_sent)
                        || !ubiq_selected_sent) {
                    ubiq_set_preview(ubiq_suggestions[ubiq_selected_command].getCommand().description);
                }
                ubiq_show_preview(ubiq_suggestions[ubiq_selected_command]);

                for (let i in ubiq_suggestions) {
                    var is_selected = (i == ubiq_selected_command);
                    var s = ubiq_suggestions[i];
                    var li = document.createElement('LI');
                    li.innerHTML = `<div id="suggestion-item-${i}"><table cellspacing="1" cellpadding="1">
                            <tr><td>${ubiq_decorate_icon(s.icon)}</td><td>${s.displayHtml}</td></tr></table></div>`;
                    if (is_selected) {
                        li.setAttribute('class', 'selected');
                        ubiq_selected_sent = s;
                    }
                    suggestions_list.appendChild(li);
                }

                suggestions_div.appendChild(suggestions_list);
                ubiq_suggestion_el().innerHTML = suggestions_div.innerHTML; // shouldn't clear the preview
                for (let i in ubiq_suggestions)
                    jQuery(`#suggestion-item-${i}`).click((e) => {
                        ubiq_select_command(i);
                    });
                //ubiq_preview_set_visible(true);
            } else {
                ubiq_default_state()
            }
        };

        query.run();
    }
    else
        ubiq_default_state();
}

var lcmd = "";

function ubiq_keydown_handler(evt) {
	// measure the input 
	CmdUtils.inputUpdateTime = performance.now();

    if (!evt) return;
    let kc = evt.keyCode;

    // On TAB, autocomplete
    if (kc === 9) {
        evt.preventDefault();
        ubiq_autocomplete();
        return;
    }

    // On ENTER, execute the given command
    if (kc === 13) {
        let input = ubiq_get_input()
        if (Utils.easterListener(input))
            return;

        if (evt.ctrlKey && evt.altKey) {
            ubiq_make_context_menu_cmd();
            return;
        }

        ubiq_execute(input);
        return;
    }

    if (kc === 220) {
        if (evt.ctrlKey && evt.altKey) {
            ubiq_show_command_history();
            return;
        }
    }

    // On F5 restart extension
    if (kc === 116) {
        chrome.runtime.reload();
        return;
    }

    // Cursor up
    if (kc === 38) {
        evt.preventDefault();
        lcmd = "";
        ubiq_select_command(get_next_comand_index(false));
        return;
    }
    // Cursor Down
    else if (kc === 40) {
        evt.preventDefault();
        lcmd = "";
        ubiq_select_command(get_next_comand_index(true));
        return;
    }

    if (evt.ctrlKey && evt.altKey && kc >= 40 && kc <= 90) {
        let items = jQuery("[accessKey='" + String.fromCharCode(kc).toLowerCase() + "']");
        if (items.length > 0) {
            if (items[0].href)
                chrome.tabs.create({ "url": items[0].href, active: false });
            else
                items.click();
        }
        return;
    }

    // Ctrl+C copies preview to clipboard
    if (kc === 67 && evt.ctrlKey) {
        //ackgroundPage.console.log("copy to clip");
        var el = ubiq_preview_el();
        if (!el) return;
        CmdUtils.setClipboard( el.innerText );
        return;
    }

    if (kc === 33 || kc === 34) {
        let pblock = ubiq_preview_el();
        pblock.scrollBy(0, (kc === 33? -1: 1) * pblock.clientHeight - 20);
    }

    lcmd = ubiq_get_input();
}

function ubiq_keyup_handler(evt) {
    if (!evt) return;
    var kc = evt.keyCode;
    if (lcmd == ubiq_get_input()) return;

    if (evt.ctrlKey || evt.altKey)
        return;

    // Cursor up
    if (kc == 38) {
        return;
    }
    // Cursor Down
    else if (kc == 40) {
        return;
    }

    ubiq_save_input();
    ubiq_show_matching_commands();
    lcmd = ubiq_get_input();
}

function ubiq_save_input() {
	cmd = document.getElementById('ubiq_input');
    if (typeof chrome !== 'undefined' && chrome.storage) chrome.storage.local.set({ 'lastCmd': cmd.value });
}

function ubiq_load_input(callback) {
    if (CmdUtils.selectedContextMenuCommand) {
        ubiq_set_input(CmdUtils.selectedContextMenuCommand);
        CmdUtils.selectedContextMenuCommand = null;
        if (CmdUtils.rememberContextMenuCommands)
            ubiq_save_input();
        callback();
    }
    else {
        cmd = document.getElementById('ubiq_input');
        if (typeof chrome !== 'undefined' && chrome.storage) chrome.storage.local.get('lastCmd', function (result) {
            lastCmd = result.lastCmd || "";
            cmd.value = lastCmd;
            cmd.select();
            callback();
        });
    }
}

$(window).on('load', function() {
    if (typeof CmdUtils !== 'undefined' && typeof Utils !== 'undefined' && typeof backgroundPage !== 'undefined' ) {
        CmdUtils.setPreview = ubiq_set_preview;
        CmdUtils.popupWindow = window;

        ubiq_parser = CmdUtils.makeParser();

        for (cmd of CmdUtils.CommandList) {
            try {
                if (cmd.popup) {
                    Utils.callPersistent(cmd.uuid, cmd, cmd.popup, document);
                }
            }
            catch (e) {
                console.log(e.message);
            }
        }

        // in Chrome popup links are not clickable
        if (CmdUtils.BROWSER !== "Firefox") {
            let observer = new MutationObserver(mutations => {
                for (let m of mutations) {
                    for (let n of m.addedNodes) {
                        let links = $(n).find("a");

                        links.each((_, a) => {
                            a.onclick = e => CmdUtils.addTab(a.href);
                        });
                    }
                }
            });
            observer.observe(ubiq_preview_el(), {"childList": true, "subtree": true});
        }

         CmdUtils.updateActiveTab(() => {
             ubiq_load_input(() => {
                 ubiq_show_matching_commands();
                 CmdUtils.deblog("hello from UbiquityWE");
             });
         });

        // Add event handler to window
        document.addEventListener('keydown', function (e) {
            ubiq_keydown_handler(e);
        }, false);
        document.addEventListener('keyup', function (e) {
            ubiq_keyup_handler(e);
        }, false);
    }
    else {
        chrome.tabs.create({ "url": "chrome://extensions" });
        chrome.notifications.create({
            "type": "basic",
            "iconUrl": chrome.extension.getURL("/res/icons/icon-128.png"),
            "title": "UbiquityWE",
            "message": "There is something wrong, try restarting UbiquityWE"
        });
    }
});

$(window).on('unload', function() {
    CmdUtils.commandHistoryPush(ubiq_get_input());
    if (/*CmdUtils.DEBUG &&*/ ubiq_selected_sent)
        ubiq_parser.strengthenMemory(ubiq_selected_sent);
});