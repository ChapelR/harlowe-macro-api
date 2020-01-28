// jshint browser: true, esversion: 5

/*
    Harlowe.version -> version data object
        { // all are replaced by package.json values during build
            major,
            minor,
            patch
        }

    Harlowe.version.semantic() -> returns the semantic version as a string, e.g. "1.0.0"

    Harlowe.API_ACCESS -> access to internal engined APIs
        {
            MACROS
            STATE
            ENGINE
            CHANGER
        }
*/

(function () {
    'use strict';
    var _version = Object.freeze({
        major : /{{major}}/,
        minor : /{{minor}}/,
        patch : /{{patch}}/,
        semantic : function () {
            return [ this.major, this.minor, this.patch ].join('.');
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