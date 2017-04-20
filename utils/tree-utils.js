/**
 * 同步数通用方法
 * @module 同步树工具
 */

import {cloneDeep} from 'lodash/lang';
import {uniqueArray, arrayRemoveAll, arrayRemove} from './index';

/**
 * 将数据转换成tree所需格式
 * @param {object} data 要进行转换的object
 * @param {String} [keyField='id'] 指定data中某个字段转换为树所需的key
 * @param {String} [titleField='name'] 指定data中某个字段转换为树所需的name
 * @returns {{name: *, key: *}}
 */
export function generateTreeNode(data, keyField = 'id', titleField = 'name') {
    return {...data, title: data[titleField], key: data[keyField]};
}

/**
 * 将数据转换成tree所需格式
 * @param {Array} data 要进行转换的一些数据
 * @param {String} [keyField='id'] 指定data中某个字段转换为树所需的key
 * @param {String} [titleField='name'] 指定data中某个字段转换为树所需的name
 * @returns {Array}
 */
export function generateTreeNodes(data, keyField = 'id', titleField = 'name') {
    let arr = [];
    if (data && data.length) {
        arr = data.map(d => generateTreeNode(d, keyField, titleField));
    }
    return arr;
}

/**
 * 根据key 将node设置成叶子节点
 * @param {Array} treeData 树的树状结构数据
 * @param {String} key 节点的key值
 */
export function setLeaf(treeData, key) {
    const loopLeaf = (data) => {
        for (let item of data) {
            if (item.key === key) {
                item.isLeaf = true;
                break;
            }
            if (item.children && item.children.length) {
                loopLeaf(item.children);
            }
        }
    };
    loopLeaf(treeData);
}

/**
 * 给指定key的节点添加子节点
 * @param {Array} treeData 树的树状结构数据
 * @param {String} key 节点的key值
 * @param {Array} child 要添加的子节点
 */
export function appendChildrenByKey(treeData, key, child) {
    const loop = (data) => {
        for (let item of data) {
            if (key === item.key) {
                if (item.children) {
                    item.children = item.children.concat(child);
                } else {
                    item.children = child;
                }

                if (!item.children || !item.children.length) {
                    setLeaf(treeData, key);
                }
                break;
            }
            if (item.children && item.children.length) {
                loop(item.children);
            }
        }
    };
    loop(treeData);
}

/**
 * 检测某个节点是否有parent节点
 * @param {array} rows 所有节点，扁平数据，非树状结构
 * @param {object} row 需要判断得节点
 * @returns {boolean}
 */
export function hasParent(rows, row) {
    let parentKey = row.parentKey;
    return rows.find(r => r.key === parentKey);
}

/**
 * js构造树方法。
 * @param {array} rows 具有key，parentKey关系的扁平数据结构，标题字段为text
 * @param {object} parentNode 开始节点
 * @returns {array}
 */
