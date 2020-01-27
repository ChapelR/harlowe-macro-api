## Hotkeys

A basic hotkey implementation: wrap a link with this macro, give it a keycode, and pressing the key will press the link.

> **Get the Code**
>
> - [Minified](https://github.com/ChapelR/harlowe-macro-api/blob/master/examples/minified/hotkeys.min.js) 
> - [Pretty](https://github.com/ChapelR/harlowe-macro-api/blob/master/examples/hotkeys.js)

### Macro: `(hotkey:)`

"Clicks" the first link (or other clickable element) found in the attached hook when the indicated key is pressed.

#### Syntax

```
(hokey: keycode [,once])[ ... ]
```

#### Arguments

- `keyycode` ( *`number`* ) The keycode of a key. https://keycode.info/ is a great resource for getting key codes.
- `once` ( *`boolean`* ) ( optional ) If true, the keypress will only trigger one time.

#### Returns

Nothing.

#### Examples

```
{
(set: $berries to 0)
(hotkey: 32)[
    (link-repeat: 'Press Space to Collect Berries')[
        (set: $berries to it + 1)
        (replace: ?berrycount)[$berries]
    ]
]
}
|berrycount>[$berries]
```

