// jshint environment: node, esversion: 9

const jetpack = require('fs-jetpack'),
    uglify = require('uglify-js'),
    zip = require('node-zip')(),
    fs = require('fs'),
    version = require('./package.json').version,
    scriptName = 'Harlowe Macro API',
    file = 'macro.js',
    dist = 'dist/macro.min.js',
    examples = 'examples/',
    binary = 'harlowe-macro-api.zip';

function build (path, output) {
    
    const source = jetpack.read(path),
        name = path.split('.').join('.min.');
    let result, ret;
    
    result = uglify.minify(source);
    
    console.log(result.error);
    
    ret = '// ' + scriptName + ', by Chapel; version ' + version + '\n;' + result.code + '\n// end ' + scriptName; 
    
    jetpack.write(output, ret, {atomic : true});

}

function minifyExamples (ex) {
    const jsFiles = jetpack.find(ex, {
        matching : '*.js',
        recursive : false
    });
    
    jsFiles.forEach( function (file) {
        const source = jetpack.read(file),
            path = file.split(/[\\\/]/g),
            name = path.pop().split('.').join('.min.');
        let result, ret;
        
        result = uglify.minify(source);
        
        console.log(result.error);
        
        path.unshift('.');
        path.push('minified');
        path.push(name);
        path = path.join('/');
        
        ret = '// ' + name + ', for Harlow Macro API, by Chapel\n;' + result.code + '\n// end ' + name; 
        
        jetpack.write(path, ret, {atomic : true});
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
zipUp(dist, binary);