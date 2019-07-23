// BuildIn CmdUtils command definitions
// jshint esversion: 6 

CmdUtils.CreateCommand({
    names: ["change-ubiquity-settings", "change-ubiquity-options"],
    uuid: "D6E7CBA7-920D-4F86-910E-63AB3C119906",
    icon: "/res/icons/settings.png",
    builtIn: true,
    _namespace: "Ubiquity", // do not set this field in custom commands
    description: "Takes you to the Ubiquity <a href='options.html' target=_blank>settings page</a>.",
    execute: function() {
        CmdUtils.addTab("res/options.html");
    }
});

CmdUtils.CreateCommand({
    names: ["edit-ubiquity-settings", "edit-ubiquity-options"],
    uuid: "3A9CD64F-3D4D-4D90-BA5A-882615672396",
    icon: "/res/icons/debug.png",
    builtIn: true,
    _hidden: true,
    _namespace: "Ubiquity",
    description: "Live-edit Ubiquity options as text.",
    execute: function() {
        CmdUtils.addTab("res/edit.html?ubiquity-settings");
    }
});

CmdUtils.CreateCommand({
    names: ["view-api-reference"],
    uuid: "3DB11207-1240-41F8-966C-CD77B58C6376",
    icon: "/res/icons/debug.png",
    builtIn: true,
    _hidden: true,
    _namespace: "Ubiquity",
    description: "View UbiquityWE API reference.",
    execute: function() {
        CmdUtils.addTab("res/API.html");
    }
});

CmdUtils.CreateCommand({
    names: ["list-ubiquity-commands", "command-list", "help"],
    uuid: "B8D3B9C2-D8DB-40F3-833F-639588A9EA8D",
    description: "Opens Ubiquity command list page.",
    icon: "/res/icons/list_table.png",
    _namespace: "Ubiquity",
    builtIn: true,
    preview: "Lists all available commands",
    execute: function() {CmdUtils.addTab("res/commands.html")}
});

CmdUtils.CreateCommand({
    names: ["edit-ubiquity-commands", "hack-ubiquity"],
    uuid: "07E1ABDD-89BD-4666-8884-3E0B86611CE0",
    icon: "/res/icons/plugin_edit.png",
    _namespace: "Ubiquity",
    builtIn: true,
    description: "Takes you to the Ubiquity command <a href='edit.html' target=_blank>editor page</a>.",
    execute: function() {
        CmdUtils.addTab("res/edit.html");
    }
});

CmdUtils.CreateCommand({
    names: ["reload-ubiquity"],
    uuid: "E9F2C758-FA25-46F1-90C4-02CB057A3269",
    _namespace: "Ubiquity",
    description: "Reloads Ubiquity extension.",
    icon: "/res/icons/arrow_refresh.png",
    builtIn: true,
    preview: "Reloads Ubiquity extension.",
    execute: function() {
        chrome.runtime.reload();
    }
});

CmdUtils.CreateCommand({
    names: ["debug-popup"],
    uuid: "6E788674-71FF-486E-AAD4-7D241670C0FC",
    description: "Debug the popup window in a separate tab.",
    _namespace: "Ubiquity",
    _hidden: true,
    builtIn: true,
    icon: "/res/icons/debug.png",
    preview: "Debug the popup window in a separate tab.",
    execute: function() {CmdUtils.addTab("popup.html")}
});

CmdUtils.CreateCommand({
    names: ["show-background-page"],
    uuid: "42B341B1-5D12-4891-962E-4C2BF68DC7E8",
    description: "Open extension generated background page.",
    _namespace: "Ubiquity",
    _hidden: true,
    builtIn: true,
    icon: "/res/icons/debug.png",
    execute: function() {
        chrome.runtime.getBackgroundPage(p => CmdUtils.addTab(p.location.href));
    }
});

CmdUtils.CreateCommand({
    name: "switch-to-tab",
    uuid: "24616A75-C995-439B-B6F4-F3ED72662C89",
    argument: [{role: "object", nountype: noun_type_tab, label: "tab title or URL"}],
    description: "Switches to the tab whose title or URL matches the input.",
    previewDelay: 100,
    _namespace: "Browser",
    icon: "/res/icons/tab_go.png",
    builtIn: true,
    execute: function execute({object}) {
        if (object && object.data)
            chrome.tabs.update(object.data.id, {active: true});
    }
});

CmdUtils.CreateCommand({
    name: "close-tab",
    uuid: "26CCB2AC-053B-4C33-91AF-5C1C669901B5",
    argument: [{role: "object", nountype: noun_type_tab, label: "tab title or URL"}],
    description: "Closes the tab whose title or URL matches the input or the current tab if no tab matches.",
    previewDelay: 100,
    _namespace: "Browser",
    icon: "/res/icons/tab_delete.png",
    builtIn: true,
    execute: function execute({object}) {
        if (!object || !object.data)
            CmdUtils.closeTab();
        else
            chrome.tabs.remove(object.data.id);
    }
});

