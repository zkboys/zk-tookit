/**
 * 异步树通用方法
 * @module
 * */

/**
 * 将数据转换成tree所需格式
 * @param {object} data 要进行转换的object
 * @param {String} [keyField='id'] 指定data中某个字段转换为树所需的key
 * @param {String} [nameField='name'] 指定data中某个字段转换为树所需的name
 * @returns {{name: *, key: *}}
 */
export function generateTreeNode(data, keyField = 'id', nameField = 'name') {
    return {...data, name: data[nameField], key: data[keyField]};
}

/**
 * 将数据转换成tree所需格式
 * @param {Array} data 要进行转换的一些数据
 * @param {String} [keyField='id'] 指定data中某个字段转换为树所需的key
 * @param {String} [nameField='name'] 指定data中某个字段转换为树所需的name
 * @returns {Array}
 */
export function generateTreeNodes(data, keyField = 'id', nameField = 'name') {
    let arr = [];
    if (data && data.length) {
        arr = data.map(d => generateTreeNode(d, keyField, nameField));
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
 * 根据key获取node节点
 * @param {Array} treeData 树的树状结构数据
 * @param {String} key 节点的key值
 * @returns {object} 树节点数据
 */
export function getTreeNodeByKey(treeData, key) {
    if (!treeData || !treeData.length) return null;
    let node = null;
    const loop = (data) => {
        for (let item of data) {
            if (item.key === key) {
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
 * 根据key删除节点
 * @param {Array} treeData 树的树状结构数据
 * @param {String} key 要删除节点的key值
 */
export function removeTreeNodeByKey(treeData, key) {
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
export function addTreeNodeChildByKey(treeData, key, newNode) {
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
export function updateTreeNode(treeData, newNode) {
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
 * 渲染树，cb(node[, children nodes])
 * @param {Array} treeData 树的树状结构数据
 * @param {function} cb 回调函数：cb(node[, children nodes])
 */
export function renderTreeNode(treeData, cb) {
    const loop = data => data.map((item) => {
        if (item.children) {
            return cb(item, loop(item.children)); // item children Item
        }

        return cb(item); // 叶子节点
    });
    return loop(treeData);
}
