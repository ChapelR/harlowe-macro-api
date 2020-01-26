/*
    
    PORTED FROM CMFSC2 (somewhat)

    (dice: notation)
    (dice: number, sides [, modifier])

    Rolls dice and returns the result.

    - notation ( string ) A string of valid dice notation, e.g. '1d6', '3d8+3', '2d10 - 2', '3dF' (fate/fudge dice)
    - number ( number ) The number of dice to roll.
    - sides ( number | string ) The sides or type of dice to roll ('F' is the only accepted string value).
    - modifier ( number ) ( optional ) The modifier; a flat number to add to the dice roll. May be negative to represent a subtraction.

    Example:
        <!-- all of the following roll 3 six-sided dice and add 10: -->
        (set: _roll to (dice: '3d6+10'))
        (set: _roll to (dice: '3d6 + 10'))
        (set: _roll to (dice: 3, 6, 10))
        (set: _roll to (dice: 3, 6) + 10)

*/

(function () {
    'use strict';

    // dice roller

    var PATTERN = /(\d+)d(\d+|f)(\s*([+-])\s*(\d+))?/i
    var MATCHES = [
        'roll', // 0
        'amount', // 1
        'type', // 2
        'mod_whole', // 3
        'mod_sign', // 4
        'mod_value' // 5
    ];

    function parse (notation) { 
        if (!notation || typeof notation !== 'string') {
            return;
        }
        var notn = notation.trim().toLowerCase();
        if (!notn || !notn.includes('d')) {
            return;
        }
        var m = PATTERN.exec(notn);
        if (!m || !(m instanceof Array) || !m.length) {
            return;
        }
        var ret = {};
        MATCHES.forEach( function (prop, idx) {
            ret[prop] = m[idx] || '';
        });
        return ret;
    }

    function rollDice (num, type, rnd) {
        if (!rnd || typeof rnd !== 'function') {
            rnd = Math.random;
        }
        var add = 1;
        var result = 0;
        var rolls = [];
        num = Number(num);

        if (typeof type === 'string' && type.trim().toUpperCase() === 'F') {
            type = 3; // -1, 0, or 1
            add = -1;
        } else {
            type = Number(type);
        }

        if ([num, type, add].some( function (n) {
            return Number.isNaN(n);
        })) {
            throw new TypeError('could not process arguments in dice roll');
        }

        for (var i = 0; i < num; i++) {
            var die = 0;
            var random = rnd();
            if (typeof random !== 'number' || random > 1 || random < 0) {
                throw new TypeError('invalid random function--should return a value between 0 and 1');
            }
            die = Math.floor(random * type) + add;
            rolls.push(die);
            result += die; // update result
        }

        return {
            rolls : rolls,
            result : result
        };
    }

    function prepNotation (obj) {
        var n = Number(obj.amount);
        var t = Number(obj.type);
        var m = Number(obj.mod_value);
        if (obj.mod_sign.trim() === '-') {
            m = m * -1;
        }
        return {
            number : n,
            type : t,
            modifier : m
        };
    }

    function makeRoll (num, type, mod, rnd) {
        var roll = rollDice(num, type, rnd).result;
        if (mod) {
            roll += mod;
        }
        return roll;
    }

    function roll (a, b, c) {
        var r = {};
        if (typeof a === 'string') {
            r = prepNotation(parse(a));
        } else {
            r.number = a;
            r.type = b;
        }
        if (!r.modifier && c && typeof c === 'number') {
            r.modifier = c || 0;
        } else if (!r.modifier) {
            r.modifier = 0;
        }
        return makeRoll(r.number, r.type, r.modifier, null);
    }

    Harlowe.macro('dice', function (a, b, c) {
        var err = this.typeCheck([
            'string|number',
            'number|undefined',
            'number|undefined'
        ]);
        if (err) throw err;

        return roll(a, b, c);
    });

    window.setup = window.setup || {};

    Object.assign(window.setup, {
        dice :  roll
    });

}());