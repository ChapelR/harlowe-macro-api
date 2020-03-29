( function () {
    'use strict';

    var mainFile = 'https://cdn.jsdelivr.net/gh/chapelr/harlowe-macro-api@latest/dist/macro.min.js';

    var baseURL = 'https://cdn.jsdelivr.net/gh/chapelr/harlowe-macro-api@latest/examples/minified/';
    var tpURL = 'https://cdn.jsdelivr.net/gh/chapelr/harlowe-macro-api@latest/examples/third-party/minified/';
    var extension = '.min.js';
    var extensionCSS = '.min.css';

    var fileNameMap = {
        'Achievements' : 'achievements',
        'Articles' : 'articles',
        'Clamp': 'clamp',
        'Dialog' : 'dialog+css',
        'Dice': 'dice',
        'Hotkeys': 'hotkeys',
        'Playtime': 'playtime',
        'Speech Box': 'speechbox+css',
        'Textbox': 'textbox',
        'Macro Passages (by rachek64)': '~macro-passages'
    };

    var macros = Object.keys(fileNameMap);

    function fetchFiles (arr) {
        var files = [];
        arr.forEach( function (macro) {
            if (!macro || typeof macro !== 'string' || !macro.trim()) {
                return;
            }
            var fn = fileNameMap[macro];
            if (!fn || !fn.trim()) {
                return;
            }
            if (fn.includes('+css')) {
                fn = fn.split('+')[0];
                files.push(baseURL + fn + extensionCSS);
            }
            if (fn[0] === '~') {
                files.push(tpURL + fn.substr(1) + extension);
            } else {
                files.push(baseURL + fn + extension); 
            }
        });
        return [ mainFile ].concat(files);
    }

    function loadFiles (files) {
        var code = {
            js : [],
            css : [],
            noLoad : 0
        };
        var isCSS = false;
        files.forEach( function (file, idx, arr) {
            $.ajax({
                url : file,
                beforeSend : function (xhr) {
                    xhr.overrideMimeType('text/plain; charset=utf8');
                }
            })
                .done( function (data) {
                    isCSS = this.url.includes('.css');
                    code[isCSS ? 'css' : 'js'].push(data);
                    var progress = (code.js.length + code.css.length + code.noLoad) / arr.length;
                    $(document).trigger({
                        type : ':progress',
                        progress : progress
                    });
                    if (progress === 1) {
                        $(document).trigger({ 
                            type : ':load-end', 
                            code : code
                        });
                    }
                })
                .fail( function () {
                    code.noLoad++;
                    var progress = (code.js.length + code.css.length + code.noLoad) / arr.length;
                    alert('Something went wrong when generating the download.');
                    $(document).trigger({
                        type : ':progress',
                        progress : progress
                    });
                });
        });
    }

    window.macroList = macros;
    window.loadFiles = function (macroNames) {
        if (!(macroNames instanceof Array)) {
            return;
        }
        $(document).trigger(':load-start');
        var data = loadFiles(fetchFiles(macroNames));
        return data;
    };
}());