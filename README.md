# Chapel's Unofficial Custom Macro API for Harlowe

This code adds (more accurately recreates) a macro API to Harlowe to allow users to create and distribute custom macros. Place the contents of `macro.min.js` into your story JavaScript and use the API as described below to create macros. Generally speaking, the code of `macro.min.js` should be the first thing in your JavaScript section in Twine 2, or the first JS file compiled by your compiler.

This is unofficial code, and relies on hacks. Future versions of Harlowe may break it at any time. Intended for Harlowe 3. May work in Harlowe 1 or 2, but bugs or issues in those versions of Harlowe **will not be fixed**.

This documentation is intended for people who *make* custom macros, so it may be a bit technical. If you were sent here by some script written by some author and can't figure out what to do, go [here](installation-guide.md). It is recommended that macro creators similarly point their end users to the installation guide linked above rather than to this README or the repo in general.

## Macro API

### Function: `Harlowe.macro()`

This function can be used to create new macros. Two generic types of macros can be created; *command* macros (like `(prompt:)`, `(set:)`, `(num:)`, etc), and *changer* macros (like `(if:)`, `(font:)`, `(hidden:)`, etc). Generally speaking, command macros run a single function and then either return the result, or perform some other kind of action. Changer macros are attached to hooks and perform some action on said hooks (called **descriptors** internally).

#### Syntax

```javascript
Harlowe.macro(name, handler [, changer])
```

Including the `changer` argument causes a changer macro to be created. Omitting the argument will create a command macro.

#### Arguments

- `name` ( *`string`* ) The name to give the macro. For example, the name `"blue"` would create a macro called like this: `(blue:)`. Valid macro names should generally consist of only lowercase Latin letters.
- `handler` ( *`function`* )  The handler function. For changer macros it is run when the macro is executed, before rendering, and can be used for tasks that need to happen immediately. Not every changer macro will require a handler, pass an empty function `funciton () {}` is you don't need it. The arguments passed to the macro are passed to the function as arguments. There is also a *macro content* similar (superficially) to SugarCube's macro API that you may access (see below).
- `changer` ( *`function`* ) ( optional ) The changer function, which is run during the rendering process. Including this argument creates a changer macro, while omitting it creates a command macro. You can access the hook content (called a *descriptor*) from the macro context. Like handlers, macro arguments are passed through.

#### Context

You can use the JavaScript `this` keyword to access the *macro context* from within handler and changer functions. The following properties are available in the macro context:

-  `this.name` ( *`string`* ) The name of the macro.
- `this.args` ( *`array`* )  An array of arguments passed to the macro invocation--an empty array if no arguments are provided.
- `this.instance` ( *`a ChangerCommand instance`* ) This is the instance of the changer command created by a changer macro. This property is only available to the handler (not the changer function) of a changer macro.
- `this.descriptor` ( *`a ChangerDescriptor instance`* ) This is the descriptor (which represents the attached hook) of a changer macro. This property is only available to the changer function of changer macros.

**Example contexts:**

```javascript
// given the command macro: (mymacro: 'hello world!'), the context would look like:
{
    name : 'mymacro',
    args : ['hello world!']
}

// given the changer macro: (anothermacro: 1, 2, 'buckle my shoe')[3 4 shut the door], the context would look like:
{
    name : 'anothermacro',
    args : [1, 2, 'buckle my shoe'],
    instance : (a ChangerCommand instance) {
        name : 'anothermacro',
        params : [1, 2, 'buckle my shoe'],
        [...]
    },
    descriptor : (a ChangerDescriptor instance) {
        attr : [],
        styles : [],
        enabled : (boolean),
        source : '3 4 shut the door',
        section : (section instance data),
        [...]
    }
}
```

### Creating Command Macros

Creating command macros is fairly straight-forward. 

TODO

### Creating Changer Macros 

Changer macros are significantly more complex than command macros.

TODO

#### Descriptors

When you act on descriptors in your changer macros, you'll need to know what it's parameters do, and what particular options you have built-in at your finger tips. This section will go over some basic and common use-cases for descriptors.

TODO

## Other APIs

This section details some JavaScript APIs that this script exposes to help you work with Harlowe in your macros (and out of your macros). You can access the actual Harlowe APIs (see below), but certain parts of Harlowe, specifically the History system, are fragile, and this group of APIs only exposes safe things, or exposes dangerous things in safer ways, so it is recommended over messing with Harlowe's APIs yourself. 

### Function: Harlowe.passage()

Returns the name of the current passage.

#### Syntax

```javascript
Harlowe.passage()
```

#### Arguments

- none.

#### Returns

