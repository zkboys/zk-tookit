/**
 * 同步数通用方法
 * @module
 */

import {cloneDeep} from 'lodash/lang';

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
 * 根据某个节点，获取其最顶级节点
 * @param treeData 树状结构数据
 * @param node 节点数据
 * @returns {object} 最顶层节点
 */
export function getTopNodeByNode(treeData, node) {
    if (node && !node.parentKey) return node;
    let parentNode = null;
    const loop = (data) => {
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
    return getTopNodeByNode(treeData, parentNode);
}
