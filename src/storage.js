// jshint browser: true, esversion: 5

/*
    Harlowe.storage.save(key, value) -> save data to local storage

    Harlowe.storage.load(key) -> retrieves data from local storage

    Harlowe.storage.remove(key) -> deletes a storage key, making it undefined

    Harlowe.storage.clear() -> clears local storage (framework section only)
*/

(function () {
    'use strict';

    var storage = window.localStorage || false;
    var _key = Harlowe.story.ifid + '-tw-storage';

    function init () {
        try {
            if (storage) {
                storage.setItem(_key, JSON.stringify({ ifid : Harlowe.story.ifid }));
            } else {
                throw new Error('storage is inaccessible');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    function load (name) {
        try {
            var store;
            if (storage) {
                store = JSON.parse(storage.getItem(_key));
                return name && typeof name === 'string' ? store[name] : store;
            } else {
                throw new Error('storage is inaccessible');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    function save (name, value) {
        try {
            if (!name || typeof name !== 'string') {
                throw new TypeError('cannot store values without a valid storage key');
            }
            if (value === undefined) {
                throw new TypeError('cannot store undefined values');
            }
            var setter = {};
            setter[name] = value;
            if (storage) {
                var store = load();
                Object.assign(store, setter);
                storage.setItem(_key, JSON.stringify(store));
            } else {
                throw new Error('storage is inaccessible');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    function del (name) {
        try {
            if (!name || typeof name !== 'string') {
                throw new TypeError('cannot store values without a valid storage key');
            }
            if (storage) {
                var store = load();

                if (store.hasOwnProperty(name)) {
                    delete store[name];
                    storage.setItem(_key, JSON.stringify(store));
                }
            } else {
                throw new Error('storage is inaccessible');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    function hasStorage () {
        return load() !== undefined;
    }

    if (!hasStorage()) {
        init();
    }

    Harlowe.storage = {
        clear : init,
        save : save,
        load : load,
        remove : del
    };

}());