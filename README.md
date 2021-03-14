# UbiquityWE

# DISCONTINUED 

The add-on was an experimental descendant of the original [Ubiquity](https://wiki.mozilla.org/Labs/Ubiquity)
project by Mozilla. Please see the new [iShell](https://gchristensen.github.io/ishell/) for more features and APIs.

#### History

The original [Ubiquity](https://wiki.mozilla.org/Labs/Ubiquity) Firefox extension was a natural language interface developed by Mozilla, 
where you were able to give text commands to the browser through a special popup input window.
It also provided the ability to create custom commands in JavaScript programming language.

Eventually, it went popular only within a community of
geeks and has been abandoned, although, the [impressive
repository](https://wiki.mozilla.org/Labs/Ubiquity/Commands_In_The_Wild) of commands still remains. 
You have been meant to subscribe them to get updates automatically, but subscription model has ceased
with the original Ubiquity, and due to the volatile nature of the Web, now you will hardly find a working command there.

After Mozilla had introduced breaking changes into Firefox APIs, Satoshi Murakami
([satyr](http://profile.hatena.ne.jp/murky-satyr/) - one of the creators of Ubiquity) became a maintainer who galvanized 
Ubiquity until the last days of Firefox as we knew it (i.e. with the "legacy" addon support).   

Unfortunately, almost all codebase of the original ubiquity became not functional in 
the new Firefox Quantum. The first attempts to resurrect Ubiquity came from the users 
of Opera browser ([ubiquity-opera](https://github.com/cosimo/ubiquity-opera))
 and continued on Google Chrome ([UbiChr](https://github.com/rostok/ubichr)).
But they lacked the natural language parser which gave Ubiquity all
its superpowers. 

I have taken UbiChr, ported the NL-parser from the Ubiquity by satyr to ES6, borrowed the API from original Ubiquity,
combined them, added bells and whistles, and the fully-functional new Ubiquity went back to Firefox. 
This means that it is possible to port any "legacy" commands (that are still compatible with WebExtension APIs) 
to Firefox Quantum with minimal changes. The new [iShell](https://gchristensen.github.io/ishell/) project goes beyond this, 
providing the brand-new command authoring APIs, based on the modern language features, that have not existed when the original
Ubiquity was created.

#### Source code

* Source code of the original Ubiquity by Mozilla: https://github.com/mozilla/ubiquity
* Source code of the latest Ubiquity by satyr: https://bitbucket.org/satyr/ubiquity 
  (it seems that it is missing now, a clone may be found [here](https://github.com/GChristensen/ubiquity))
* Source code of the original UbiChr: https://github.com/rostok/ubichr

#### NL Parsers

Just out of curiosity I have ported two parsers: the [Parser 2](https://wiki.mozilla.org/Labs/Ubiquity/Parser_2) 
of the original Ubiquity and satyr's parser (which I call Parser 3). The former is not so
good in the terms of usability but superior in some linguistic aspects. Parser 3 is more handy, 
although it does not allow command names with whitespaces and uses "Hagure Metal" function to score suggestions
(if you want to know how exactly it works, ask satyr).

 
#### Additional functionality not found in the original Ubiquity

* New parser prepositions: 'by' (cause) and 'for' (subject).
* Ability to add commands to browser context menu.
* User command categories.

#### Additional functionality not found in the original UbiChr

* Natural language parser from the original Ubiquity.
* Elaborate setting pages/tutorial/API reference.
* Command history.

#### Differences with the original Ubiquity

Although UbiquityWE is aimed to retain resemblance with the original Ubiquity as much as possible,
there are some notable differences which emerge, in part, from Firefox Quantum limitations:

* Because there is no command subscription model anymore, which used subscription URLs to identify commands, each command is required to
 have a UUID to work properly.
* The Bin persistent storage interface is reachable only through the last arguments of execute/preview handler methods and is wrapped in an object.
Insert the "full-featured" command template at UbiquityWE command editor for an example.
* Some original Utils/CmdUtils API is not implemented because there are no such possibilities
in Firefox Quantum or no easily reachable/public web API available anymore (which 
was used, for example, by some built-in noun types). 
This means, that porting of existing commands to UbiquityWE will require some effort.

#### Differences with the original UbiChr

* No backward compatibility with existing parserless UbiChr commands (although, it
should be pretty easy to port one).
