/** @module */

/**
 * 获取cookie
 * @param objName
 * @returns {string}
 */
export function getCookie(objName) {
    let arrStr = document.cookie.split('; ');
    for (let i = 0; i < arrStr.length; i++) {
        let temp = arrStr[i].split('=');
        if (temp[0] === objName) return unescape(temp[1]);
    }
    return '';
}

/**
 * 获取滚动条宽度
 * @returns {number}
 */
export function getScrollBarWidth() {
    let scrollDiv = document.createElement('div');
    scrollDiv.style.position = 'absolute';
    scrollDiv.style.top = '-9999px';
    scrollDiv.style.width = '50px';
    scrollDiv.style.height = '50px';
    scrollDiv.style.overflow = 'scroll';
    document.body.appendChild(scrollDiv);
    let scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    window.document.body.removeChild(scrollDiv);
    return scrollBarWidth;
}

/**
 * 获得一个指定范围内的随机数
 * @param min
 * @param max
 * @returns {*}
 */
export function getRandomNum(min, max) {
    const range = max - min;
    const rand = Math.random();
    return (min + Math.round(rand * range));
}

/**
 * 为一个dom元素移除class
 * @param selector
 * @param className
 */
export function removeClass(selector, className) {
    let dom = selector;
    if (typeof selector === 'string') {
        dom = document.querySelector(selector);
    }
    if (!dom) return;
    let domClass = dom.className;
    if (domClass) {
        domClass = domClass.split(' ');
        if (!domClass || !domClass.length) return;
        dom.className = domClass.filter(c => c !== className).join(' ');
    }
}

/**
 * 为一个dom元素添加class
 * @param selector
 * @param className
 */
export function addClass(selector, className) {
    let dom = selector;
    if (typeof selector === 'string') {
        dom = document.querySelector(selector);
    }
    if (!dom) return;
    let domClass = dom.className;
    if (domClass) {
        domClass = domClass.split(' ');
        if (!domClass || !domClass.length || domClass.indexOf(className) > -1) return;
        domClass.push(className);
        dom.className = domClass.join(' ');
    } else {
        dom.className = className;
    }
}

/**
 * 拼接get请求所需url
 * @param url
 * @param params
 * @returns {*}
 */
export function mosaicUrl(url, params) {
    if (!params) return url;
    const queryString = [];
    Object.keys(params).forEach(key => {
        let value = params[key];
        if (value !== undefined && value !== null) {
            queryString.push(`${key}=${value}`);
        }
    });
    const qStr = queryString.join('&');
    if (url.indexOf('?') < 0) {
        url += `?${qStr}`;
    } else if (url.endsWith('&')) {
        url += qStr;
    } else if (url.endsWith('?')) {
        url += `${qStr}`;
    } else {
        url += `&${qStr}`;
    }
    return url;
}


function findObjByKeyPath(obj, keyPath) {
    const keys = keyPath.split('.');
    let targetObj = obj;
    keys.forEach(k => {
        targetObj = targetObj[k];
    });
    return targetObj;
}

function arrayRemove(arr, item) {
    let itemIndex = -1;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === item) {
            itemIndex = i;
            break;
        }
    }
    if (itemIndex > -1) {
        arr.splice(itemIndex, 1);
    }
}
/**
 * 根据指定keyPath 添加元素，此方法具有副作用，修改了传入的对象
 * @param obj
 * @param keyPath
 * @param value
 */
export function objSetValue(obj, keyPath, value) {
    const pointLastIndex = keyPath.lastIndexOf('.');
    if (pointLastIndex < 0) {
        if (typeof obj !== 'object') {
            throw new Error('keyPath dose not point to an boject!');
        }
        obj[keyPath] = value;
        return;
    }
    const key = keyPath.substr(pointLastIndex + 1, keyPath.length);
    keyPath = keyPath.substr(0, pointLastIndex);
    let targetObj = findObjByKeyPath(obj, keyPath);
    if (typeof targetObj !== 'object') {
        throw new Error('keyPath dose not point to an boject!');
    }
    targetObj[key] = value;
}

/**
 * 根据keyPath定位到指定元素，并将其删除，此方法具有副作用，修改了传入的对象
 * @param obj
 * @param keyPath
 */
export function objRemove(obj, keyPath) {
    const pointLastIndex = keyPath.lastIndexOf('.');
    if (pointLastIndex < 0) {
        if (typeof obj !== 'object') {
            throw new Error('keyPath dose not point to an boject!');
        }
        delete obj[keyPath];
        return;
    }
    const key = keyPath.substr(pointLastIndex + 1, keyPath.length);
    keyPath = keyPath.substr(0, pointLastIndex);
    let targetObj = findObjByKeyPath(obj, keyPath);
    if (typeof targetObj !== 'object') {
        throw new Error('keyPath dose not point to an boject!');
    }
    delete targetObj[key];
}
/**
 * 根据keyPath定位到指定数组，并添加元素，此方法具有副作用，修改了传入的对象
 * @param obj
 * @param keyPath
 * @param value
 */
export function arrAppendValue(obj, keyPath, value) {
    let targetObj = findObjByKeyPath(obj, keyPath);
    if (!Array.isArray(targetObj)) {
        throw new Error('keyPath dose not point to an array!');
    }
    if (Array.isArray(value) && value.length) {
        value.forEach(v => targetObj.push(v));
    } else {
        targetObj.push(value);
    }
}
/**
 * 根据keyPath定位到指定数组，删除一个元素，此方法具有副作用，修改了传入的对象
 * @param obj
 * @param keyPath
 * @param value
 */
export function arrRemove(obj, keyPath, value) {
    let targetObj = findObjByKeyPath(obj, keyPath);
    if (!Array.isArray(targetObj)) {
        throw new Error('keyPath dose not point to an array!');
    }
    arrayRemove(targetObj, value);
}

/**
 * 根据keyPath定位到指定数组，删除所有跟value相同的元素，此方法具有副作用，修改了传入的对象
 * @param obj
 * @param keyPath
 * @param value
 */
export function arrRemoveAll(obj, keyPath, value) {
    let targetObj = findObjByKeyPath(obj, keyPath);
    if (!Array.isArray(targetObj)) {
        throw new Error('keyPath dose not point to an array!');
    }
    while (targetObj.indexOf(value) > -1) {
        arrayRemove(targetObj, value);
    }
}
