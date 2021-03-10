# UbiquityWE

A natural language interface for web browsers.

# DISCONTINUED 

Please see [iShell](https://github.com/GChristensen/ishell#readme).

#### History

The [original Ubiquity](https://wiki.mozilla.org/Labs/Ubiquity) was a promising project by Mozilla aimed to familiarize
masses with natural language user interfaces. But eventually, it went popular only within a community of handful of
geeks and has been abandoned, although, the [impressive
repository](https://wiki.mozilla.org/Labs/Ubiquity/Commands_In_The_Wild) of commands still remains. 
You have been meant to subscribe them to get updates automatically, but subscription model has ceased
with the original ubiquity, and due to the volatile nature of the Web, you will hardly find a working command there.
Nevertheless, Ubiquity is still immensely useful if
you are able to write JavaScript to automate things you have (web)API for, to make intricate org-mode protocol capture
schemes, etc., etc.

After Mozilla had introduced breaking changes into Firefox APIs, Satoshi Murakami
([satyr](http://profile.hatena.ne.jp/murky-satyr/) - one of the creators of Ubiquity) became a maintainer who galvanized 
Ubiquity until the last days of Firefox as we knew it (i.e. with "legacy" addon support).   
 

Unfortunately, almost all codebase of the original ubiquity became not functional in 
the new Firefox Quantum. The first attempts to resurrect Ubiquity came from the users 
of Opera browser ([ubiquity-opera](https://github.com/cosimo/ubiquity-opera/blob/master/ubiquity.js))
 and continued on Google Chrome ([UbiChr](https://github.com/rostok/ubichr)).
But they lacked the natural language parser which gave Ubiquity all
its superpowers. So, I have taken UbiChr,
NL-parser from the latest Ubiquity, combined them, added bells and whistles, and the fully functional 
new Ubiquity went back to Firefox. 
This means that it is now possible to port any "legacy" commands (that are still compatible with WebExtension APIs) 
to Firefox Quantum with minimal changes. 
 

#### Source code

* Source code of the original Ubiquity by Mozilla: https://github.com/mozilla/ubiquity
* Source code of the latest Ubiquity by satyr: https://bitbucket.org/satyr/ubiquity
* Source code of the original UbiChr: https://github.com/rostok/ubichr

#### NL Parsers

Just out of curiosity I have ported two parsers: [Parser 2](https://wiki.mozilla.org/Labs/Ubiquity/Parser_2) 
of the original Ubiquity and satyr's parser (which I call Parser 3). The former is not so
good in the terms of usability but superior in some linguistic aspects, so you only can
enable it if you are an interested developer. Parser 3 is more handy and is enabled by default, 
although it does not allow command names with whitespaces and uses "Hagure Metal" function to score suggestions
(if you want to know how exactly it works, ask satyr).

 
#### Additional functionality not found in the original Ubiquity

* New parser prepositions: 'by' (cause) and 'for' (subject).
* Ability to add commands to browser context menu.
* User command categories.

#### Additional functionality not found in the original UbiChr

* Natural language parser from the original ubiquity.
* Elaborate settings pages/tutorial/API reference.
* Command history.

#### Differences with the original Ubiquity

Although UbiquityWE is aimed to retain resemblance with the original Ubiquity as much as possible,
there are some notable differences which emerge, in part, from Firefox Quantum limitations:

* Because there is no command subscription model anymore, each command is required to
 have an UUID. Although, commands generally are able to run without an UUID, in this case they
 would not be able to store persistent data through "Bin" interface (but still be able to do this 
 through WebExtension API directly) and it would be not possible to add such a command 
 into context menu. An RFC 4122 v4 complaint UUID is generated automatically for commands
 inserted through command editor templates.
* Since there is no sandboxed evaluation available in Firefox WebExtensions, the
Bin persistent storage interface is reachable through command execute/preview handler arguments.
Insert the "full-featured" command template at UbiquityWE command editor for an example.
* Some original Utils/CmdUtils API is not implemented because there are no such possibilities
in Firefox Quantum or no easily reachable/public web API available anymore (which 
was used, for example, by some built-in noun types). 
This means, that porting of existing commands to UbiquityWE will require some effort.

#### Differences with the original UbiChr

* No backward compatibility with existing parserless UbiChr commands (although, it
should be pretty easy to port one).

#### Change Log
[Full changelog](changelog.md)

##### 31.07.2019 (v.0.3.1.1)

* Disabled 'maps' command due to the lack of free public Google Maps API.
