// jshint browser: true, esversion: 3

/*

    (dialog: [title] [, classList])[ ... ]

    Creates a dialog (modal) box with the given title and classes for styling, then renders the hook content into it.

    - title ( string ) ( optional ) A title for the dialog box. if omitted the title area will simple remain blank.
    - classList ( string | string array ) ( optional ) A string, list of string arguments, or array of strings.
        Added to the dialog box frame as classes for styling.
    
    Example:
        (set: $openedDialog to 0)\
        (link-repeat: 'Open Dialog')[\
            (dialog: 'Title')[\
                (set: $openedDialog to it + 1) Hey there!

                You opened this dialog $openedDialog times so far!

                Yay!\
            ]\
        ]

*/

(function () {

    // structure
    var $title = $(document.createElement('span'))
        .attr('id', 'dialog-title');
    var $body = $(document.createElement('p'))
        .attr('id', 'dialog-body');
    var $frame = $(document.createElement('div'))
        .attr('id', 'dialog-frame');

    var $overlay = $(document.createElement('div'))
        .attr('id', 'dialog-overlay')
        .addClass('overlay hidden')
        .append($frame
            .append($(document.createElement('div'))
                .attr('id', 'dialog-header')
                .append($title)
                .append($(document.createElement('a'))
                    .attr('id', 'dialog-close')
                    .append('&#10060;')
                    .addClass('dialog-close')))
            .append($body)
        );

    // add structure
    $(document.body).append($overlay);
    // patch user font style in
    $frame.css('font-family', $('#tw-story').css('font-family') || 'Georgia, serif');

    // APIs
    function clearFrame() {
        $frame.removeClass();
        $body.empty();
        $title.empty();
    }

    function setupFrameClasses (classes) {
        if (classes) {
            $frame.addClass(classes);
        }
    }

    function setupTitle (title) {
        $title.empty();
        $title.append(title);
    }

    function setupBody (content) {
        $body.empty();
        $body.append(content);
    }

    function showDialog () {
        $overlay.removeClass('hidden');
    }

    function hideDialog () {
        $overlay.addClass('hidden');
    }

    // close via overlay/close link
    $(document).on('click', '.dialog-close', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        hideDialog();
    });

    // (dialog:) macro def
    Harlowe.macro('dialog', function (_, classes, test) {

        var err = this.typeCheck([
            'string|undefined',
            'string|undefined',
            'string|undefined'
        ]);
        if (err) throw err;

        $frame.removeClass();
        $body.empty();
        $title.empty();

        if (classes && test) {
            classes = Harlowe.helpers.arrayify(arguments, 1).join(' ');
        }
        setupFrameClasses(classes);

    }, function (title) {
        this.descriptor.target.addClass('in-dialog'); // hide when not in dialog element via CSS

        setupTitle(title);
        setupBody(this.descriptor.target);

        showDialog();
    });

    // export JS-facing API
    window.setup = window.setup || {};

    Object.assign(window.setup, {
        dialog : {
            setup : function (title, classes, test) {
                clearFrame();
                if (classes && test) {
                    classes = Harlowe.helpers.arrayify(arguments, 1).join(' ');
                }
                setupFrameClasses(classes);
                setupTitle(title);
            },
            content : function (cont) {
                setupBody(cont);
            },
            open : showDialog,
            close : hideDialog
        }
    });

}());