## Pre-release Versions

### v0.4.0

- **[Update]** Added the storage API for accessing local storage. The framework operates on its own separate section in local storage and won't interfere with Harlowe's saves and such.
  - `Harlowe.storage.save(key, value)` Saves data to local storage.
  - `Harlowe.storage.load(key)` Loads and returns data from local storage.
  - `Harlowe.storage.remove(key)` Deletes the data (if any) at the indicated key.
  - `Harlowe.storage.clear()` Empties the local storage area used by the framework.
- **[Update]** Exposed more internal helpers, specifically:
  - `Harlowe.helpers.isSerialisable(val)` Returns whether passed value can be serialized by Harlowe's engine. The UK English spelling here is in keeping with Harlowe's internal spelling, as this function is just a remade copy of a private internal function of the engine.
  - `Harlowe.helpers.arrayify(arrayLike, sliceIdx)` Returns an array version of an array-like object, optionally slicing the array at the given start index.
- **[Update]** Added version information to the framework so users can check the version in their macro scripts. Note: **these are the framework version numbers, not Harlowe's**.
  - `Harlowe.version.major`, `Harlowe.version.minor`, and `Harlowe.version.patch` are properties that contain numbers referring to each part of the semantic version.
  - `Harlowe.version.semantic()` Returns the string of the semantic version, e.g. `"0.4.0"`.
  - The `Harlowe.version` object refers to the framework version, no the engine version. The object is frozen to protect from accidents like `if (Harlowe.version.major = 1) {`,  so it should be reasonably dependable and impossible for authors and other macro developers to change without meaning to.
- **[Update]** Added story and engine data accessible via framework properties. Note: **these are the Harlowe engine's version numbers, not the macro framework's**.
  - `Harlowe.engine.major`, `Harlowe.engine.minor`, `Harlowe.engine.patch`, and `Harlowe.engine.sematic` are properties that contain numbers referring to the version numbers of the Harlowe engine.
  - `Harlowe.story.name` contains the name of the story.
  - `Harlowe.story.ifid` contains the story's IFID, a unique identifier.
- **[Examples]** Added two more examples:
  - `(dialog:)` A dialog API and macro for Harlowe.
  - `(clamp:)` A macro wrapper for the clamping cookbook example.
- **[Docs]** Documented example macros. Fixed some typos and errors.
- **[Meta]** Code base improvements.
  - Split up the code base into individual "modules." These are just concatenated, not proper modules, as the framework is fairly simple.
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

