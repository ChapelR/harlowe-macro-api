## Achievements

Based on an [improvement by Greyelf](https://gist.github.com/greyelf/55a45f461ded3d90a0cc28412187db0a) to [a system by yours truly](http://twinery.org/questions/22857/making-achievements-in-harlowe?show=22857) for creating "achievements." These achievements are not based on any sort of user account, instead achievement data is simply persisted to local storage. This data will survive game restarts and will persist across saves and loads.

> **Get the Code**
>
> - [Minified](https://github.com/ChapelR/harlowe-macro-api/blob/master/examples/minified/achievements.min.js) 
> - [Pretty](https://github.com/ChapelR/harlowe-macro-api/blob/master/examples/achievements.js)

### Macro: `(ach-add:)`

Adds the indicated achievement. If the player already has the achievement, nothing happens.

#### Syntax

```
(ach-add: achievement)
```

#### Arguments

- `achievement` ( *`string`* ) A text string used as an achievement.

#### Returns

Nothing.

#### Examples

```
(ach-add: 'Best Ending')
```

### Macro: `(ach-count:)`

Returns the total number of achievements the player currently has.

#### Syntax

```
(ach-count:)
```

#### Arguments

- None

#### Returns

( *`number`* ) The number of achievements.

#### Examples

```
(if: (ach-count:) is 100)[\
    You've unlocked all 100 achievements!\
]
```

### Macro: `(ach-has:)`

Returns whether the player has the indicated achievement.

#### Syntax

```
(ach-has: achievement)
```

#### Arguments

- `achievement` ( *`string`* ) A text string used as an achievement.

#### Returns

( *`boolean`* ) Returns `true` if the player has the indicated achievement, that is, if it has been added via `(ach-add:)`.

#### Examples

```
(if: (ach-has: 'Best Ending')) [\
    You've gotten the best ending!\
]
```

### Macro: `(ach-print:)`

Renders a list of the player's achievements, separated by the indicated string.

#### Syntax

```
(ach-print: [separator])
```

#### Arguments

- `separator` ( *`string`* ) ( optional ) A text string used to separate the list, e.g. `", "`.  Uses a newline (`"\n"`) by default.

#### Returns

Nothing.

#### Examples

```
(ach-print:)
```

### Macro: `(ach-clear:)`

Completely and permanently removes all achievements the player has.

#### Syntax

```
(ach-clear:)
```

#### Arguments

- None

#### Returns

Nothing.

#### Examples

```
(ach-clear:)
```

### Macro: `(achievements:)`

Returns an array of the player's achievements.

#### Syntax

```
(achievements:)
```

#### Arguments

- None

#### Returns

( *`array`* ) An array of the player's achievements.

#### Examples

```
(for: each _ach, ...(achievements:))[
    <!-- do something useful -->
]
```

