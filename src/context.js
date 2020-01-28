// jshint browser: true, esversion: 5

/*
    Harlowe.MacroContext() constructor -> creates an instance to be used as a `this` context for macro execution; 
        given to the functions called by macro definitions whenever a custom macro is invoked

    Harlowe.MacroContext.create(name, args, data) -> creates and returns a new MacroContext instance
        - name : name of the macro being invoked
        - args : array of arguments passed into the macro invocation
        - data : an object containing additional invocation properties

    context#clone() -> returns a deep copy of the context instance
    context#syntax() -> returns the macro's name wrapped with harlower syntax elements, e.g. 'test' -> '(test:)'
    context#error(msg [, alert]) -> creates an error and returns it; optionally creates an alert
    context#typeCheck(typeList) -> parses a list of argument types and checks them against passsed args.
        if a mismatch is found an error is generated and returned, otherwise nothing (undefined) is returned.
*/

(function () {
    'use strict';
    
    // context prototype, private use only
    function MacroContext (name, args, data) {
        if (!(this instanceof MacroContext)) {
            return new MacroContext(name, args, data);
        }
        this.name = name || 'unknown';
        this.args = args || [];
        this.data = data || {};
        this.type = (data && data.type) || 'basic';
        this.fn = (data && data.fn) || 'handler';

        if (this.type === 'changer') {
            if (this.fn === 'handler') {
                this.instance = (data && data.instance) || null;
            } else {
                this.descriptor = (data && data.descriptor) || null;
            }
        }
    }

    MacroContext.create = function (name, args, data) {
        if (!name || typeof name !== 'string' || !name.trim()) {
            throw new TypeError('Invalid macro name.');
        }
        if (!args || !(args instanceof Array)) {
            args = [];
        }
        if (!data || typeof data !== 'object') {
            data = { type : 'basic', fn : 'handler' };
        }
        return new MacroContext(name, args, data);
    };

    Object.assign(MacroContext.prototype, {
        clone : function () {
            return MacroContext.create(this.name, this.args, this.data);
        },
        // return syntax string
        syntax : function () {
            return '(' + this.name + ':)';
        },
        // throw targeted errors from inside macros
        error : function (message, warn) {
            var msg = 'Error in the ' + this.syntax() + ' macro: ' + message;
            if (warn) {
                alert(msg);
            }
            console.warn('HARLOWE CUSTOM MACRO ERROR -> ', msg);
            return new Error(message);
        },
        // check types of args: `this.typeCheck(['string|number', 'any'])`
        typeCheck : function (types) {
            if (!types || !(types instanceof Array)) {
                types = Harlowe.helpers.arrayify(arguments);
            }
            var self = this;
            var check = [];
            types.forEach( function (type, idx) {
                var thisIsArg = idx + 1, list = [];
                if (typeof type !== 'string') {
                    return;
                }
                if (type.includes('|')) {
                    list = type.split('|').map( function (t) {
                        return t.trim().toLowerCase();
                    });
                } else {
                    list = [ type.trim().toLowerCase() ];
                }
                if (list[0] === 'any' || list.some( function (t) {
                    return (typeof self.args[idx]) === t;
                })) {
                    return;
                } else {
                    check.push('argument ' + thisIsArg + ' should be a(n) ' + list.join(' or '));
                }
            });
            if (check.length) {
                return self.error(check.join('; '));
            }
        }
    });

    window.Harlowe = Object.assign(window.Harlowe, {
        MacroContext : MacroContext
    });
}());