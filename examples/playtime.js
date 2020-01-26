/*

    Ported from CMFSC2

    (playtime: [what])

    Returns the in-game playtime; works across saved games.

    - what ( string ) ( optional ) You can return a specific number, or a string, formatted or not. Valid values are:
        - "hours" -> returns the hours
        - "minutes" -> returns the minutes
        - "seconds" -> returns the seconds
        - "milliseconds" -> returns the milliseconds elapsed
        - "format" -> returns a formated time string--the hours and minutes are bolded
        - omitting this argument results in a non-bolded string

    Example:
        Playtime: (playtime: 'format')
        Hours: (playtime: 'hours')
        Seconds: (playtime: 'seconds')

        Self-updating playtime: (live: 1s)[(playtime:)]

*/

(function () {
    'use strict';

    var time = Harlowe.variable('$%%playtime') || null;

    if (!time) {
        Harlowe.variable('$%%playtime', Date.now());
    }

    function _current () {
        return Date.now() - Harlowe.variable('$%%playtime');
    }

    function _getTimeObj (ms) {
        if (!ms || ms < 0 || typeof ms !== 'number') {
            return;
        }
        
        var time = {};
        
        time.seconds = Math.floor(ms / 1000) % 60; // second [0]
        time.minutes = Math.floor(ms / 60000) % 60; // minutes [1]
        time.hours = Math.floor(ms / 3600000); // hours [2]
        
        return time;
    }

    function _formatTime (obj, fmt) {
        if (!obj) {
            return;
        }
        
        var hr  = (obj.hours < 10) ? '0' + obj.hours : '' + obj.hours,
            min = (obj.minutes < 10) ? '0' + obj.minutes : '' + obj.minutes,
            sec = (obj.seconds < 10) ? '0' + obj.seconds : '' + obj.seconds;
            
        if (fmt) {
            return '<b>' + hr + ':' + min + '</b>' + ':' + sec;
        }
        return hr + ':' + min + ':' + sec;
    }

    var _validWhat = ['seconds', 'minutes', 'hours'];

    function playtime (what) {
        var ms = _current();
        var time = _getTimeObj(ms);
        if (what && typeof what === 'string') {
            what = what.trim().toLowerCase();
        }
        if (_validWhat.includes(what)) {
            return time[what];
        }
        if (what === 'milliseconds') {
            return ms;
        }
        if (what === 'format') {
            return _formatTime(time, true);
        }
        return _formatTime(time);
    }

    Harlowe.macro('playtime', function (what) {
        var err = this.typeCheck(['string|undefined']);
        if (err) throw err;

        return playtime(what);
    });

}());