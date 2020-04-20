(function () {
    // version 1.1.1

    var DEFAULT_TIME = 2000; // default notification time (in MS)

    var isCssTime = /^([+-]?(?:\d*\.)?\d+)([Mm]?[Ss])$/;

    var $notify = $(document.createElement('div'))
        .attr('id', 'notify')
        .appendTo(document.body);

    $(document).on(':notify', function (ev) {
        // classes
        if (ev.class) {
            if (typeof ev.class === 'string') {
                ev.class = 'open macro-notify ' + ev.class;
            } else if (Array.isArray(ev.class)) {
                ev.class = 'open macro-notify ' + ev.class.join(' ');
            } else {
                ev.class = 'open macro-notify';
            }
        } else {
            ev.class = 'open macro-notify';
        }
        
        // delay
        if (ev.delay) {
            if (typeof ev.delay !== 'number') {
                ev.delay = Number(ev.delay);
            }
            if (Number.isNaN(ev.delay)) {
                ev.delay = DEFAULT_TIME;
            }
        } else {
            ev.delay = DEFAULT_TIME;
        }
            
        $notify
            .empty()
            .append(ev.message)
            .addClass(ev.class);
                
        setTimeout(function () {
            $notify.removeClass();
        }, ev.delay);
    });

    function convertCssTime (cssTime) {
        // taken from SugarCube: https://github.com/tmedwards/sugarcube-2/blob/master/src/lib/util.js#L339
        var match = isCssTime.exec(String(cssTime));

        if (match === null) {
            throw new SyntaxError("invalid time value syntax: " + cssTime);
        }

        var msec = Number(match[1]);

        if (match[2].length === 1) {
            msec *= 1000;
        }

        if (Number.isNaN(msec) || !Number.isFinite(msec)) {
            throw new RangeError("invalid time value: " + cssTime);
        }

        return msec;
    }

    function notify (time, classes, contentEl) {

        if (typeof time === 'string') {
            time = convertCssTime(time);
        } else if (typeof time !== 'number') {
            time = false;
        }

        $(document).trigger({
            type    : ':notify',
            message : contentEl,
            delay   : time,
            class   : classes || ''
        });

        return $notify;
    }

    // (notify:) macro def
    Harlowe.macro('notify', function () {

        var err = this.typeCheck([
            'string|number|undefined',
            'string|undefined',
            'string|undefined'
        ]);
        if (err) throw err;

    }, function (time, classes, test) {
        // `tw-hook.in-notification` -> styles for dialog content
        this.descriptor.target.addClass('in-notification');

        if (classes && test) {
            classes = Harlowe.helpers.arrayify(arguments, 1).join(' ');
        }

        notify(time, classes, this.descriptor.target);

    });

    setup.notify = notify;

}());