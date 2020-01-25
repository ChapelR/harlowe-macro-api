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
- `handler` ( *`function`* )  The handler function. For changer macros it is run when the macro is executed, before rendering, and can be used for tasks that need to happen immediately. Not every changer macro will require a handler, pass an empty function `function () {}` if you don't need it. The arguments passed to the macro are passed to the function as arguments. There is also a *macro context* similar (superficially) to SugarCube's macro API that you may access (see below).
- `changer` ( *`function`* ) ( optional ) The changer function, which is run during the rendering process. Including this argument creates a changer macro, while omitting it creates a command macro. You can access the hook content (called a *descriptor*) from the macro context. Like handlers, macro arguments are passed through.

#### Context Properties

You can use the JavaScript `this` keyword to access the *`MacroContext`* instance from within handler and changer functions. The following properties are available in the macro context:

-  `this.name` ( *`string`* ) The name of the macro.
- `this.args` ( *`array`* )  An array of arguments passed to the macro invocation--an empty array if no arguments are provided.
- `this.instance` ( *`a ChangerCommand instance`* ) This is the instance of the changer command created by a changer macro. This property is only available to the handler (not the changer function) of a changer macro.
- `this.descriptor` ( *`a ChangerDescriptor instance`* ) This is the descriptor (which represents the attached hook) of a changer macro. This property is only available to the changer function of changer macros.

#### Context Methods

In addition to the above properties, the macro context also has the following methods.

- `this.error(message [, alert])` This method can be used to generate an error. The error object will be returned so that you can catch or throw it. The error message will be logged to the console, and optionally can generate an alert. Do not generate an alert if you intend to throw the error.
  - `message` ( *`string`* ) The message to pair with the error.
  - `alert` ( *`boolean`* ) If truthy, creates an alert with the error message.
  - **Returns**: An `Error` instance.
- `this.typeCheck(typeList)` This method allows you to quickly check arguments against a list of types. If there is a mismatch, an `Error` instance is returned, prefilled with all the issues as a message.
  - `typeList` ( *`string array`* ) An array of string types, like `"string"` or `"number"`. You can use the special keyword `"any"` to accept any type, and check for one of a list of types using the pipe to separate them, e.g. `"number|boolean"` would check for a number or boolean. The array of types should be provided in the same order as the arguments are expected.
  - **Returns**: An `Error` instance if any errors are found or `undefined` if no errors are found.

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

Creating command macros is fairly straight forward. 

Command macros need a name and a handler function and can return values to be used as arguments to other macros or to be displayed to users. For example:

```javascript
Harlowe.macro('mymacro', function () {
    return 'Hey there!';
});
```

In a passage:

```
(set: $var to (mymacro:))
$var <!-- 'Hey there!' -->
```

You can read the arguments passed to a macro as well:

```javascript
Harlowe.macro('greet', function (name) {
    return 'Hey, ' + name + '!';
});
```

In passage:

```
(set: $var to (greet: 'Bob'))
$var <!-- 'Hey, Bob!' -->
(greet: 'Jane') <!-- 'Hey, Jane!' -->
```

Of course, checking to make sure you get the arguments you expect, or setting up sane defaults is always wise:

```javascript
Harlowe.macro('greet', function (name) {
    if (!name || typeof name !== 'string' || !name.trim()) {
        name = 'Player';
    }
    return 'Hey, ' + name + '!';
});
```

You may opt instead to throw errors:

```javascript
Harlowe.macro('greet', function (name) {
    if (typeof name !== 'string' || !name.trim()) {
        throw new TypeError('The "name" parameter of the (' + this.name + ':) macro should be a non-empty string!');
    }
    return 'Hey, ' + name + '!';
});
```

You can use the context methods described above to generate errors:

```javascript
Harlowe.macro('greet', function (name) {
    if (typeof name !== 'string' || !name.trim()) {
        throw this.error('The "name" parameter should be a non-empty string!');
    }
    return 'Hey, ' + name + '!';
});
```

You can use the `context#typeCheck()` method to simplify type checking arguments to be even simpler, though you can only check for types, not for non-empty strings. You also cannot check *instances* like arrays.

```javascript
Harlowe.macro('greet', function (name) {
    var err = this.typeCheck(['string']); 
    if (err) { // if no errors are found, nothing (e.g., undefined) is returned
        throw err;
    }
    return 'Hey, ' + name + '!';
});
```

Macros do not need to return anything in specific and can also be used to simply run any arbitrary JavaScript code.

```javascript
Harlowe.macro('log', function (content) {
    if (content !== undefined) {
        console.log(content);
    }
});
```

You can access arguments via the macro context (via `this`) instead of the function's parameters:

```javascript
Harlowe.macro('log', function () {
    if (this.args[0] !== undefined) { // this.args[0] is the first argument
        console.log(this.args[0]);
    }
});
```

You can also access the macro's name through the macro context:

```javascript
Harlowe.macro('log', function () {
    if (this.args[0] !== undefined) {
        console.log('The macro (' + this.name + ':) says:', this.args[0]);
    }
});
```

### Creating Changer Macros 

Changer macros are significantly more complex than command macros. Fortunately, most of what applies to command macros also applies to these macros. The biggest difference is that you can't return anything from the handlers of changer macros, and that changer macros have an additional changer function argument that handles most of the actual logic.

Let's look at an incredibly basic changer macro, a macro that simply suppresses content.

```javascript
Harlowe.macro('silently', function () {}, function () {
    this.descriptor.enabled = false;
});
```

The above code suppressed output *and execution*:

```
This content is visible. (set: $num to 1)

$num <!-- 1 -->

(silently:)[You won't see this disabled content! (set: $num to 3)]

$num <!-- 1 -->
```

You have access to the descriptor source, which lets you alter it:

```javascript
Harlowe.macro('p', function () {}, function () {
    this.descriptor.source = '<p class="p-macro">' + this.descriptor.source + '</p>';
});
```

The `(p:)` macro above wraps it's source content in a `<p>` element with the class `.p-macro`. Easy!

How about altering styles?

```javascript
Harlowe.macro('red', function () {}, function () {
    this.descriptor.attr.push( { 
        style : function () {
            return 'color: red;';
        }
    });
});
```

A more advanced color macro (Harlowe doesn't need one, but still):

```javascript
Harlowe.macro('magiccolor', function () {
    var err = this.typeCheck(['string']);
    if (err) throw err;
}, function (color) {
    this.descriptor.attr.push( { 
        style : function () {
            return 'color: ' + color + ';';
        }
    });
});
```

You aren't limited to just doing things the Harlowe way, though. The descriptor also has a `target` property that contains a jQuery instance of the `<tw-hook>` element your changer macro is working on.

```javascript
Harlowe.macro('classy', function () {
    var err = this.typeCheck(['string']);
    if (err) throw err;
}, function (cls) {
    this.descriptor.target.addClass(cls);
});
```

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