CmdUtils.CreateCommand({
    name: "close-all-tabs-with",
    uuid: "FA80916D-08ED-4E97-AF35-5BE34A9ECA00",
    argument: [{role: "object", nountype: noun_arb_text, label: "tab title or URL"}],
    description: "Closes all open tabs that have the given word in common.",
    previewDelay: 100,
    _namespace: "Browser",
    icon: "/res/icons/tab_delete.png",
    builtIn: true,
    execute: function execute({object: {text}}) {
        if (text) {
            CmdUtils.tabs.search(text, null, tabs => {
                for(let tab of tabs)
                    chrome.tabs.remove(tab.id);
            });
        }
    }
});


CmdUtils.CreateCommand({
    name: "print",
    uuid: "2909878D-DF99-4FD8-8DA6-FD2B5B7D0756",
    _namespace: "Browser",
    description: "Print the current page.",
    icon: "/res/icons/print.gif",
    builtIn: true,
    preview: "Print the current page.",
    execute: function (directObj) {
        chrome.tabs.executeScript( { code:"window.print();" } );
    }
});

CmdUtils.CreateCommand({
    name: "invert",
    uuid: "D962E2B8-8ECD-41F9-BC28-ED77594C6A75",
    _namespace: "Browser",
    description: "Inverts all colors on current page. Based on <a target=_blank href=https://stackoverflow.com/questions/4766201/javascript-invert-color-on-all-elements-of-a-page>this</a>.",
    builtIn: true,
    icon: "/res/icons/invert.png",
    execute: function execute(){
        chrome.tabs.executeScript({code:`
        javascript: (
            function () { 
            // the css we are going to inject
            var css = 'html {-webkit-filter: invert(100%);' +
                '-moz-filter: invert(100%);' + 
                '-o-filter: invert(100%);' + 
                '-ms-filter: invert(100%); }',
            
            head = document.getElementsByTagName('head')[0],
            style = document.createElement('style');
            
            // a hack, so you can "invert back" clicking the bookmarklet again
            if (!window.counter) { window.counter = 1;} else  { window.counter ++;
            if (window.counter % 2 == 0) { var css ='html {-webkit-filter: invert(0%); -moz-filter:    invert(0%); -o-filter: invert(0%); -ms-filter: invert(0%); }'}
             };
            
            style.type = 'text/css';
            if (style.styleSheet){
            style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }
            
            //injecting the css to the head
            head.appendChild(style);

            function invert(rgb) {
                rgb = Array.prototype.join.call(arguments).match(/(-?[0-9\.]+)/g);
                for (var i = 0; i < rgb.length; i++) {
                  rgb[i] = (i === 3 ? 1 : 255) - rgb[i];
                }
                return rgb;
            }

            document.body.style.backgroundColor = "rgb("+invert(window.getComputedStyle(document.body, null).getPropertyValue('background-color')).join(",")+")";
            }());
        `})
    },
});

CmdUtils.CreateCommand({
    names: ["base64decode","b64d","atob"],
    uuid: "E5C587CB-5733-463E-80DD-A6D4C085EE53",
    _namespace: "Utility",
    description: "base64decode",
    icon: "/res/icons/encoding.png",
    builtIn: true,
    author: {
        name: "rostok",
    },
    license: "GPL",
    arguments: [{role: "object", nountype: noun_arb_text, label: "text"}],
    execute: function execute({object: {text}}) {
        CmdUtils.setSelection(atob(text));
    },
    preview: function preview(pblock, {object: {text}}) {
        pblock.innerHTML = atob(text);
    },
});

CmdUtils.CreateCommand({
    names: ["base64encode","b64e", "btoa"],
    uuid: "A7337919-93A1-48AC-AE1F-B9C322B7169E",
    _namespace: "Utility",
    description: "base64encode",
    builtIn: true,
    icon: "/res/icons/encoding.png",
    author: {
        name: "rostok",
    },
    license: "GPL",
    arguments: [{role: "object", nountype: noun_arb_text, label: "text"}],
    execute: function execute({object: {text}}) {
        CmdUtils.setSelection(btoa(text));
    },
    preview: function preview(pblock, {object: {text}}) {
        pblock.innerHTML = btoa(text);
    },
});

CmdUtils.CreateCommand({
    names: ["urldecode"],
    uuid: "C042DDB6-FD05-4CD5-9356-1725C0533568",
    _namespace: "Utility",
    description: "urldecode",
    icon: "/res/icons/encoding.png",
    builtIn: true,
    author: {
        name: "rostok",
    },
    license: "GPL",
    arguments: [{role: "object", nountype: noun_arb_text, label: "text"}],
    execute: function execute({object: {text}}) {
        CmdUtils.setSelection(decodeURIComponent(text));
    },
    preview: function preview(pblock, {object: {text}}) {
        pblock.innerHTML = decodeURIComponent(text);
    },
});

CmdUtils.CreateCommand({
    names: ["urlencode"],
    uuid: "80F43371-F330-4685-A153-9A493B07A553",
    _namespace: "Utility",
    description: "urlencode",
    icon: "/res/icons/encoding.png",
    builtIn: true,
    author: {
        name: "rostok",
    },
    license: "GPL",
    arguments: [{role: "object", nountype: noun_arb_text, label: "text"}],
    execute: function execute({object: {text}}) {
        CmdUtils.setSelection(encodeURIComponent(text));
    },
    preview: function preview(pblock, {object: {text}}) {
        pblock.innerHTML = encodeURIComponent(text);
    },
});

