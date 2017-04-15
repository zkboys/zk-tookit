import React, {Component} from 'react';
import {Row, Col, Tree, Form, Select, Button, Input, message, Popconfirm} from 'antd';
import './style.less';
import PageContent from '../../../components/page-content/PageContent';
import * as promiseAjax from '../../../commons/promise-ajax';
import FontIcon from '../../../components/font-icon/FontIcon';
import FontIconModal from '../../../components/font-icon/FontIconModal';
import ValidationRule from '../../../commons/validation-rule';
import {
    generateTreeNodes,
    appendChildrenByKey,
    getTreeNodeByKey,
    removeTreeNodeByKey,
    addTreeNodeChildByKey,
    updateTreeNode,
    renderTreeNode,
} from '../../../commons/tree-utils';

export const PAGE_ROUTE = '/base-information/menu_permission';

const FormItem = Form.Item;
const Option = Select.Option;


class MenuPerimisson extends Component {
    state = {
        gettingMenus: false,
        treeData: [],
        selectedNode: null,
        childFormVisible: false,
    }

    getMenus() {
        this.setState({gettingMenus: true});
        promiseAjax.get('/authority/getSystemMenu').then(data => {
            if (data && data.length) {
                const treeData = data.map(d => {
                    return {name: d.name, key: d.id, ...d};
                });
                this.setState({treeData});
            }
        }).finally(() => {
            this.setState({gettingMenus: false});
        });
    }

    componentDidMount() {
        this.getMenus();
    }

    onSelect = (info) => {
        if (info && info.length) {
            const {setFieldsValue} = this.props.form;
            const treeData = [...this.state.treeData];
            const key = info[0];
            const selectedNode = getTreeNodeByKey(treeData, key);
            this.setState({selectedNode, childFormVisible: false});
            setFieldsValue({
                code: selectedNode.code,
                type: selectedNode.type,
                name: selectedNode.name,
                icon: selectedNode.icon,
                path: selectedNode.path,
                url: selectedNode.url,
            });
        }
    }

    onLoadData = (treeNode) => {
        const {children, eventKey: currentKey} = treeNode.props;
        if (children && children.length) {
            return new Promise((resolve) => {
                resolve();
            });
        }

        return promiseAjax.get(`/authority/getMenuByParentsId/${currentKey}`).then(data => {
            const treeData = [...this.state.treeData];
            appendChildrenByKey(treeData, currentKey, generateTreeNodes(data));
            this.setState({treeData});
        });
    }

    handleUpdateNode = (e) => {
        e.preventDefault();
        let {selectedNode} = this.state;
        let id = selectedNode && selectedNode.id;
        if (!selectedNode || !id) {
            return message.info('请选择您要修改的菜单');
        }
        this.props.form.validateFieldsAndScroll([
            'code',
            'type',
            'name',
            'icon',
            'path',
            'url',
        ], (err, values) => {
            if (!err) {
                promiseAjax.post('/authority/update', {...values, id}, {successTip: '更新成功！'}).then(() => {
                    const newNode = {...selectedNode, ...values};
                    const treeData = [...this.state.treeData];
                    updateTreeNode(treeData, newNode);
                    this.setState({treeData});
                });
            }
        });
    }
    handleDeleteNode = () => {
        const {selectedNode} = this.state;
        const id = selectedNode.id;
        return promiseAjax.get('/authority/del', {id}, {successTip: '删除成功！'}).then(() => {
            const treeData = [...this.state.treeData];
            removeTreeNodeByKey(treeData, id);
            this.setState({treeData});
        });
    }
    handleShowAddChildrenFrom = () => {
        this.setState({childFormVisible: true});
    }
    childrenFieds = [
        'childCode',
        'childType',
        'childName',
        'childIcon',
        'childPath',
        'childUrl',
    ];
    handleAddChildrenNode = (e) => {
        e.preventDefault();
        let {selectedNode} = this.state;
        this.props.form.validateFieldsAndScroll(this.childrenFieds, (err, values) => {
            if (!err) {
                let data = {
                    parentsId: selectedNode.id,
                    systemId: selectedNode.systemId,

                    code: values.childCode,
                    name: values.childName,
                    icon: values.childIcon,
                    path: values.childPath,
                    type: values.childType,
                    url: values.childUrl,
                };
                return promiseAjax.post('/authority/add', data, {successTip: '添加成功！'}).then(res => {
                    data.id = String(res);
                    data.key = String(res);
                    this.handleResetChildrenFrom();
                    const treeData = [...this.state.treeData];
                    addTreeNodeChildByKey(treeData, selectedNode.id, data);
                    this.setState({treeData});
                });
            }
        });
    }
    handleResetChildrenFrom = () => {
        this.props.form.resetFields(this.childrenFieds);
    }

