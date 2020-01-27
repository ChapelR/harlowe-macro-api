## Dice

A simple dice roller for Harlowe that can accept discreet numbers or dice notation (e.g., `1d6+1`). Ported over from [CMFSC2](http://macros.twinelab.net/). The roller down not merely select a random between the minimum and maximum but instead simulates each roll to produce realistically weighted results.

> **Get the Code**
>
> - [Minified](https://github.com/ChapelR/harlowe-macro-api/blob/master/examples/minified/dice.min.js) 
> - [Pretty](https://github.com/ChapelR/harlowe-macro-api/blob/master/examples/dice.js)

### Macro: `(dice:)`

Rolls the indicated type of dice in the indicated quantity and optionally adds (or subtracts) a modifier from the roll then returns the result.

#### Syntax

```
(dice: notation)
(dice: number, sides [, modifier])
```

#### Arguments

- `notation` ( *`string`* ) A string of valid dice notation, e.g., `"1d6"`, `"3d8+3"`, `"2d10 - 2"`, etc. Fate/Fudge dice are also supported (e.g., `"3dF"`).
- `number` ( *`number`* ) The number of dice to roll.
- `sides` ( *`number`* | *`string`* ) The sides or type of dice to roll (`"F"` is the only accepted string value).
- `modifier` ( *`number`* ) ( optional ) The modifier; a flat number to add to the dice roll. May be negative to represent a subtraction.

#### Returns

( *`number`* ) The result of the roll.

#### Examples

```
<!-- all of the following roll 3 six-sided dice and add 10: -->
(set: _roll to (dice: '3d6+10'))
(set: _roll to (dice: '3d6 + 10'))
(set: _roll to (dice: 3, 6, 10))
(set: _roll to (dice: 3, 6) + 10)
```

