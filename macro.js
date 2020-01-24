(function () {
    'use strict';

    // get the APIs: we have to do this in a blocking manner--failure to do so will cause order of operations problems later
    var _macros = require('macros');
    var _state = require('state');
    var _changer = require('datatypes/changercommand');

    function simpleCommandMacro (name, cb) {
        // a command macro can not have a hook
        _macros.add(name, function () {
            var arr = [].slice.call(arguments).slice(1);
            var result = cb.apply({
                name : name,
                args : arr
            }, arr);
            return (result == undefined) ? '' : result;
        }, _macros.TypeSignature.zeroOrMore(_macros.TypeSignature.Any));

    }

    function simpleChangerMacro (name, cb, changer) {
        // a simplified changer macro
        _macros.addChanger(name, function () {
            var arr = [].slice.call(arguments).slice(1);
            var changer = _changer.create(name, arr);
            cb.apply({
                name : name,
                args : arr,
                instance : changer
            }, arr);
            return changer;
        }, function () {
            var arr = [].slice.call(arguments);
            var d = arr.shift();
            changer.apply({
                name : name,
                args : arr,
                descriptor : d
            }, arr);
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

    // functions
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
        if (set) {
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