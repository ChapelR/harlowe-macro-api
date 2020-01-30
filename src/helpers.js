// jshint browser: true, esversion: 5

/*
    Harlowe.helpers.isSerialisable(data) -> returns wehther the indicated data can be serialized by Harlowe

    Harlowe.helpers.arrayify(arraylike [, slice]) -> turns an array-like object (like function arguments) into
        an array and returns it. optionally slices the array starting at the passed index.

    Harlowe.helpers.getPassageData(name) -> returns the indicated passage's data chunk, as a jQuery instance
*/

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

    function getPassageData (name) {
        var $psg = $('tw-passagedata[name="' + name + '"]');
        if ($psg[0]) {
            return $psg;
        }
    }

    window.Harlowe = Object.assign(window.Harlowe, {
        helpers : {
            isSerialisable : isSerialisable,
            arrayify : arrayify,
            getPassageData : getPassageData
        }
    });
}());