export function convertToTree(rows, parentNode) {
    // 这个函数会被多次调用，对rows做深拷贝，否则会产生副作用。
    rows = cloneDeep(rows);
    parentNode = cloneDeep(parentNode);

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
 * 根据指定数据的键值对，查找node，比如根据path查找： getNodeByKeyValue(treeData, 'path', '/user/list')
 * @param treeData 树状结构数据
 * @param key key值，比如'path'，'text'等节点数据属性
 * @param value 节点属性所对应的数据
 * @returns {object} 返回根据 key value查找到的节点
 */
export function getNodeByKeyValue(treeData, key, value) {
    if (!treeData || !treeData.length) return null;
    let node = null;
    const loop = (data) => {
        for (let item of data) {
            if (item[key] === value) {
                node = {...item};
                break;
            }
            if (item.children && item.children.length) {
                loop(item.children);
            }
        }
    };
    loop(treeData);
    return node;
}

/**
 * 根据key查找节点
 * @param treeData 树状结构数据
 * @param key
 * @returns {object} 根据key查找到的节点
 */
export function getNodeByKey(treeData, key) {
    return getNodeByKeyValue(treeData, 'key', key);
}

/**
 * 根据key查找所有后代元素
 * @param treeData 树状结构数据
 * @param key
 * * @returns {Array} 根据key查找到的所有后代节点
 */
export function getGenerationalNodesByKey(treeData, key) {
    const node = getNodeByKey(treeData, key);
    if (!node.children || !node.children.length) {
        return [];
    }
    const allNodes = [];
    const loop = (data) => {
        data.forEach(d => {
            allNodes.push(d);
            if (d.children && d.children) {
                loop(d.children);
            }
        });
    };
    loop(node.children);
    return allNodes;
}

/**
 * 获取选中节点的keys，点击父节点时，其下所有后代元素将被全被选中，或者全不选中，选中子节点时，其所有祖先节点将被选中
 * @param treeData 树状结构数据
 * @param {Array} checkedKeys 点击过之后，树选中的keys
 * @param {boolean} checked 当前点击时 checked （true）还是 unchecked（false）
 * @param {String} checkNodeKey 当前点击节点的key
 * @returns {Array} 选中的keys
 */
export function getCheckedKeys(treeData, checkedKeys, checked, checkNodeKey) {
    let allKeys = [...checkedKeys];
    const generationalNodes = getGenerationalNodesByKey(treeData, checkNodeKey);
    const generationalKeys = generationalNodes.map(n => n.key);

    if (checked) {
        // 选中所有后代节点
        allKeys = allKeys.concat(generationalKeys);

        // 选中有祖先节点
        const node = getNodeByKey(treeData, checkNodeKey);
        if (node.parentKeys) {
            allKeys = allKeys.concat(node.parentKeys);
        }
    } else {
        // 取消选中所有后代节点
        arrayRemoveAll(allKeys, generationalKeys.concat(checkNodeKey));

        // 判断其父节点是否还有子节点选中了，如果没有，父节点也不选中
        const node = getNodeByKey(treeData, checkNodeKey);
        if (node.parentKeys) {
            const pks = [...node.parentKeys];
            pks.reverse();
            pks.forEach(key => {
                const pNode = getNodeByKey(treeData, key);
                if (pNode.children && pNode.children.length) {
                    let hasCheckedChild = false;
                    for (let pCNode of pNode.children) {
                        if (allKeys.indexOf(pCNode.key) > -1) {
                            hasCheckedChild = true;
                            break;
                        }
                    }
                    if (!hasCheckedChild) {
                        arrayRemove(allKeys, key);
                    }
                }
            });
        }
    }
    return allKeys;
}

/**
 * 根据key删除节点
 * @param {Array} treeData 树的树状结构数据
 * @param {String} key 要删除节点的key值
 */
export function removeNodeByKey(treeData, key) {
    if (!treeData || !treeData.length) return null;
    const loop = (data) => {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (item.key === key) {
                data.splice(i, 1);
                break;
            } else if (item.children && item.children.length) {
                loop(item.children);
            }
        }
    };
    loop(treeData);
}

/**
 * 给指定key的node节点增加一个新的子节点
 * @param {Array} treeData 树的树状结构数据
 * @param {String} key 要操作的节点的key值
 * @param {object} newNode 需要加入的子节点
 */
export function addNodeChildByKey(treeData, key, newNode) {
    if (!treeData || !treeData.length) return null;
    newNode.isLeaf = true;
    const loop = (data) => {
        for (let item of data) {
            if (item.key === key) {
                if (item.children) {
                    item.children.push({...newNode});
                } else {
                    item.children = [{...newNode}];
                }
                break;
            }
            if (item.children && item.children.length) {
                loop(item.children);
            }
        }
    };
    loop(treeData);
}

/**
 * 更新某个节点
 * @param {Array} treeData 树的树状结构数据
 * @param {object} newNode 需要跟新的节点新数据，会根据key对原数据进行比对
 */
export function updateNode(treeData, newNode) {
    if (!treeData || !treeData.length) return null;
    const loop = (data) => {
        for (let item of data) {
            if (item.key === newNode.key) {
                Object.keys(item).forEach(key => {
                    item[key] = newNode[key];
                });
                break;
            }
            if (item.children && item.children.length) {
                loop(item.children);
            }
        }
    };
    loop(treeData);
}

/**
 * 根据某个节点，获取其最顶级节点
 * @param treeData 树状结构数据
 * @param node 节点数据
 * @returns {object} 最顶层节点
 */
export function getTopNodeByNode(treeData, node) {
    if (node && !node.parentKey) return node;
    let parentNode = null;
    const loop = (data) => { // 查找node的父节点
        for (let item of data) {
            if (item.key === node.parentKey) {
                parentNode = {...item};
                break;
            }
            if (item.children && item.children.length) {
                loop(item.children);
            }
        }
    };
    loop(treeData);
    return getTopNodeByNode(treeData, parentNode); // 继续查找parentNode的父节点
}

/**
 * 渲染树，cb(node[, children nodes])
 * @param {Array} treeData 树的树状结构数据
 * @param {function} cb 回调函数：cb(node[, children nodes])
 */
export function renderNode(treeData, cb) {
    const loop = data => data.map((item) => {
        if (item.children) {
            return cb(item, loop(item.children)); // item children Item
        }

        return cb(item); // 叶子节点
    });
    return loop(treeData);
}
