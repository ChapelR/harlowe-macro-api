(function () {
    // call and reply macro set, v1.0.0
    'use strict';

    var eventNameSpace = '.userland';
    var eventPrefix = ':tw-call-macro-';

    function isDef (is) {
        return is != undefined;
    }

    function evType (type) {
        return eventPrefix + String(type) + eventNameSpace;
    }

    function setCall (type, args, test) {
        if (isDef(args) && isDef(test)) {
            args = Harlowe.helpers.arrayify(arguments, 2);
        } else if (isDef(args) && !(args instanceof Array)) {
            args = [args];
        }

        $(document).trigger({
            type : evType(type),
            args : isDef(args) ? args : undefined
        });
    }

    function removeCall (type) {
        $(document).off(evType(type));
    }

    function reply (type, cb, once, context) {
        $(document)[ once ? 'one' : 'on' ](evType(type), function (ev) {
            var shallow = Harlowe.variable('args'), deep;
            if (shallow instanceof Map) {
                deep = new Map(shallow.entries());
            } else if (shallow instanceof Set) {
                deep = new Set(shallow.entries());
            } else if (typeof shallow === 'object') {
                deep = JSON.parse(JSON.stringify(shallow));
            } else {
                deep = shallow;
            }

            Harlowe.variable('args', ev.args);
            // callback
            cb.call(context);
            Harlowe.variable('args', deep);
        });
    }

    Harlowe.macro('call', function (type, args) {
        var err = this.typeCheck([ 'string' ]);
        if (err) throw err;

        setCall.apply(null, arguments);
    });

    Harlowe.macro('reply', function (type, once) {

        var err = this.typeCheck([ 'string', 'boolean|undefined' ]);
        if (err) throw err;

    }, function (type, once) {

        this.descriptor.enabled = false;

        reply(type, function () {
            this.enabled = true;
        }, !!once, this.descriptor);

    });

    Harlowe.macro('silence', function (type) {
        var err = this.typeCheck([ 'string' ]);
        if (err) throw err;

        removeCall(type);
    });

}());