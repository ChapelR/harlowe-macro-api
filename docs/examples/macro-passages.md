## Macro Passages

By [rachek64](https://github.com/rachek64).

Allows you to run passages inline, similar to `(display:)`, but with no output and with the option of passing arguments to the passage, similar to SugarCube's widgets.

> **Get the Code**
>
> - [Minified](https://github.com/ChapelR/harlowe-macro-api/blob/master/examples/third-party/minified/macro-passages.min.js) 
> - [Pretty](https://github.com/ChapelR/harlowe-macro-api/blob/master/examples/third-party/macro-passages.js)

### Macro: `(macro:)`

Runs a macro passage, defined by adding the `macro` tag to a passage. If you add both the `macro` tag and the `auto-macro` tag, a first-class, named macro will be created.

#### Syntax

```
(macro: passage [, argsList])
```

#### Arguments

- `passage` ( *`string`* ) The name of a passage with the tag `macro`. The passage's code will be run with the given arguments.
- `args` ( *`any`* ) ( optional ) Arguments to be passed on to the passage, which may be accessed as an array using the temporary variable `_args`. Just list arguments separated by commas after the passage name.

#### Returns

Optionally returns the value given to the `_result` temporary variable, or nothing.

#### Examples

```
:: damage [macro]
<!-- reduces the player HP by the given number -->
(set: $player's hp to it - _args's 1st)
(if: $player's hp <= 0)[
	(goto: 'game over')
]

:: some passage
The enemy attacks!
(macro: 'damage', $enemy's attack)
You take (print: $enemy's attack) damage and have (print: $player's hp) health remaining.

:: say-hi [macro auto-macro]
<!-- using the `auto-macro` tag makes a standalone custom macro! -->
(set: _result to 'Hi, ' + _args's 1st + '.')

:: some other passage
(alert: (say-hi: 'Bob')) <!-- alerts "Hi, Bob." -->
```

### Additional Usage Notes

* The entire macro-tagged passage should run at once (i.e., no `(prompt:)`, `(live:)`, or similar "delayed" commands) and they cannot display any output. This is suitable for code-only macros that perform complex calculations or automate repetitive tasks. If you need to print results, just return the results from the macro with `_result` and print it outside.
* No text is displayed while running the macro passage, nor can it have any
direct effect on the caller passage. The contents are rendered into a
dummy screen that is never shown on the page.
* This means you can nicely comment your macro with plain text. No need to use `{}`
  or worry about line breaks or spacing.
* This also means no user input is possible. If you render a link to click,
  it will never be able to be clicked. The macro will complete assuming the link
  wasn't clicked.
* User input in general is not possible in macro-tagged passages, nor can you run
asynchronous commands like (alert:) that pause the passage until you interact
with them. No errors will happen, but the value in `_result` may not be
picked up properly if it was changed after the delaying command was used.
* Saving and loading from inside a macro is, in general, a terrible idea. Just don't do it.
* Argument type checking is not possible at this time. If a macro takes arguments,
thoroughly inspect `_args` before attempting to use them.
* Unfortunately, errors in macro passages are handled a bit oddly. Error details
are provided as best as possible, but so far as Harlowe is concerned the error
occurred in the caller passage. Check the dropdown in the error bubble for the
actual line that triggered the error.