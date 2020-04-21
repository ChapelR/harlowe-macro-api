## Notify

Creates a quick user notification that rolls out from the top right of the screen, hangs for a minute, and rolls back in, useful for a quick note about status updates, achievements, or whatever else when a dialog box is a bit too much. Ported over from the similar CMFSC2 macro.

> - **Get the Code**
>
>   - [Minified](https://github.com/ChapelR/harlowe-macro-api/blob/master/examples/minified/notify.min.js) 
>   - [Pretty](https://github.com/ChapelR/harlowe-macro-api/blob/master/examples/notify.js)
> - **Required CSS**
>   - [Minified](https://github.com/ChapelR/harlowe-macro-api/blob/master/examples/minified/notify.min.css) 
>   - [Pretty](https://github.com/ChapelR/harlowe-macro-api/blob/master/examples/notify.css)

### Macro: `(notify:)`

Creates and displays a quick notification and renders the content of the associated hook into it.

#### Syntax

```
(notify: [delay] [, classList])[ ... ]
```

#### Arguments

- `delay` ( *`time`* ) ( optional ) A CSS-style time value (e.g., `5s`, `500ms`) for controlling how long the notification should remain. A short animation plays before and after this delay. Defaults to two seconds.
- `classList` ( *`string`* | *`string array`* ) ( optional ) You may pass a single string of space separated class names (e.g. `"my-class another-class a-third-class"`), an array of strings, or simply list several different strings as arguments to the macro to have them added to the `#notify` element for styling. You must include a delay time to add classes

#### Returns

Nothing.

#### Examples

```
<!-- a two second, basic notification -->
(notify:)[Inventory updated.]

<!-- a ten second long notification with a custom class -->
(notify: '10s', 'my-class')[Achievement unlocked.]

<!-- a five second notification -->
(notify: '5000ms')[Gold earned.]
```

#### Note

Giving the player unlimited control over these notifications, or trying to show several at once or right after each other will cause them to trip over themselves as they try to animate, so try to keep them spaced out, and don't assign them to links or buttons you expect the player to press repeatedly.