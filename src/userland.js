// jshint browser: true, esversion: 5

/*
    Harlowe.passage() -> returns the current passage
    Harlowe.tags([passage]) -> returns the tags, as an array, for the indicated passage; defaults to current passage
    Harlowe.goto(passage) -> forwards to indicated passage, as (goto:)
    Harlowe.variable(varName [, setter]) -> gets, and optionally sets, the indicated story variable (include sigil)
    Harlowe.visited([passage]) -> returns the number of times the indicated passage was visited; 
        defaults to current passage
    Harlowe.hasVisited([passage]) -> returns whether the indicated passage was visited; defaults to current passage
    Harlowe.turns() -> returns the number of turns that have passed (past moments only)
*/

(function () {
    'use strict';

    var _state = Harlowe.API_ACCESS.STATE,
        _engine = Harlowe.API_ACCESS.ENGINE;

    function passage () {
        return _state.passage;
    }
    function tags (name) {
        name = name || passage();
        try {
            var tagsString = Harlowe.helpers.getPassageData(name).attr('tags');
            if (tagsString) {
                return tagsString.split(' ');
            }
            return [];
        } catch (err) {
            console.warn(err.message);
            return [];
        }
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