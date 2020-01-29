## Clamp

A macro wrapper for [this cookbook recipe](https://twinery.org/cookbook/clamping_numbers/harlowe/harlowe_clamping_numbers.html).

> **Get the Code**
>
> - [Minified](https://github.com/ChapelR/harlowe-macro-api/blob/master/examples/minified/clamp.min.js) 
> - [Pretty](https://github.com/ChapelR/harlowe-macro-api/blob/master/examples/clamp.js)
>

### Macro: `(clamp:)`

Clamps a numeric value within a given range and returns that value.

#### Syntax

```
(clamp: value, min, max)
```

#### Arguments

- `value` ( *`number`* ) A number that needs clamped.
- `min` ( *`number`* ) The lower bound the result should not exceed.
- `max` ( *`number`* ) The upper bound the result should not exceed.

#### Returns

( *`number`* ) The value, clamped.

#### Examples

```
(set: _clamp to (clamp: 100 + 100, 0, 167))   <!-- 167 -->
(set: _clamp to (clamp: 100 - 1000, 0, 1000)) <!--   0 -->
(set: _clamp to (clamp: _clamp + 10, 11, 15)) <!--  11 -->

<!-- setting HP in a game, after healing or taking damage -->
(set: $hp to (clamp: $hp, 0, $maxhp))
```
