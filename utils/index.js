import _ from 'lodash';

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
 * 获取node中第一个含有path节点的path
 * @param node
 * @param menus
 * @returns {*}
 */
export function getFirstPath(node, menus) {
    if (node.path) return node.path;
    let firstChild = menus.find(m => m.parentKey === node.key);

    if (firstChild) {
        return firstChild.path || getFirstPath(firstChild, menus);
    }
    return null;
}

/**
 * 检测某个节点是否有parent节点
 * @param rows 所有节点
 * @param row 需要判断得节点
 * @returns {boolean}
 */
export function hasParent(rows, row) {
    let parentKey = row.parentKey;
    return rows.find(r => r.key === parentKey);
}

/**
 * 根据key从树形结构数据中获取节点
 * @param data
 * @param key
 * @param callback
 * @returns {*}
 */
export function findNodeByKey(data, key, callback) {
    for (let index = 0; index < data.length; index++) {
        const item = data[index];
        if (item.key === key) {
            return callback(item, index, data);
        }
        if (item.children) {
            findNodeByKey(item.children, key, callback);
        }
    }
}

/**
 * js构造树方法。
 * @param rows 具有key，parentKey关系的扁平数据结构，标题字段为text
 * @param parentNode 开始节点
 * @returns {array}
 */
export function convertToTree(rows, parentNode) {
    // 这个函数会被多次调用，对rows做深拷贝，否则会产生副作用。
    rows = _.cloneDeep(rows);
    parentNode = _.cloneDeep(parentNode);

    let nodes = [];
    if (parentNode) {
        nodes.push(parentNode);
    } else { // 获取所有的顶级节点
        nodes = rows.filter(r => !hasParent(rows, r));
    }

    // 存放要处理的节点
    let toDo = nodes.map((v) => v);

    while (toDo.length) {
        // 处理一个，头部弹出一个。
        let node = toDo.shift();
        // 获取子节点。
        rows.forEach(row => {
            if (row.parentKey === node.key) {
                let child = row;
                let parentKeys = [node.key];
                if (node.parentKeys) {
                    parentKeys = node.parentKeys.concat(node.key);
                }
                child.parentKeys = parentKeys;

                let parentTexts = [node.text];
                if (node.parentTexts) {
                    parentTexts = node.parentTexts.concat(node.text);
                }
                child.parentTexts = parentTexts;

                let parentNodes = [{...node}];
                if (node.parentNodes) {
                    parentNodes = node.parentNodes.concat(parentNodes);
                }
                child.parentNodes = parentNodes;

                if (node.children) {
                    node.children.push(child);
                } else {
                    node.children = [child];
                }
                // child加入toDo，继续处理
                toDo.push(child);
            }
        });
    }

    if (parentNode) {
        return nodes[0].children;
    }
    return nodes;
}

/**
 * 获取头部菜单数据
 * @param menusData
 * @returns {Array.<T>|*}
 */
export function getHeaderMenus(menusData) {
    const menus = menusData.filter((menu, index, arr) => !hasParent(arr, menu));
    menus.forEach((headMenu) => headMenu.path = getFirstPath(headMenu, menusData) || '/');
    return menus;
}

/**
 * 根据url获取当前头部导航菜单
 * @param headerMenus
 * @returns {*}
 */
export function getCurrentHeaderMenuByUrl(headerMenus = [], url) {
    let currentPath = url || location.pathname;
    let pathNames = currentPath.split('/');
    let headerMenuCurrentKey = pathNames && pathNames.length > 0 && pathNames[1];
    return headerMenus.find(hm => headerMenuCurrentKey === hm.key);
}

/**
 * 根据url获取当前左侧菜单
 * @param menusData
 * @returns {*|T}
 */
export function getCurrentSidebarMenuByUrl(menusData = [], url) {
    let currentPath = url || location.pathname;
    if (currentPath.indexOf('/+') > 0) {
        currentPath = currentPath.substring(0, currentPath.indexOf('/+'));
    }
    let currentHeaderMenu = getCurrentHeaderMenuByUrl(getHeaderMenus(menusData));
    let menusTree = convertToTree(menusData, currentHeaderMenu);
    while (menusTree && menusTree.length) {
        // 处理一个，头部弹出一个。
        let node = menusTree.shift();
        if (node.path === currentPath) {
            return node;
        }
        if (node.children) {
            node.children.forEach((v) => menusTree.push(v));
        }
    }
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
