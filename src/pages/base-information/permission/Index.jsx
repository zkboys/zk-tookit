import React, {Component} from 'react';
import {Form, Tree, Card, Row, Col, Input, Button, message, Select, Modal} from 'antd';
import _ from 'lodash';
import './style.less';
import PageContent from '../../../components/page-content/PageContent';
import * as promiseAjax from '../../../commons/promise-ajax';
import FontIcon from '../../../components/font-icon/FontIcon';
import FontIconSelector from '../../../components/font-icon/FontIconSelector';

export const PAGE_ROUTE = '/base-information/permission';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const Option = Select.Option;

function generateTreeNodes(parentNodeId, treeNode) {
    const arr = [];
    treeNode.map((value) => {
        arr.push({
            createTime: value.createTime,
            createUserId: value.createUserId,
            updateTime: value.updateTime,
            updateUserId: value.updateUserId,
            id: `${parentNodeId}-${value.id}`,
            parentsId: value.parentsId,
            code: value.code,
            type: value.type,
            path: value.path,
            url: value.url,
            name: value.name,
            systemId: value.systemId,
            systemName: value.systemName,
            systemCode: value.systemCode,
            sort: value.sort,
            icon: value.icon,
            roleId: value.roleId,
        });
        return null;
    });
    return arr;
}

function setLeaf(treeData, curKey, level) {
    const loopLeaf = (data, lev) => {
        const l = lev - 1;
        data.forEach((item) => {
            if ((item.id.length > curKey.length) ? item.id.indexOf(curKey) !== 0 :
                    curKey.indexOf(item.id) !== 0) {
                return;
            }
            if (item.children) {
                loopLeaf(item.children, l);
            } else if (l < 1) {
                item.isLeaf = true;
            }
        });
    };
    loopLeaf(treeData, level + 1);
}

function getNewTreeData(treeData, curKey, child, level) {
    const loop = (data) => {
        data.forEach((item) => {
            if (curKey.indexOf(item.id) === 0) {
                if (item.children) {
                    loop(item.children);
                } else {
                    item.children = child;
                }
            }
        });
    };
    loop(treeData);
    setLeaf(treeData, curKey, level);
}

class Permission extends Component {
    state = {
        iconModalVisible: false,
        treeData: [],
        selectedIcon: '',
    }

    componentWillMount() {
        this.getSearch();
    }

    getSearch = () => {
        promiseAjax.get('/authority/getSystemMenu').then(data => {
            this.setState({
                treeData: data,
            });
        }).finally(() => {
            this.setState({
                gettingUsers: false,
            });
        });
    }

