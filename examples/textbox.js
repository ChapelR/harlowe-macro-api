/*
    (textbox: receiverVariable [, placeholder])

    Enter text in the input. Updates indicated variable with the value of the textbox in real time.

    - receiverVariable ( string ) A string variable name, e.g. "$name". The value will be stored in the indicated variable.
    - placeholder ( string ) ( optional ) A string of text that should be in the textbox when empty and not focused, usually a label of some kind.
    
    Example: 
        (textbox: "$name", "Please enter your name...")
*/

(function () {
    // textbox input macro for Harlowe
    'use strict';

    // set up change event handler
    $(document).on('change.textbox-macro.macro', 'input[data-var]', function () {
        Harlowe.variable($(this).attr('data-var').trim(), $(this).val() || '');
    });

    Harlowe.macro('textbox', function (varName, placeholder) {
        // handle errors
        var err = this.typeCheck([
            // the variable name parameter must be a string.
            'string',
            // the placeholder parameter may be omitted, but must otherwise be a string
            'string|undefined'
        ]);
        // throw
        if (err) throw err;

        // return html structure
        return '<input placeholder="' + (placeholder || '') + '" type="text" data-var="' + varName + '">';
    });

}());