// jshint esversion: 9

const jetpack = require('fs-jetpack'),
    uglify = require('uglify-js'),
    zip = require('node-zip')(),
    fs = require('fs'),
    scriptName = 'Harlowe Macro API',
    file = 'macro.js',
    dist = 'dist/macro.min.js',
    binary = 'harlowe-macro-api.zip';

function build (path, output) {
    
    const source = jetpack.read(path),
        name = path.split('.').join('.min.');
    let result, ret;
    
    result = uglify.minify(source);
    
    console.log(result.error);
    
    ret = '// ' + scriptName + ', for Harlowe, by Chapel\n;' + result.code + '\n// end ' + scriptName; 
    
    jetpack.write(output, ret, {atomic : true});

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
zipUp(dist, binary);