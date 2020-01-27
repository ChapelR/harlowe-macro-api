// jshint browser: true, esversion: 5

(function () {
    'use strict';

    var _state = Harlowe.API_ACCESS.STATE,
        _engine = Harlowe.API_ACCESS.ENGINE;

    function passage () {
        return _state.passage;
    }
    function tags (name) {
        name = name || passage();
        var tagsString = $('tw-passagedata[name="' + name + '"]').attr('tags');
        if (tagsString) {
            return tagsString.split(' ');
        }
        return [];
    }
    function goto (name) {
        return _engine.goToPassage(name);
    }
    function variable (name, set) {
        if (name[0] !== '$') {
            throw new Error('cannot access variable "' + name + '"');
        }
        name = name.substr(1);
        if (set !== undefined) {
            if (!Harlowe.helpers.isSerialisable(set)) {
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

    window.Harlowe = Object.assign(window.Harlowe || {}, {
        passage : passage,
        tags : tags,
        goto : goto,
        variable : variable,
        visited : visited,
        hasVisited : hasVisited,
        turns : turns,
    });
    
}());