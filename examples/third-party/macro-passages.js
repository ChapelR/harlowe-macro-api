(function () {
  /**
     ## Macro Passages
     For use with https://github.com/ChapelR/harlowe-macro-api/
      BY: rachek64 (https://gist.github.com/rachek64), with alterations by Chapel.
    
     Adds the (macro:) macro that lets you run entire passages inline.
     This gives you full access to twinescript without the need for javascript.
     
     Make a passage and tag it with `macro`. Add whatever commands you want to
     calculate a value, set variables, or perform some sort of routine task.
     
     The only limitations are the entire passage should run at once (i.e. no (prompt:),
     (live:), or similar "delayed" commands) and they cannot display any output. This is
     suitable for code-only macros that perform complex calculations or automate repetative
     tasks. If you need to print results, just return the results from the macro and print
     it outside.
    
     Use (macro: "macro passage name", [...arguments]) to run the macro passage.
     The passage name must exactly match, unless you make it into an auto-macro (see below).
    
     Arguments passed into the macro call can be accessed by the macro passage in _args
     (yes, it's a temporary variable) as an array. No temporary variables from the caller
     passage are available inside a macro passage, because there's no way to guarantee consistency.
     Global variables are available as usual.
    
     If the macro calculates a value, it can be returned by assigning a value to _result.
     This value will be passed through as the result of the (macro:) call, so you could
     do something like `(set: _totalCost to (macro:"calculate total cost", _price, _quantity, _taxRate))`
     and _totalCost will be set to whatever _result was set to in the `"calculate total cost"` passage.
    
     ### Auto Macros
     For added utility, tagging a passage with both `macro` and `auto-macro` will make the
     passage into a first-class macro on startup by Harlowe-ifying the passage name. The
     example above would become `(calculate-total-cost: _price, _quantity, _taxRate)`.
     Normal Harlowe name-matching rules apply, and creating different passages with the
     same name or the name of built-in macros will throw errors about redefining things.
    
     ## Notes
     * No text is displayed while running the macro passage, nor can it have any
       direct effect on the caller passage. The contents are rendered into a
       dummy screen that is never shown on the page.
     ** This means you can nicely comment your macro with plain text. No need to use `{}`
        or worry about line breaks or spacing.
     ** This also means no user input is possible. If you render a link to click,
        it will never be able to be clicked. The macro will complete assuming the link
        wasn't clicked.
     * User input in general is not possible in macro passages, nor can you run
       asynchronous commands like (alert:) that pause the passage until you interact
       with them. No errors will happen, but the value in `_result` may not be
       picked up properly if it was changed after the delaying command was used.
     * Saving and loading from inside a macro is, in general, a terrible idea. Just don't do it.
     * Argument type checking is not possible at this time. If a macro takes arguments,
       thoroughly inspect _args before attempting to use them.
     * Unfortunately, errors in macro passages are handled a bit oddly. Error details
       are provided as best as possible, but so far as Harlowe is concerned the error
       occured in the caller passage. Check the dropdown in the error bubble for the
       actual line that triggered the error.
   */

   "use strict";

    function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

    var Passages = require('passages');
    var TwineError = require('internaltypes/twineerror');
    var Section = require('section');
    var VarScope = require('internaltypes/varscope');

    function macrocall(name) {
        if (!Passages.hasValid(name)) return TwineError.create('macro', '(macro:) The passage "' + name + '" does not exist.');
        var passage = Passages.get(name);
        if (!passage.get('tags').includes('macro')) return TwineError.create('macro', '(macro:) The passage "' + name + '" is not marked with the "macro" tag.', "Custom macros are opt-in via the macro tag to reduce the likelihood of running a non-macro formatted passage on accident.");
        var source = passage.get('source');
        var dummy = $(document.createElement('p'));
        dummy.attr({
            tags: ''
        });
        var dummySection = Section.create(dummy);
        var tempVars = Object.create(VarScope);

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        tempVars.args = args;
        dummySection.renderInto(source, dummy, undefined, tempVars); // If there was an error, it'll be rendered into the dummy section.
        // Rethrow it, extracting the relevant details.

        var error = dummy.find('tw-error').first();

        if (error.length != 0) {
            var context = error.attr('title');
            var message = error.textNodes()[0].textContent;
            var explanation = error.textNodes()[2].textContent;
            return TwineError.create('macro', '(macro:"' + name + '") ' + message, context + ': ' + explanation);
        }

        return tempVars.result;
    }

    Harlowe.macro('macro', macrocall);

    var _iterator = _createForOfIteratorHelper(Passages.getTagged('macro').filter(function (x) {
        return x.get('tags').includes('auto-macro');
    })),
    _step;

    try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var automacro = _step.value;
            var name = automacro.get('name');
            name = name.toLowerCase().replace(/[^a-z]/g, '');
            Harlowe.macro(name, macrocall.bind(this, automacro.get('name')));
        }
    } catch (err) {
        _iterator.e(err);
    } finally {
        _iterator.f();
    }
})();