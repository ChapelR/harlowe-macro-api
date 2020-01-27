## Playtime

A simplified playtime tracking system ported over from [CMFSC2](http://macros.twinelab.net/). Keeps track of the amount of time the player has been playing across the entire game, and is preserved across saves.

> **Get the Code**
>
> - [Minified](https://github.com/ChapelR/harlowe-macro-api/blob/master/examples/minified/playtime.min.js) 
> - [Pretty](https://github.com/ChapelR/harlowe-macro-api/blob/master/examples/playtime.js)

### Macro: `(playtime:)`

Returns or displays the playtime. You can pass in a string to indicate that you'd like a *specific* part of the playtime, like just the hours or just the minutes.

#### Syntax

```
(playtime: [what])
```

#### Arguments

- `what` ( *`string`* ) ( optional ) You can return a specific value, or a string, formatted or not. Valid values are: 
  - `"hours"` returns the hours
     - `"minutes"` returns the minutes
  - `"seconds"` returns the seconds
  - `"milliseconds"` returns the milliseconds elapsed
  - `"format"` returns a formatted time string--the hours and minutes are bolded
  - omitting this argument results in a non-bolded string      

#### Returns

( *`number`* | *`string`* ) The playtime string, optionally formatted, or the indicated numerical value.

#### Examples

```
Playtime: (playtime: 'format')
Hours: (playtime: 'hours')
Seconds: (playtime: 'seconds')

Self-updating playtime: (live: 1s)[(playtime:)]
```

