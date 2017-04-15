const Storage = window.localStorage;
const sessionStorage = window.sessionStorage;
const keyPrefix = 'user-id-'; // 存储前缀，用来区分不同用户数据，否则同一台电脑，不同人存储数据会互相干扰。

export function setItem(key, value) {
    key = keyPrefix + key;
    value = JSON.stringify(value);
    Storage.setItem(key, value);
}

export function getItem(key) {
    key = keyPrefix + key;
    let value = Storage.getItem(key);
    return JSON.parse(value);
}

export const clear = Storage.clear;

export function removeItem(key) {
    key = keyPrefix + key;
    Storage.removeItem(key);
}

export function multiGet(keys) {
    let values = {};
    keys.forEach(key => values[key] = getItem(key));
    return values;
}

export function multiRemove(keys) {
    keys.forEach(key => removeItem(keyPrefix + key));
}

export const session = {
    setItem(key, value) {
        key = keyPrefix + key;
        value = JSON.stringify(value);
        sessionStorage.setItem(key, value);
    },
    getItem(key) {
        key = keyPrefix + key;
        let value = sessionStorage.getItem(key);
        return JSON.parse(value);
    },
    clear: sessionStorage.clear,
    removeItem(key) {
        key = keyPrefix + key;
        sessionStorage.removeItem(key);
    },
    multiGet(keys) {
        let values = {};
        keys.forEach(key => values[key] = this.getItem(key));
        return values;
    },
    multiRemove(keys) {
        keys.forEach(key => this.removeItem(keyPrefix + key));
    },
};
