# Contributing

This document provides information about the project structure and build process of this framework so developers may make source code edits and contribute to or fork this project.

To get started, clone or download the repository and run `npm install` in the project directory. If you want to work on documentation you may want to globally install Docsify: `npm i -g docsify`.

## Code of Conduct

See the [Contributor Covenant 2.0](https://www.contributor-covenant.org/version/2/0/code_of_conduct/).

## Project Structure

The `src` folder contains the source code for the framework. The `examples` folder contains macro examples. When built, everything in the example folder will be minified, CSS code will additionally be auto-prefixed. These processed files are output to `examples/minified`. Everything in the `src` folder is concatenated and minified and output to the `dist` folder. A new `harlowe-macro-api.zip` file is also generated with the compiled framework JavaScript.

To add new source code files, you'll need to add them to the build process (see below).

## Coding Standards

Everything here is written in ES5. I may set up Babel on the build process at a later date and move the code to ES6+, but for now contributions should be in ES5. Please lint your code with [JSHint](https://jshint.com/). I use four space indents and prefer the use of single quotes.

## Build Process

You can review or edit the build process by taking a look at the `build.js` file. No task additional runners are used. You can run the build script with `node build.js` or `npm run build`.

I don't think the overhead of a module bundler like webpack is worth it for this project, but the build process is not as robust as it could be, so I will be working on it a bit over the coming weeks.

For the foreseeable future, you will be able to add new files by adding them to the `files` array on line 18 of the `build.js` files. You will want to place your files after the files that contain any code your new scripting will rely on; for example, if you need the `Harlowe.helpers` methods, your new file should be added below `helpers.js` in the array.

## Testing

I use Tweego to test the project. I use a `test` folder with a `tw` folder containing all the `.twee` files, and the following command to compile it: `tweego -f harlowe-3 -o index.html ../dist/macro.min.js ../examples/minified tw`. There is no easy way to automate testing that I am aware of, so you'll need to thoroughly manually test your changes.

## Documentation

Documentation is compiled for the web with [Docsify](https://docsify.js.org/#/), but you don't strictly need Docsify to make edits to the documentation files, as you can simply edit the markdown files. Please attempt to match the style and format present in the files&mdash;for example, if you are documenting a new function, use one of the existing function entries as a guide. I would go as far as recommending you copy/paste an existing macro or function entry and replace it's content with your own.

If you add new APIs, methods, functions, etc, you do not *have* to provide and documentation, though I appreciate doing so. You can instead explain the changes to me and I'll document it.

## Contributing Macros

You may contribute macros to this repo directly via a PR or by providing a link to the documentation and script hosted elsewhere and adding said link to the documentation. You may also open an issue with the relevant code or links if you prefer. I will only accept scripts or links that point to scripts that are free and open source, released under a permissive license, and that are reasonably complete and functional. I'm willing to help with tweaking, testing, documentation, and other such work to whatever extent I am able.