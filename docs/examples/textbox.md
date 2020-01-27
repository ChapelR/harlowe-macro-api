## Textbox

A textbox macro. For Harlowe. Fuck `(prompt:)`.

> **Get the Code**
>
> - [Minified](https://github.com/ChapelR/harlowe-macro-api/blob/master/examples/minified/textbox.min.js) 
> - [Pretty](https://github.com/ChapelR/harlowe-macro-api/blob/master/examples/textbox.js)

### Macro: `(textbox:)`

Enter a variable **in quotes** to save the user input in, optional placeholder text, and bam, you have a text input.

#### Syntax

```
(textbox: receiverVariable [, placeholder])
```

#### Arguments

- `receiverVariable` ( *`string`* ) A string of a variable; that is a variable name in quotes. Must be a story variable, not a temporary variable. For example, `"$name"`.
- `placeholder` ( *`string`* ) ( optional ) Text that appears whenever the box is empty, usually providing some hint as to what the textbox is for, e.g., `"Enter your name..."`.

#### Returns

Nothing.

#### Examples

```
(set: $name to '')\
(textbox: '$name', 'Please enter your name...')

{
(link-repeat: 'Submit')[
    (if: $name is '')[
        (replace: ?error)[Please enter a name.]
    ](else:)[
        (goto: 'textbox-name')
    ]
] []<error|
}
```

