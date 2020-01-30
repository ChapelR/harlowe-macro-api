// jshint browser: true, esversion: 5

/*
    Harlowe.macro(name, handler [, changer]) -> creates a new macro with the given name. if a changer is passed,
        the macro is automatically registered as a changer macro and can be attached to hooks the handler and 
        changer functions are provided with arguments from the macro invocation, and an execution context provided
        by a MacroContext instance created at the time of the macro's invocation.
*/

(function () {
    'use strict';

    var _macros = Harlowe.API_ACCESS.MACROS;
    var _changer = Harlowe.API_ACCESS.CHANGER;

    function simpleMacro (name, cb) {
        // a basic macro cannot have a hook
        _macros.add(name, function () {

            var arr = Harlowe.helpers.arrayify(arguments, 1);

            var context = Harlowe.MacroContext.create(name, arr, {
                type : 'basic',
                fn : 'handler'
            });

            var result = cb.apply(context, arr);

            return (result == null) ? '' : result;

        }, _macros.TypeSignature.zeroOrMore(_macros.TypeSignature.Any));

    }

    function simpleChangerMacro (name, cb, changer) {
        // a simplified changer macro
        _macros.addChanger(name, function () {

            var arr = Harlowe.helpers.arrayify(arguments, 1);
            var changer = _changer.create(name, arr);

            var context = Harlowe.MacroContext.create(name, arr, {
                type : 'changer',
                fn : 'handler',
                instance : changer
            });

            cb.apply(context, arr);
            return changer;

        }, function () {

            var arr = Harlowe.helpers.arrayify(arguments);
            var d = arr.shift();

            var context = Harlowe.MacroContext.create(name, arr, {
                type : 'changer',
                fn : 'changer',
                descriptor : d
            });

            changer.apply(context, arr);

        }, _macros.TypeSignature.zeroOrMore(_macros.TypeSignature.Any));
    }

    function macro (name, cb, changer) {
        if (!name || typeof name !== 'string' || !name.trim()) {
            throw new TypeError('Invalid macro name.');
        }
        if (!cb || typeof cb !== 'function') {
            throw new TypeError('Invalid macro handler.');
        }
        if (changer && typeof changer === 'function') {
            simpleChangerMacro(name, cb, changer);
        } else {
            simpleMacro(name, cb);
        }
    }


    // export API to global "Harlowe" object
    window.Harlowe = Object.assign(window.Harlowe || {}, {
        macro : macro
    });
}());