CmdUtils.makeSearchCommand({
    name: "kpop",
    uuid: "479E0CB6-981C-4485-AA7B-8296AB383EA7",
    url: "https://hulkpop.com/?s=%s",
    defaultUrl: "https://hulkpop.com/",
    arguments: [{role: "object", nountype: noun_arb_text, label: "query"}],
    description: "Search for K-Pop releases.",
    icon: "/commands/more/kpop.png",
    builtIn: true,
    _hidden: true,
    _namespace: "More Commands",
    previewDelay: 1000,
    parser: {
        type: "html",
        container  : "article[id^='post']",
        title      : ".post-title a",
        href       : ".post-title a",
        thumbnail  : ".post-thumbnail img",
        body       : ".post-meta li:nth-of-type(2)",
        maxResults : 20,
        display: "previewList2"
    }
});