( *`string`* ) The name of the current passage.

#### Examples

```javascript
console.log(Harlowe.passage()); // logs the name of the current passage to console
```

### Function: Harlowe.goto()

Go to a named passage. Adds a new moment in the history, regardless of where the user is sent.

#### Syntax

```javascript
Harlowe.goto(passage)
```

#### Arguments

- `passage` ( *`string`* ) The name of a passage.

#### Returns

Nothing.

#### Examples

```javascript
Harlowe.goto('some passage'); // navigate to the passage named "some passage"
```

### Function: Harlowe.variable()

Get or set Harlowe variables. Will error if data that Harlowe is incapable of properly serializing is set to a variable.

#### Syntax

```javascript
Harlowe.variable(varName [, value])
```

#### Arguments

- `varName` ( *`string`* ) A valid Harlowe story variable identifier. Must *not* be a temporary variable and must include the sigil (`$`).
- `value` ( *`any`* ) ( optional ) A value Harlowe can serialize. Will throw if an invalid value is used. Always check the type of values potentially provided by users before setting it to a Harlowe variable. 

#### Returns

( *`any`* ) The value of the indicated variable, or `undefined` if it doesn't exist and wasn't set.

> Note: Harlowe returns `0` to users when they attempt to access or use `undefined` values, it may be wise for your macros and code to replicate this.

#### Examples

```javascript
// given (set: $myVar to 'hello')
Harlowe.variable('$myVar'); // 'hello'
Harlowe.variable('$myVar', 'goodbye'); // 'goodbye'
```

### Function: Harlowe.visited()

See how many times the user has visited the indicated passage.

> Note: Harlowe has a built-in `visits` keyword that can be used in passages.

#### Syntax

```javascript
Harlowe.visited([passage]);
```

#### Arguments

- `passage` ( *`string`* ) ( optional )The name of a passage. If none is provided, defaults to the current passage.

#### Returns

( *`number`* ) The number of times the passage has been visited.

#### Examples

```javascript
if (Harlowe.visited('bar') < 3) {
    alert("You haven't been to the bar much.");
}
```

```
(if: Harlowe.visited() > 100)[ You must like this passage! ]
```

### Function: Harlowe.hasVisited()

Returns whether the user has ever visited the indicated passage.

> Note: Harlowe has a built-in `visits` keyword that can be used in passages. Compare it with `0` to get the same result as this function.

#### Syntax

```javascript
Harlowe.hasVisited([passage]);
```

#### Arguments

- `passage` ( *`string`* ) ( optional )The name of a passage. If none is provided, defaults to the current passage.

#### Returns

( *`boolean`* ) Return `true` if the user has ever been to the indicated passage, `false` otherwise.

#### Examples

```javascript
if (!Harlowe.hasVisited('bar')) {
    alert("You haven't been to the bar yet.");
}
```

```
(if: Harlowe.hasVisited('school'))[ You went to school before! ]
```

### Function: Harlowe.turns()

Returns the length of the history (does not include undone future moments).

> Note: In passages, you can check `(history:)'s length` for a turn count.

```javascript
Harlowe.turns();
```

#### Arguments

- none.

#### Returns

( *`number`* ) The number of passages in the history. This is the number of moments the user has played, excluding undone or abandoned moments.

#### Examples

```
if (Harlowe.turns() > 100) {
    console.log('You have been playing for a while!');
} 
```

## API_ACCESS

You can directly access Harlowe APIs using the following properties of the `Harlowe.API_ACCESS` object. Do so at your own risk, it's easy to break shit.

- `MACROS`: `Harlowe.API_ACCESS.MACROS` includes Harlowe's entire Macros API.
- `STATE`: `Harlowe.API_ACCESS.STATE` includes Harlowe's entire State API.
- `ENGINE`: `Harlowe.API_ACCESS.ENGINE` includes Harlowe's entire Engine API.
- `CHANGER`: `Harlowe.API_ACCESS.CHANGER` includes Harlowe's entire ChangerCommand API.

These are the only APIs included in this script.

## Unsolicited Advice for Macro Creators

This macro API does not attempt to replicate Harlowe's actual macro API, which was probably never intended to be used by anyone outside Harlowe's source code--that is, it really, really isn't meant to be used from within story JavaScript and it shows.

This script attempts to replicate an external API, like SugarCube's or Sugarcane's. This means the macro API has been *massively* simplified; things like type checks and built-in error reporting has been totally written around. So custom macros are far less error resistant and fail far less gracefully than the standard library, and macro writers are encourage to include sane defaults and healthy amounts of error checking in their handler and changer functions.

