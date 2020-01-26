/*
    
    (say: name [, imgSrc])[ ... ]

    Creates a speech box with the indicated character name and image.

    - name ( string ) The name of the character to be displayed in the name portion of the speech box. If there is a 
        character definition set up via the `(character:)` macro, the image from that definition will be supplied.
    - imgSrc ( string ) ( optional ) The image source URL, which, if provided, overrides the name definition one. If omitted
        and there is no definition, no image will be rendered.

    Example:
        (say: 'Lisa')[Hey there!]
        (say: 'Bob', 'assets/bob.jpg')[I'm *sick* of being a **meme**!]

    (character: name, imgSrc)

    Creates a character definition to be used in a `(say:)` macro speech box.

    - name ( string ) The name of the character to be associated with the image source.
    - imgSrc ( string ) The image source URL to associate with the name.

    Example:
        (character: 'Lisa', 'assets/lisa.jpg')

*/

(function () {
    // requires speechbox.css
    'use strict';

    var _characters = new Map();

    function addCharacter (name, imgSrc) {
        if (!name || typeof name !== 'string' || !name.trim()) {
            throw new Error('invalid character name');
        }
        if (!imgSrc || typeof imgSrc !== 'string' || !imgSrc.trim()) {
            throw new Error('invalid image source');
        }
        _characters.set(name, imgSrc);
    }

    function speechBox (source, name, imgSrc) {
        var imgEl = '';
        if (!name || typeof name !== 'string' || !name.trim()) {
            throw new Error('invalid character name');
        }
        if (!imgSrc) {
            imgSrc = _characters.get(name);
        }
        if (imgSrc) {
            imgEl = '<img src="' + imgSrc + '">';
        }
        return '<div class="say" data-character="' + name + '">' + imgEl+ '<p>' + name + '</p><p>' + source + '</p></div>';
    }

    Harlowe.macro('character', function (name, imgSrc) {
        var err = this.typeCheck([
            'string',
            'string'
        ]);
        if (err) throw err;

        addCharacter(name, imgSrc);
    });

    Harlowe.macro('say', function () {
        var err = this.typeCheck([
            'string',
            'string|undefined'
        ]);
        if (err) throw err;
    }, function (name, imgSrc) {
        this.descriptor.source = speechBox(this.descriptor.source, name, imgSrc);
    });

}());