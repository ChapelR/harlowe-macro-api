// jshint browser: true, esversion: 3

/*

    (clamp: value, min, max)

    Clamps a value to the specified bounds.

    - value ( number ) A number that needs clamped.
    - min ( number ) The lower bound.
    - max ( number ) The upper bound.

    Examples:
        (set: _clamp to (clamp: 100 + 100, 0, 167))   <!-- 167 -->
        (set: _clamp to (clamp: 100 - 1000, 0, 1000)) <!-- 0 -->
        (set: _clamp to (clamp: _clamp + 10, 11, 15)) <!-- 11 -->

*/

(function () {
    // from: https://twinery.org/cookbook/clamping_numbers/harlowe/harlowe_clamping_numbers.html

    /*
        Returns the number clamped to the specified bounds.

        WARNING:
            Due to how Harlowe implements variables you can NOT call this function directly,
            you must use the Math.clamp() function instead.
    */
    Object.defineProperty(Number.prototype, 'clamp', {
        configurable : true,
        writable     : true,

        value : function (/* min, max */) {
            if (this == null) { // lazy equality for null
                throw new TypeError('Number.prototype.clamp called on null or undefined');
            }

            if (arguments.length !== 2) {
                throw new Error('Number.prototype.clamp called with an incorrect number of parameters');
            }

            var min = Number(arguments[0]);
            var max = Number(arguments[1]);

            if (min > max) {
                var tmp = min;
                min = max;
                max = tmp;
            }

            return Math.min(Math.max(this, min), max);
        }
    });


    /*
        Returns the given numerical clamped to the specified bounds.

        Usage:
            → Limit numeric variable to a value between 1 and 10 inclusive.
            (set: $variable to Math.clamp($variable, 1, 10))

            → Limit result of mathematical operation to a value between 1 and 10 inclusive.
            (set: $variable to Math.clamp($variable + 5, 1, 10)_
    */
    Object.defineProperty(Math, 'clamp', {
        configurable : true,
        writable     : true,

        value : function (num, min, max) {
            var value = Number(num);
            return Number.isNaN(value) ? NaN : value.clamp(min, max);
        }
    });

    // ADDED:

    Harlowe.macro('clamp', function (v, mn, mx) {
        var err = this.typeCheck([
            'number',
            'number',
            'number'
        ]);
        if (err) throw err;

        return Math.clamp(v, mn, mx);
    });

})();