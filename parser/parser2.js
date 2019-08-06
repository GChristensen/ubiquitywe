// For performance reasons Parser2 is currently not loaded by default.
// See parser2.js_ for the real thing.

var NLParser2 = {
    ParserRegistry: {"en": {"name": "English"}},
    makeParserForLanguage: function (languageCode, verbList, contextUtils, suggestionMemory) {
        return {};
    },
    strengthenMemory: function (chosenSuggestion) {},
    newQuery: function Parser_newQuery(queryString, context, maxSuggestions,
                                       dontRunImmediately) {
        return {};
    }
};