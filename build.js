// jshint esversion: 9

const jetpack = require('fs-jetpack'),
    uglify = require('uglify-js'),
    postcss = require('postcss'),
    autoprefix = require('autoprefixer'),
    cleancss = require('postcss-clean'),
    zip = require('node-zip')(),
    fs = require('fs'),
    version = require('./package.json').version,
    scriptName = 'Harlowe Macro API',
    file = 'macro.js',
    dist = 'dist/macro.min.js',
    examples = 'examples/',
    binary = 'harlowe-macro-api.zip';

function build (path, output) {
    
    const source = jetpack.read(path);
    let result, ret;
    
    result = uglify.minify(source);
    
    if (result.error) {
        console.warn(scriptName, result.error);
    } else {
        console.log('\x1b[36m', 'All clear: "' + scriptName + '"');
    }
    
    ret = '// ' + scriptName + ', by Chapel; version ' + version + '\n;' + result.code + '\n// end ' + scriptName; 
    
    jetpack.write(output, ret, {atomic : true});

}

function minifyExamples (ex) {
    const jsFiles = jetpack.find(ex, {
        matching : '*.js',
        recursive : false
    });
    
    jsFiles.forEach( function (file) {
        const source = jetpack.read(file);
        let path = file.split(/[\\\/]/g),
            name = path.pop().split('.').join('.min.'),
            result, ret;
        
        result = uglify.minify(source);
        
        if (result.error) {
            console.warn(name, result.error);
        } else {
            console.log('\x1b[36m', 'All clear: "' + name + '"');
        }
        
        path.unshift('.');
        path.push('minified');
        path.push(name);
        path = path.join('/');
        
        ret = '// ' + name + ', for Harlow Macro API, by Chapel\n;' + result.code + '\n// end ' + name; 
        
        jetpack.write(path, ret, {atomic : true});
    });
}

function minifyCSS (ex) {
    const cssFiles = jetpack.find(ex, {
        matching : '*.css',
        recursive : false
    });
    
    cssFiles.forEach( function (file) {
        const source = jetpack.read(file);
        let path = file.split(/[\\\/]/g),
            name = path.pop().split('.').join('.min.');

        path.unshift('.');
        path.push('minified');
        path.push(name);
        path = path.join('/');
        
        postcss([ autoprefix(), cleancss() ]).process(source, { from : undefined }).then(result => {
            result.warnings().forEach(warn => {
                console.warn(name, warn.toString());
            });
            console.log('\x1b[36m', 'All clear: "' + name + '"');
            const ret = '/* ' + name + ', for Harlow Macro API, by Chapel */\n' + result.css + '\n/* end ' + name + '*/';
            jetpack.write(path, ret, {atomic : true});
        });
        
        
    });
}

function zipUp (path, output) {
    const min = jetpack.read(path, 'utf8');
    const license = jetpack.read('LICENSE', 'utf8');

    zip
        .file('macro.js', min)
        .file('LICENSE.txt', license);

    const bin = zip.generate({ base64 : false, compression : 'DEFLATE' });

    fs.writeFileSync(output, bin, 'binary');
}

build(file, dist);
minifyExamples(examples);
minifyCSS(examples);
zipUp(dist, binary);