    render() {
        const {form: {getFieldDecorator, getFieldValue, getFieldError, setFieldsValue}} = this.props;
        let {selectedNode, childFormVisible, treeData} = this.state;

        const treeNodes = renderTreeNode(treeData, item => {
            return item.icon && item.type !== '2' ? <span><FontIcon type={item.icon} style={{marginRight: 8}}/>{item.name}</span> : item.name;
        }, item => {
            return item.type === '2' || item.isLeaf;
        });

        if (!selectedNode) selectedNode = {};

        const disabled = !selectedNode.type || selectedNode.type === '0';
        const isFunctionNode = getFieldValue('type') === '2';
        const isChildFunctionNode = getFieldValue('childType') === '2';

        const formItemLayout = {
            labelCol: {
                xs: {span: 16},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 20},
            },
        };
        const queryItemLayout = {
            xs: 48,
            md: 32,
            lg: 12,
        };

        return (
            <PageContent className="base-business-menu-permission">
                <Row>
                    <Col span={6}>
                        <Tree onSelect={this.onSelect} loadData={this.onLoadData}>
                            {treeNodes}
                        </Tree>
                    </Col>
                    <Col span={18}>
                        <Form onSubmit={this.handleUpdateNode}>
                            <Row gutter={16}>
                                <Col {...queryItemLayout}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="名称">
                                        {getFieldDecorator('name', {
                                            initialValue: selectedNode.name || '',
                                            rules: [{required: true, message: '请输入名称！'}],
                                        })(
                                            <Input placeholder="菜单名称" disabled={disabled}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...queryItemLayout}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="编码">
                                        {getFieldDecorator('code', {
                                            initialValue: selectedNode.code || '',
                                            rules: [{required: true, message: '请输入编码！'}],
                                        })(
                                            <Input placeholder="菜单编码" disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...queryItemLayout}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="类型">
                                        {getFieldDecorator('type', {
                                            initialValue: selectedNode.type || '',
                                            rules: [{required: true, message: '请选择类型！'}],
                                            onChange: value => {
                                                // 为了切换时清除校验状态
                                                if (value === '2' && getFieldError('path')) {
                                                    setFieldsValue({path: getFieldValue('path')});
                                                }
                                            },
                                        })(
                                            <Select disabled={disabled}>
                                                <Option value="1">菜单</Option>
                                                <Option value="2">功能</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...queryItemLayout}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="图标">
                                        <Row>
                                            <Col span={12}>
                                                {getFieldDecorator('icon', {
                                                    initialValue: selectedNode.icon || '',
                                                    rules: [{required: false, message: '请选择图标'}],
                                                })(
                                                    <Input size="large" placeholder="菜单图标" disabled={disabled}/>
                                                )}
                                            </Col>
                                            <Col span={12}>
                                                <FontIconModal disabled={disabled} value={getFieldValue('icon')} onSelect={type => setFieldsValue({icon: type})}/>
                                            </Col>
                                        </Row>
                                    </FormItem>
                                </Col>
                                <Col {...queryItemLayout}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="路径">
                                        {getFieldDecorator('path', {
                                            initialValue: selectedNode.path || '',
                                            rules: [
                                                {required: !isFunctionNode, message: '请输入路径'},
                                            ],
                                        })(
                                            <Input placeholder="菜单路径" disabled={isFunctionNode || disabled}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...queryItemLayout}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="url">
                                        {getFieldDecorator('url', {
                                            initialValue: selectedNode.url || '',
                                            rules: [],
                                        })(
                                            <Input placeholder="页面加载url" disabled={isFunctionNode || disabled}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col {...queryItemLayout}>
                                    <FormItem
                                        label=" "
                                        colon={false}
                                        {...formItemLayout}
                                    >
                                        <Button type="primary" htmlType="submit" style={{marginRight: '16px'}} disabled={disabled}>更新</Button>
                                        <Popconfirm
                                            placement="topRight"
                                            title={`您确定删除"${selectedNode.name}"吗？如有子节点，也将一并删除！`}
                                            onConfirm={this.handleDeleteNode}
                                        >
                                            <Button style={{marginRight: '16px'}} size="large" disabled={disabled}>删除</Button>
                                        </Popconfirm>
                                        {
                                            !isFunctionNode ?
                                                <Button style={{marginRight: '16px'}} onClick={this.handleShowAddChildrenFrom}>添加子节点</Button>
                                                :
                                                null
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                        {
                            childFormVisible ?
                                <Form onSubmit={this.handleAddChildrenNode}>
                                    <Row gutter={16}>
                                        <Col {...queryItemLayout}>
                                            <FormItem
                                                {...formItemLayout}
                                                label="名称">
                                                {getFieldDecorator('childName', {
                                                    rules: [{required: true, message: '请输入名称！'}],
                                                })(
                                                    <Input placeholder="菜单名称"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col {...queryItemLayout}>
                                            <FormItem
                                                {...formItemLayout}
                                                label="编码">
                                                {getFieldDecorator('childCode', {
                                                    rules: [
                                                        {required: true, message: '请输入编码！'},
                                                        ValidationRule.checkPermissionCode(),
                                                    ],
                                                })(
                                                    <Input placeholder="菜单编码"/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col {...queryItemLayout}>
                                            <FormItem
                                                {...formItemLayout}
                                                label="类型">
                                                {getFieldDecorator('childType', {
                                                    initialValue: '1',
                                                    rules: [{required: true, message: '请选择类型！'}],
                                                    onChange: value => {
                                                        // 为了切换时清除校验状态
                                                        if (value === '2' && getFieldError('childPath')) {
                                                            setFieldsValue({childPath: getFieldValue('childPath')});
                                                        }
                                                    },
                                                })(
                                                    <Select>
                                                        <Option value="1">菜单</Option>
                                                        <Option value="2">功能</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col {...queryItemLayout}>
                                            <FormItem
                                                {...formItemLayout}
                                                label="图标">
                                                <Row>
                                                    <Col span={12}>
                                                        {getFieldDecorator('childIcon', {
                                                            rules: [{required: false, message: '请选择图标'}],
                                                        })(
                                                            <Input size="large" placeholder="菜单图标"/>
                                                        )}
                                                    </Col>
                                                    <Col span={12}>
                                                        <FontIconModal value={getFieldValue('childIcon')} onSelect={type => setFieldsValue({childIcon: type})}/>
                                                    </Col>
                                                </Row>
                                            </FormItem>
                                        </Col>
                                        <Col {...queryItemLayout}>
                                            <FormItem
                                                {...formItemLayout}
                                                label="路径">
                                                {getFieldDecorator('childPath', {
                                                    rules: [
                                                        {required: !isChildFunctionNode, message: '请输入路径'},
                                                    ],
                                                })(
                                                    <Input placeholder="菜单路径" disabled={isChildFunctionNode}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col {...queryItemLayout}>
                                            <FormItem
                                                {...formItemLayout}
                                                label="url">
                                                {getFieldDecorator('childUrl', {
                                                    rules: [],
                                                })(
                                                    <Input placeholder="页面加载url" disabled={isChildFunctionNode}/>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col {...queryItemLayout}>
                                            <FormItem
                                                label=" "
                                                colon={false}
                                                {...formItemLayout}
                                            >
                                                <Button type="primary" htmlType="submit" style={{marginRight: '16px'}}>保存</Button>
                                                <Button style={{marginRight: '16px'}} onClick={this.handleResetChildrenFrom}>重置</Button>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Form>
                                : null
                        }
                    </Col>
                </Row>
            </PageContent>
        );
    }
}
export default Form.create()(MenuPerimisson);
