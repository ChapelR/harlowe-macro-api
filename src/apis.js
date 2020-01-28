// jshint browser: true, esversion: 5

(function () {
    'use strict';
    var _version = Object.freeze({
        major : 0,
        minor : 4,
        patch : 0,
        semantic : function () {
            return [this.major, this.minor, this.patch].join('.');
        }
    });

    window.Harlowe = window.Harlowe || {};

    window.Harlowe = Object.assign(window.Harlowe, {
        version : _version,
        API_ACCESS : {
            MACROS : require('macros'),
            STATE : require('state'),
            CHANGER : require('datatypes/changercommand'),
            ENGINE : require('engine')
        }
    });
}());