    onSelect = (info) => {
        let treeNode = {};
        const {treeData} = this.state;
        const getNode = function (arr) {
            arr.map((value) => {
                if (value.id === info[0]) {
                    treeNode = value;
                    return null;
                } else if (value.children) {
                    getNode(value.children);
                }
                return null;
            });
        };
        getNode(treeData);
        this.setState({
            selectedNode: treeNode,
        });
    }
    onLoadData = (treeNode) => {
        return promiseAjax.get(`/authority/getMenuByParentsId/${treeNode.props.eventKey.split('-')[treeNode.props.eventKey.split('-').length - 1]}`).then(data => {
            const treeData = [...this.state.treeData];
            getNewTreeData(treeData, treeNode.props.eventKey, generateTreeNodes(treeNode.props.eventKey, data), 10);
            this.setState({treeData});
        }).catch(err => {
            console.log(err);
        });
    }
    changeShowAdd = (flag, data) => {
        if (!data.id) {
            message.warning('请选择节点！');
            return null;
        }
        this.setState({
            showAddFlag: !flag,
        });
    }
    updateNode = (e) => {
        e.preventDefault();
        let {selectedNode} = this.state;
        let id = selectedNode && selectedNode.id.split('-')[selectedNode.id.split('-').length - 1];

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let data = _.omit(values, 'code');
                return promiseAjax.post('/authority/update', {...data, id}).then((res) => {
                    this.getSearch();
                    console.log(res);
                }).catch((error) => {
                    console.log(error);
                });
            }
        });
    }
    delNode = (node) => {
        return promiseAjax.del(`/authority/del/${node.id.split('-')[node.id.split('-').length - 1]}`).then(() => {
            message.info('删除成功');
            this.getSearch();
        }).catch(() => {
            message.info('删除失败');
        });
    }
    addSonNode = (e) => {
        e.preventDefault();
        let {selectedNode} = this.state;
        let {form: {getFieldsValue}} = this.props;
        let parentsId = selectedNode.id.split('-')[selectedNode.id.split('-').length];
        let systemId = selectedNode.systemId;
        let addSonData = {
            parentsId,
            name: getFieldsValue().sonName,
            path: getFieldsValue().sonPath,
            type: getFieldsValue().sonType,
            url: getFieldsValue().sonUrl,
            code: getFieldsValue().sonCode,
            systemId,
        };
        return promiseAjax.post('/authority/add', {...addSonData}).then(() => {
            console.log(parentsId);
            message.info('添加成功');
            this.getSearch();
            this.setState({
                showAddFlag: false,
            });
        }).catch(() => {
            message.info('添加失败');
        });
    }

    renderTree() {
        const loop = data => data.map((item) => {
            if (item.children) {
                return <TreeNode title={item.name} key={item.id} isLeaf={item.type === '2'}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode title={item.name} key={item.id} isLeaf={item.type === '2'}/>;
        });
        const treeNodes = loop(this.state.treeData);
        return (
            <Tree onSelect={this.onSelect} loadData={this.onLoadData}>
                {treeNodes}
            </Tree>
        );
    }

    renderAddTreeNode() {
        const {form: {getFieldDecorator}} = this.props;
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
            <Card title="子节点添加" style={{marginTop: 30}}>
                <Form onSubmit={this.addSonNode}>
                    <Row gutter={16}>
                        <Col {...queryItemLayout}>
                            <FormItem
                                {...formItemLayout}
                                label="菜单名称">
                                {getFieldDecorator('sonName')(
                                    <Input placeholder="菜单名称"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col {...queryItemLayout}>
                            <FormItem
                                {...formItemLayout}
                                label="菜单code">
                                {getFieldDecorator('sonCode')(
                                    <Input placeholder="菜单code"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col {...queryItemLayout}>
                            <FormItem
                                {...formItemLayout}
                                label="菜单类型">
                                {getFieldDecorator('sonType')(
                                    <Select
                                        notFoundContent="暂无数据"
                                    >
                                        <Option value="1">菜单</Option>
                                        <Option value="2">功能</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col {...queryItemLayout}>
                            <FormItem
                                {...formItemLayout}
                                label="菜单路径">
                                {getFieldDecorator('sonPath')(
                                    <Input placeholder="菜单路径"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col {...queryItemLayout}>
                            <FormItem
                                {...formItemLayout}
                                label="菜单url">
                                {getFieldDecorator('sonUrl')(
                                    <Input placeholder="菜单url"/>
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
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
        );
    }

    renderFrom() {
        const {form: {getFieldDecorator, getFieldValue}} = this.props;
        let initNode = {
            id: '',
            name: '',
            code: '',
            type: '',
            path: '',
            url: '',
            systemId: '',
            systemCode: '',
            systemName: '',
        };
        let selectedNode = this.state.selectedNode || initNode;
        let showAddFlag = this.state.showAddFlag;
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
            <div>
                <Card title="权限配置">
                    <Form onSubmit={this.updateNode}>
                        <Row gutter={16}>
                            <Col {...queryItemLayout}>
                                <FormItem
                                    {...formItemLayout}
                                    label="名称">
                                    {getFieldDecorator('name', {
                                        initialValue: selectedNode.name || '',
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
                                    {getFieldDecorator('code', {
                                        initialValue: selectedNode.code || '',
                                        rules: [{required: true, message: '请输入编码！'}],
                                    })(
                                        <Input placeholder="菜单编码"/>
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
                                    })(
                                        <Select
                                            notFoundContent="暂无数据"
                                        >
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
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            {getFieldDecorator('icon', {
                                                initialValue: selectedNode.icon || '',
                                                rules: [{required: true, message: '请选择图标'}],
                                            })(
                                                <Input size="large" placeholder="菜单图标"/>
                                            )}
                                        </Col>
                                        <Col span={2}>
                                            <FontIcon type={getFieldValue('icon')} size="lg"/>
                                        </Col>
                                        <Col span={10}>
                                            <Button size="large" onClick={() => this.setState({iconModalVisible: true})}>选择图标</Button>
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
                                        rules: [{required: true, message: '请输入路径！'}],
                                    })(
                                        <Input placeholder="菜单路径"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col {...queryItemLayout}>
                                <FormItem
                                    {...formItemLayout}
                                    label="url">
                                    {getFieldDecorator('url', {
                                        initialValue: selectedNode.url || '',
                                        rules: [{required: true, message: '请输入url！'}],
                                    })(
                                        <Input placeholder="菜单url"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col {...queryItemLayout}>
                                <FormItem
                                    label=" "
                                    colon={false}
                                    {...formItemLayout}
                                >
                                    <Button type="primary" htmlType="submit" style={{marginRight: '16px'}}>更新</Button>
                                    <Button style={{marginRight: '16px'}} onClick={() => this.delNode(selectedNode)}>删除</Button>
                                    {
                                        selectedNode && (selectedNode.type === '0' || selectedNode.type === '1') &&
                                        <Button style={{marginRight: '16px'}} onClick={() => this.changeShowAdd(showAddFlag, selectedNode)}>添加子节点</Button>
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                {showAddFlag && this.renderAddTreeNode(selectedNode)}
            </div>
        );
    }

    handleSelectIcon = (type) => {
        this.setState({selectedIcon: type});
    }
    handleIconModalOk = () => {
        const {setFieldsValue} = this.props.form;
        const {selectedIcon} = this.state;
        setFieldsValue({icon: selectedIcon});
        this.setState({iconModalVisible: false});
    }

    render() {
        const {iconModalVisible} = this.state;
        return (
            <PageContent className="base-business-user">
                <Row>
                    <Col span={5} style={{marginRight: 20}}>
                        <Card title="权限树" style={{minHeight: 900}}>
                            {this.renderTree()}
                        </Card>
                    </Col>
                    <Col span={18}>
                        {this.renderFrom()}
                    </Col>
                </Row>
                <Modal
                    visible={iconModalVisible}
                    title="选择一个图标"
                    okText="确定"
                    onCancel={() => this.setState({iconModalVisible: false})}
                    onOk={this.handleIconModalOk}
                >
                    <div style={{width: '100%', height: 500, overflow: 'auto'}}>
                        <FontIconSelector onSelect={this.handleSelectIcon}/>
                    </div>
                </Modal>
            </PageContent>
        );
    }
}

export const LayoutComponent = Form.create()(Permission);
