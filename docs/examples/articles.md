## Articles

This macro returns the appropriate article ("a" or "an") when given a line of text. A utility macro is provided to allow for you to create overrides for edge cases, but the macro is pretty clever and will get the right article even in very complicated cases, like `a UFO`, `an honor`, `a horror`, `an S` and more.

> **Get the Code**
>
> - [Minified](https://github.com/ChapelR/harlowe-macro-api/blob/master/examples/minified/articles.min.js) 
>- [Pretty](https://github.com/ChapelR/harlowe-macro-api/blob/master/examples/articles.js)

### Macro: `(article:)`

This is the main macro in this script. When provided a string of text, it will return that text appended with the correct article. If you pass `true` as a second argument, the resulting article will also be capitalized.

#### Syntax

```
(article: text [, capitalize])
```

#### Arguments

- `text` ( *`string`* ) A string of text to append an article to.
- `capitalize` ( *`boolean`* ) ( optional ) Whether to capitalize the result.

#### Returns

( *`string`* ) The text appended with an article, optionally capitalized.

#### Examples

```
(article: 'UFO', true) <!-- A UFO -->
(article: 'European') <!-- a European -->
(article: 'eleven', true) <!-- An eleven -->
(article: 'angel') <!-- an angel -->
(article: 'honor', true) <!-- An honor -->
(article: 'idol')  <!-- an idol -->
```

### Macro: `(set-article:)`

This utility macro can be used to create an **override** which will associate the indicated article with the indicated text string. If the third argument is `true`, the text must match exactly to cause the override.

!> The **best** place for a call to the `(set-article:)` macro is a [`startup`-tagged passage](https://twine2.neocities.org/#passagetag_startup).

#### Syntax

```
(set-article: article, text [, matchCase])
```

#### Arguments

- `article` ( *`string`* ) The article ("a" or "an") to use.
- `text` ( *`string`* ) The text to override the article of.
- `matchCase` ( *`boolean`* ) ( optional ) If included and `true`, only exact case matches of the text will be overridden.

#### Returns

Nothing.

#### Examples

```
(set-article: 'a', 'US', true)

(article: 'us')-vs-them situation <!-- an us-vs-them situation -->
(article: 'US') citizen <!-- a US citizen -->
```

