/*
    
    PORTED FROM CMFSC2

    (article: text [, capitalize])

    Returns the text with the correct article ('a' or 'an') appended.

    - text ( string ) A string of text to append an article to.
    - capitalize ( boolean ) ( optional ) Whether to capitalize the result.

    Example:
        (article: 'UFO', true) <!-- A UFO -->
        (article: 'European') <!-- a European -->
        (article: 'eleven', true) <!-- An eleven -->
        (article: 'angel') <!-- an angel -->
        (article: 'honor', true) <!-- An honor -->
        (article: 'idol')  <!-- an idol -->
    

    (set-article: article, text [, caseSensitive])

    Overrides the normal result of the `(article:)` macro with the indicated article when testing the indicated text.

    It is highly recommended that all `(set-article:)` calls go in a `startup`-tagged passage!

    - article ( string ) The article ('a' or 'an') to use.
    - text ( string ) The text to override the article of.
    - caseSensitive ( boolean ) ( optional ) If included and true, only exact case matches of the text will be overridden.

    Example:
        (set-article: 'a', 'US', true)

        (article: 'us')-vs-them situation <!-- an us-vs-them situation -->
        (article: 'US') citizen <!-- a US citizen -->
*/

(function () {
    'use strict';

    var _overrides = new Map();

    var _defaultIrregulars = [ // lifted from: https://github.com/tandrewnichols/indefinite/blob/master/lib/irregular-words.js
        // e
        'eunuch', 'eucalyptus', 'eugenics', 'eulogy', 'euphemism', 'euphony', 'euphoria', 'eureka', 'european', 'euphemistic', 'euphonic', 'euphoric', 'euphemistically', 'euphonically', 'euphorically', 
        // h
        'heir', 'heiress', 'herb', 'homage', 'honesty', 'honor', 'honour', 'hour', 'honest', 'honorous', 'honestly', 'hourly',
        // o
        'one', 'ouija', 'once',
        // u
        'ubiquitous', 'ugandan', 'ukrainian', 'unanimous', 'unicameral', 'unified', 'unique', 'unisex', 'universal', 'urinal', 'urological', 'useful', 'useless', 'usurious', 'usurped', 'utilitarian', 'utopic', 'ubiquitously', 'unanimously', 'unicamerally', 'uniquely', 'universally', 'urologically', 'usefully', 'uselessly', 'usuriously'
    ];

    var _validArticles = ['a', 'an'];

    var _vowels = /[aeiou8]/i;
    var _acronyms = /[A-Z]+$/;
    var _irregularAcronyms = /[UFHLMNRSX]/;
    var _punctuation = /[.,\/#!$%\^&\*;:{}=\-_`~()]/g;

    function _switch (article) {
        if (article === 'a') {
            return 'an';
        }
        return 'a';
    }

    function _isAcronym (word, article) {
        if (_acronyms.test(word) && _irregularAcronyms.test(word.charAt(0))) {
            return _switch(article);
        }
        return false;
    }

    function _isDefaultIrregular (word, article) {
        if (_defaultIrregulars.includes(word.toLowerCase())) {
            return _switch(article);
        }
        return false;
    }

    function addOverride (article, word, caseSensitive) {
        var msg;
        // check args
        if (!word || typeof word !== 'string') {
            msg = 'cannot add article override -> invalid word';
            console.error(msg);
            return msg;
        }
        if (article && typeof article === 'string') {
            // clean up article
            article = article.toLowerCase().trim();
        }
        if (!_validArticles.includes(article)) {
            msg = 'cannot add article override -> invalid article, must be "a" or "an"';
            console.error(msg);
            return msg;
        }
        // clean up phrase
        word = word.trim();

        if (caseSensitive) {
            _overrides.set(word, {
                article : article,
                caseSensitive : !!caseSensitive
            });
        } else {
            _overrides.set(word.toLowerCase(), {
                article : article,
                caseSensitive : !!caseSensitive
            });
        }
    }

    function _checkOverrides (word) {
        word = word.trim();
        // check user-defined overrides
        var check = word.toLowerCase();
        if (_overrides.has(check) || _overrides.has(word)) {
            var override = _overrides.get(check) || _overrides.get(word);
            // check if we require an exact (case-sensitive) match
            if (override.caseSensitive && !_overrides.has(word)) {
                    return null;
            }
            // return the article
            return override.article;
        }
        // return nothing, passing on to built-in article checks
        return null;
    }

    function _checkVowels (word) {
        var article;
        // select the article based on vowels
        if (_vowels.test(word.charAt(0))) {
            article = 'an';
        } else {
            article = 'a';
        }
        // check for irregular words, then acronyms
        return _isDefaultIrregular(word, article) || _isAcronym(word, article) || article;
    }

    function find (word) {
        if (!word || typeof word !== 'string') {
            return;
        }
        var cleanedWord = word.trim().split(' ')[0].trim();
        cleanedWord = cleanedWord.replace(_punctuation, '');
        return _checkOverrides(cleanedWord) || _checkVowels(cleanedWord);
    }

    function article (word, upper) {
        if (!word || typeof word !== 'string') {
            return word; // ? just throw back whatever we got
        }
        var article = find(word);
        // return article, capitalized if requested, appended to the original phrase
        return (upper ? article.charAt(0).toUpperCase() + article.substring(1) : article) + ' ' + word;
    }

    window.setup = window.setup || {};

    Object.assign(window.setup, {
        find : find,
        output : article,
        override : addOverride
    });

    Harlowe.macro('article', function (text, uc) {
        var err = this.typeCheck([
            'string', 
            'boolean|undefined'
        ]);
        if (err) throw err;

        return article(text, uc);
    });

    Harlowe.macro('setarticle', function (article, word, caseSen) {
        var err = this.typeCheck([
            'string',
            'string',
            'boolean|undefined'
        ]);
        if (err) throw err;

        if (!_validArticles.includes(article.toLowerCase().trim())) {
            throw this.error('invalid article in first argument--must be "a" or "an"');
        }

        addOverride(article, word, caseSen);
    });

}());