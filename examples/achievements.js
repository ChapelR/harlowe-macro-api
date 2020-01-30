// jshint browser: true, esversion: 3

/*

    (ach-add: achievement)

    Adds an achievement.

    - achievement ( string ) A text string used as an achievement.

    (ach-count:)

    Returns the number of achievements the player currently has.

    (ach-has: achievement)

    Returns true if the player has the indicated achievement

    - achievement ( string ) A text string used as an achievement.

    (ach-print: [separator]) 

    Prints a list of currently acquired achievements.

    - separator ( string ) ( optional ) A text string used to separate the list, e.g. `", "`. 
        Uses a newline (`"\n"`) by default.

    (ach-clear:)

    Clears all achievements permanently.

    (achievements:)

    Returns the current array of achievements.

    Example:
        Controls:
        (link: 'Add the first achievement.')[(ach-add: 'first') Added.]
        (link: 'Add the second achievement.')[(ach-add: 'second') Added.]
        (link: 'Clear achievements.')[(ach-clear:') Cleared.]

        Current achievements:
        Print macro: (ach-print: ', ')
        Base macro: (achievements:)

        Tests:
        Has first: (ach-has: 'first')
        Has second: (ach-has: 'second')
        Number of achievements: (ach-count:)

*/

(function () {
    // code adapted from: 
    // http://twinery.org/questions/22857/making-achievements-in-harlowe?show=22857 by me,
    // https://gist.github.com/greyelf/55a45f461ded3d90a0cc28412187db0a by Greyelf

    'use strict';

    var achievementKey = 'tw-achievements';
    var achievements = Harlowe.storage.load(achievementKey) || [];

    function achievementAdd(name) {
        if (achievements.includes(name)) {
            return; // must be unique
        }
        achievements.push(name);
        Harlowe.storage.save(achievementKey, achievements);
    }

    function loadAchievements() {
        var arr = Harlowe.storage.load(achievementKey) || [];
        achievements = arr;
        return arr;
    }

    function clearAchievements() {
        achievements = [];
        Harlowe.storage.remove(achievementKey);
    }

    function printAchievements(str) {
        return achievements.join(str || '\n');
    }

    function countAchievements() {
        return achievements.length;
    }

    function includesAchievement(key) {
        return achievements.includes(key);
    }

    // (ach-add: achievement)
    Harlowe.macro('achadd', function (ach) {
        var err = this.typeCheck(['string']);
        if (err) throw err;

        achievementAdd(ach);
    });

    // (ach-count:)
    Harlowe.macro('achcount', function () {
        return countAchievements();
    });

    // (ach-has: achievement)
    Harlowe.macro('achhas', function (ach) {
        var err = this.typeCheck(['string']);
        if (err) throw err;

        return includesAchievement(ach);
    });

    // (ach-print: sep)
    Harlowe.macro('achprint', function (sep) {
        var err = this.typeCheck(['string|undefined']);
        if (err) throw err;

        return printAchievements(sep);
    });

    // (achievements:)
    Harlowe.macro('achievements', function () {
        return achievements;
    });

    // (ach-clear:)
    Harlowe.macro('achclear', function () {
        return clearAchievements();
    });

    window.setup = window.setup || {};

    Object.assign(window.setup, {
        achievements : {
            list : achievements,
            add : achievementAdd,
            count : countAchievements,
            has : includesAchievement,
            print : printAchievements,
            clear : clearAchievements,
            load : loadAchievements
        }
    });

}());