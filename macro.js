// jshint environment: browser, esversion: 5
(function () {
    'use strict';

    // get the APIs: we have to do this in a blocking manner--failure to do so will cause order of operations problems later
    var _macros = require('macros');
    var _state = require('state');
    var _engine = require('engine');
    var _changer = require('datatypes/changercommand');

    // context prototype, private use only
    function MacroContext (name, args, data) {
        if (!(this instanceof MacroContext)) {
            return new MacroContext(name, args, data);
        }
        this.name = name || 'unknown';
        this.args = args || [];
        this.data = data || {};
        this.type = (data && data.type) || 'command';
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
            data = { type : 'command', fn : 'handler' };
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
                types = [].slice.call(arguments);
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

    function simpleCommandMacro (name, cb) {
        // a command macro can not have a hook
        _macros.add(name, function () {

            var arr = [].slice.call(arguments).slice(1);

            var context = MacroContext.create(name, arr, {
                type : 'command',
                fn : 'handler'
            });

            var result = cb.apply(context, arr);

            return (result == null) ? '' : result;

        }, _macros.TypeSignature.zeroOrMore(_macros.TypeSignature.Any));

    }

    function simpleChangerMacro (name, cb, changer) {
        // a simplified changer macro
        _macros.addChanger(name, function () {

            var arr = [].slice.call(arguments).slice(1);
            var changer = _changer.create(name, arr);

            var context = MacroContext.create(name, arr, {
                type : 'changer',
                fn : 'handler',
                instance : changer
            });

            cb.apply(context, arr);
            return changer;

        }, function () {

            var arr = [].slice.call(arguments);
            var d = arr.shift();

            var context = MacroContext.create(name, arr, {
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
            simpleCommandMacro(name, cb);
        }
    }

    // helper functions
    function isSerialisable (variable) {
        return (typeof variable === "number"|| 
            typeof variable === "boolean" || 
            typeof variable === "string" || 
            variable === null ||
            Array.isArray(variable) && variable.every(isSerialisable) ||
            variable instanceof Set && Array.from(variable).every(isSerialisable) ||
            variable instanceof Map && Array.from(variable.values()).every(isSerialisable) ||
            _changer.isPrototypeOf(variable));
    }
    function passage () {
        return _state.passage;
    }
    function goto (passage) {
        return _engine.goToPassage(passage);
    }
    function variable (name, set) {
        if (name[0] !== '$') {
            throw new Error('cannot access variable "' + name + '"');
        }
        name = name.substr(1);
        if (set !== undefined) {
            if (!isSerialisable(set)) {
                throw new Error('The value passed to variable "' + name + '" cannot be serialized.');
            }
            _state.variables[name] = set;
        }
        return _state.variables[name];
    }
    function visited (name) {
        return _state.passageNameVisited(name || passage());
    }
    function hasVisited (name) {
        return _state.passageNameVisited(name || passage()) > 0;
    }
    function turns () {
        return _state.pastLength;
    }

    // export API to global "Harlowe" object
    window.Harlowe = Object.assign(window.Harlowe || {}, {
        macro : macro,
        passage : passage,
        goto : goto,
        variable : variable,
        visited : visited,
        hasVisited : hasVisited,
        turns : turns,
        API_ACCESS : {
            // for those who want enough rope to hang...
            MACROS : _macros,
            STATE : _state,
            CHANGER : _changer,
            ENGINE : _engine
        }
    });

}());