/*
    (hotkey: keycode [, once])[ ... ]

    Fires the first link inside the associated hook with a press of the indicated key.

    - keycode ( number ) The keycode of a key. https://keycode.info/ may help
    - once ( boolean ) ( optional ) If true, the keypress will only trigger one time.

    Example:
        {
        (set: $berries to 0)
        (hotkey: 32)[
            (link-repeat: 'Press Space to Collect Berries')[
                (set: $berries to it + 1)
                (replace: ?berrycount)[$berries]
            ]
        ]
        }
        |berrycount>[$berries]

*/

(function () {
    // hotkey macro for Harlowe
    'use strict';

    Harlowe.macro('hotkey', function () {
        // check arguments
        var err = this.typeCheck([
            // keycode value
            'number', 
            // true or false/undefined; true makes the event one time only
            'boolean|undefined'
        ]);
        if (err) throw err;
    }, function (keycode, once) {
        // get method based on once arg
        var method = once ? 'one' : 'on';
        var desc = this.descriptor;

        $(document)[method]('keyup.' + this.name + '-macro.macro' , function (ev) {
            if (ev.which !== keycode) {
                return;
            }
            ev.preventDefault();
            // find the first link in the hook
            var $clickable = desc.target.find('tw-link').first();
            if (!$clickable[0]) {
                // no harlowe links! look for something clickable!
                $clickable = desc.target.find('a, :button, *[role="button"]').first();
            }
            if (!$clickable[0]) {
                return; // give up
            }
            // click the thing
            $clickable.trigger('click');
        });

    });

}());