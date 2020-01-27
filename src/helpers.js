// jshint browser: true, esversion: 5

(function () {
    'use strict';
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

    function arrayify (arraylike, splitOff) {
        if (!arraylike) {
            return;
        }
        var ret = [].slice.call(arraylike);
        if (splitOff !== undefined) {
            ret = ret.slice(splitOff);
        }
        return ret;
    }

    window.Harlowe = Object.assign(window.Harlowe, {
        helpers : {
            isSerialisable : isSerialisable,
            arrayify : arrayify
        }
    });
}());