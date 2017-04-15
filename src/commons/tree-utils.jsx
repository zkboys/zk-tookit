import React from 'react';
import {Tree} from 'antd';

const TreeNode = Tree.TreeNode;

export function generateTreeNode(data, {keyField = 'id', nameField = 'name'} = {}) {
    return {...data, name: data[nameField], key: data[keyField]};
}

export function generateTreeNodes(data, {keyField = 'id', nameField = 'name'} = {}) {
    let arr = [];
    if (data && data.length) {
        arr = data.map(d => generateTreeNode(d, {keyField, nameField}));
    }
    return arr;
}

export function setLeaf(treeData, curKey) {
    const loopLeaf = (data) => {
        for (let item of data) {
            if (item.key === curKey) {
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

export function appendChildrenByKey(treeData, curKey, child) {
    if (!child || !child.length) {
        setLeaf(treeData, curKey);
        return;
    }
    const loop = (data) => {
        for (let item of data) {
            if (curKey === item.key) {
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

export function renderTreeNode(treeData, titleFilter, leafFilter) {
    const loop = data => data.map((item) => {
        if (leafFilter) {
            item.isLeaf = leafFilter(item);
        }

        let title = item.name;
        if (titleFilter) {
            title = titleFilter(item);
        }

        if (item.children) {
            return <TreeNode title={title} key={item.key}>{loop(item.children)}</TreeNode>;
        }

        return <TreeNode title={title} key={item.key} isLeaf={item.isLeaf}/>;
    });
    return loop(treeData);
}