const noun_calc = {
    label: "expression",
    uuid: "F48E9D0A-06AA-499F-B724-7332529D1D8E",
    _parser: new MathParser(),
    suggest: function (txt, htm, cb, si) {
        if (!this._mathlike.test(txt)) return []
        try {
            var result = this._parser.evaluate(txt)
                , score = result === txt ? .3 : 1
        }
        catch (e) {
            result = e.message
            score  = .1
        }
        return [CmdUtils.makeSugg(txt, htm, result, score, si)];
    },
    _mathlike: /^[\w.+\-*\/^%(, )|]+$/,
};

CmdUtils.CreateCommand({
    name: "calculate",
    uuid: "53E7B63A-4084-449F-B142-9D62D82B9772",
    description:
        'Calculates using\
         <a href="http://silentmatt.com/javascript-expression-evaluator/">\
         JavaScript Expression Evaluator</a>.',
    help: "Try: <code>22/7, 3^4^5, sin(sqrt(log(PI)))</code>",
    icon: "/res/icons/calculator.png",
    _namespace: "Utility",
    builtIn: true,
    author: "satyr",
    license: "Public domain",
    arguments: [{role: "object", nountype: noun_calc, label: "expression"}],
    preview: function (pb, {object: {data, score}}) {
        pb.innerHTML = data? (score < .3 ? "<em style='color: red'>" : "<strong>") + data: "";
    },
});


var bitly_api_user = "ubiquityopera";
var bitly_api_key = "R_59da9e09c96797371d258f102a690eab";
CmdUtils.CreateCommand({
    names: ["shorten-url", "bitly"],
    uuid: "6475BAAA-4547-4FF0-BCA7-EE4236F20386",
    _namespace: "Utility",
    icon: "/res/icons/bitly.png",
    builtIn: true,
    description: "Shorten your URLs with the least possible keystrokes",
    homepage: "http://bit.ly",
    author: {
        name: "Cosimo Streppone",
        email: "cosimo@cpan.org"
    },
    license: "GPL",
    arguments: [{role: "object", nountype: noun_arb_text, label: "text"}],
    preview: async function (pblock, {object: {text}}) {
        var host = text? text: CmdUtils.getLocation();
        if (!host)
            pblock.innerHTML = "No URL is provided.";
        else
            pblock.innerHTML = "Shortens " + host + " with bit.ly and copies it into clipboard.";
    },
    execute: async function ({object: {text}}) {
        var url = "http://api.bit.ly/shorten?version=2.0.1&longUrl={QUERY}&login=" +
            bitly_api_user + "&apiKey=" + bitly_api_key;
        var query = text;
        // Get the url from current open tab if none specified
        if (!query) query = CmdUtils.getLocation();
        if (!query) return;
        var urlString = url.replace("{QUERY}", query);

        var url = "http://api.bit.ly/shorten?version=2.0.1&longUrl={QUERY}&login=" + bitly_api_user + "&apiKey=" + bitly_api_key;
        // Get the url from current open tab if none specified
        var ajax = await CmdUtils.get(urlString);
        //ajax = JSON.parse(ajax);
        //if (!ajax) return;
        var err_code = ajax.errorCode;
        var err_msg = ajax.errorMessage;
        // Received an error from bit.ly API?
        if (err_code > 0 || err_msg) {
            CmdUtils.setPreview('<br/><p style="font-size: 18px; color:orange">' + 'Bit.ly API error ' + err_code + ': ' + err_msg + '</p>');
            return;
        }

        var short_url = ajax.results[query].shortUrl;
        CmdUtils.setClipboard(short_url);
    }
});

CmdUtils.CreateCommand({
    name: "isdown",
    uuid: "48449987-B873-49F5-99B4-7F99662BCA99",
    _namespace: "Utility",
    arguments: [{role: "object", nountype: noun_arb_text, label: "URL"}],
    builtIn: true,
    previewDelay: 1000,
    icon: "/res/icons/isdown.ico",
    description: "Check if selected/typed URL is down.",
    preview: function (pblock, {object: {text}}) {
        if (!text)
            text = CmdUtils.getLocation();

        if (!text)
            return;

        pblock.innerHTML = "Checking <b>" + text + "</b>";
        var urlString = "http://downforeveryoneorjustme.com/" + encodeURIComponent(text);

        CmdUtils.previewGet(pblock, urlString, (resp) => {
            if (!resp) return;
            if (resp.match('is up.')) {
                CmdUtils.setPreview('It\'s just you. The site is <b>up!</b>');
            } else {
                CmdUtils.setPreview('It\'s <b>not</b> just you. The site is <b>down!</b>');
            }
        });
    },
    execute: async function ({object: {text}}) {
        if (!text)
            text = CmdUtils.getLocation();

        if (!text)
            return;

        CmdUtils.addTab("http://downforeveryoneorjustme.com/" + encodeURIComponent(text));
    }
});
