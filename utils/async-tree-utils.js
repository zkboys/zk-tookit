/**
 * 将数据转换成tree所需格式
 * @param data
 * @param keyField
 * @param nameField
 * @returns {{name: *, key: *}}
 */
export function generateTreeNode(data, {keyField = 'id', nameField = 'name'} = {}) {
    return {...data, name: data[nameField], key: data[keyField]};
}

/**
 * 将数据转换成tree所需格式
 * @param data
 * @param keyField
 * @param nameField
 * @returns {Array}
 */
export function generateTreeNodes(data, {keyField = 'id', nameField = 'name'} = {}) {
    let arr = [];
    if (data && data.length) {
        arr = data.map(d => generateTreeNode(d, {keyField, nameField}));
    }
    return arr;
}

/**
 * 根据key 将node设置成叶子节点
 * @param treeData
 * @param key
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
 * @param treeData
 * @param key
 * @param child
 */
export function appendChildrenByKey(treeData, key, child) {
    if (!child || !child.length) {
        setLeaf(treeData, key);
        return;
    }
    const loop = (data) => {
        for (let item of data) {
            if (key === item.key) {
                if (item.children) {
                    item.children = item.children.concat(child);
                } else {
                    item.children = child;
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
 * @param treeData
 * @param key
 * @returns {*}
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
 * @param treeData
 * @param key
 * @returns {null}
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
 * @param treeData
 * @param key
 * @param newNode
 * @returns {null}
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
 * @param treeData
 * @param newNode
 * @returns {null}
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
 * @param treeData
 * @param cb
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
