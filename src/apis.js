// jshint browser: true, esversion: 5

(function () {
    'use strict';
    
    // get the APIs: we have to do this in a blocking manner--failure to do so will cause order of operations problems later
    var _macros = require('macros');
    var _state = require('state');
    var _engine = require('engine');
    var _changer = require('datatypes/changercommand');

    window.Harlowe = window.Harlowe || {};

    window.Harlowe = Object.assign(window.Harlowe, {
        API_ACCESS : {
            MACROS : _macros,
            STATE : _state,
            CHANGER : _changer,
            ENGINE : _engine
        }
    });
}());