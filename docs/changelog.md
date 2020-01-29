## Pre-release Versions

### v0.4.0

- **[Update]** Exposed more internal helpers, specifically:
  - `Harlowe.helpers.isSerialisable(val)` Returns whether passed value can be serialized by Harlowe's engine. The UK English spelling here is in keeping with Harlowe's internal spelling, as this function is just a remade copy of a private internal function of the engine.
  - `Harlowe.helpers.arrayify(arrayLike, sliceIdx)` Returns an array version of an array-like object, optionally slicing the array at the given start index.
- **[Update]** Added version information to the framework so users can check the version in their macro scripts.
  - `Harlowe.version.major`, `Harlowe.version.minor`, and `Harlowe.version.patch` are properties that contain numbers referring to each part of the semantic version.
  - `Harlowe.version.semantic()` Returns the string of the semantic version, e.g. `"0.4.0"`.
  - The `Harlowe.version` object refers to the framework version, no the engine version. The object is frozen to protect from accidents like `if (Harlowe.version.major = 1) {`,  so it should be reasonaby dependable and impossible for authors and other macro developers to change without meaning to.
- **[Examples]** Added two more examples:
  - `(dialog:)` A dialog API and macro for Harlowe.
  - `(clamp:)` A macro wrapper for the clamping cookbook example.
- **[Docs]** Documented example macros. Fixed some typos and errors.
- **[Meta]** Code base improvements.
  - Slpit up the code base into individual "modules." These are just concatenated, not proper modules, as the framework is fairly simple.
  - Build script now adds version info (as pulled from `package.json`) to the scripts.

### v0.3.0

- **[Update]** Internal improvements.
- **[Update]** Added the `Harlowe.tags()` method.
- **[Examples]** Added two more examples:
  - `(say:)`/`(character:)` A port of the CMFSC2 speech box system.
  - `(playtime:)` A simplified port of the CMFSC2 playtime system.
- **[Docs]** Documented example macros.
- **[Meta]** Added minified versions of example macros.

### v0.2.2

- **[Update]** Internal improvements and bug fixes.
- **[Examples]** Added two more examples:
  - `(dice:)` A port of the CMFSC2 macro.
  - `(article:)`/`(set-article:)` A port of the CMFSC2 macro.
- **[Meta]** Demo and docs website.

### v0.2.1

- **[Update]** Fixed bug in `Harlowe.variable()`.
- **[Examples]** Added two examples:
  - `(textbox:)` A basic text input implementation.
  - `(hotkey:)` A basic hotkey / click link with keypress implementation.
- **[Docs]** Docs typos.

### v0.2.0 

- **[Update]** Initial release.

