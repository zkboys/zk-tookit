import React, {Component} from 'react';
import {Form, Row, Col, Select, Input, Switch, Button, Tree} from 'antd';
import PageContent from '../../../components/page-content/PageContent';
import * as promiseAjax from '../../../commons/promise-ajax';
import FontIcon from '../../../components/font-icon/FontIcon';
import {
    generateTreeNodes,
    appendChildrenByKey,
    // getTreeNodeByKey,
    // removeTreeNodeByKey,
    // addTreeNodeChildByKey,
    // updateTreeNode,
    renderTreeNode,
} from '../../../commons/tree-utils';

export const PAGE_ROUTE = '/base-information/roles/+add/:roleId';

const FormItem = Form.Item;
const Option = Select.Option;

class AddEdit extends Component {
    state = {
        roleId: null,
        isEdit: false,
        role: {},
        systems: [],
        title: '添加角色',
        treeData: [],
        treeCheckedKeys: [],
        gettingMenus: false,
    }

    componentDidMount() {
        const {params: {roleId}} = this.props;
        if (roleId !== ':roleId') {
            promiseAjax.get('/role/detail', {id: roleId}).then(data => {
                if (data) {
                    this.setState({
                        title: '修改角色',
                        isEdit: true,
                        roleId,
                        role: data,
                        treeCheckedKeys: data.authorityId.split(','),
                    });
                }
            });
        }
        promiseAjax.get('/systems', {pageSize: 99999}).then(data => {
            if (data && data.list && data.list.length) {
                this.setState({
                    systems: data.list,
                });
            }
        });

        this.getMenus();
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

    handleTreeCheck = (treeCheckedKeys) => {
        this.setState({
            treeCheckedKeys,
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const {roleId, isEdit, treeCheckedKeys} = this.state;
                const {router} = this.props;

                values.status = values.status ? '1' : '0';
                values.code = (new Date()).getTime(); // FIXME code 不知道干嘛用的
                values.authorityId = treeCheckedKeys.join(',');

                if (isEdit) {
                    promiseAjax.post('/role/update', {...values, id: roleId}, {successTip: '修改成功'}).then(() => {
                        setTimeout(() => {
                            router.goBack();
                        }, 1000);
                    });
                } else {
                    promiseAjax.post('/role/add', values, {successTip: '添加成功'}).then(() => {
                        setTimeout(() => {
                            router.goBack();
                        }, 1000);
                    });
                }
            }
        });
    }
    renderSystemOptions = () => {
        return this.state.systems.filter(sys => sys.code !== 'PORTAL').map(sys => <Option key={sys.id}>{sys.name}</Option>);
    }

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const {role, systems, isEdit, title, treeData, treeCheckedKeys} = this.state;

        const formItemLayout = {
            labelCol: {
                xs: {span: 10},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 0},
                sm: {span: 14},
            },
        };
        let systemId = '';
        if (isEdit) {
            systemId = role.systemId || '';
        } else {
            const sysList = systems.filter(sys => sys.code !== 'PORTAL');
            systemId = sysList && sysList.length ? sysList[0].id : '';
        }

        const treeNodes = renderTreeNode(treeData, item => {
            return item.icon && item.type !== '2' ? <span><FontIcon type={item.icon} style={{marginRight: 8}}/>{item.name}</span> : item.name;
        }, item => {
            return item.type === '2' || item.isLeaf;
        });

        return (
            <PageContent>
                <h1 style={{textAlign: 'center', marginBottom: 24}}>{title}</h1>
                <Row>
                    <Col span={12}>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem
                                {...formItemLayout}
                                label="所属系统">
                                {getFieldDecorator('systemId', {
                                    initialValue: systemId,
                                    rules: [{required: true, message: '请选择角色所属系统！'}],
                                })(
                                    <Select
                                        style={{width: '100%'}}
                                        placeholder="请选择系统"
                                        onSelect={this.getSearch}
                                        notFoundContent="暂无数据"
                                    >
                                        {this.renderSystemOptions()}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="角色名称">
                                {getFieldDecorator('name', {
                                    initialValue: role.name,
                                    rules: [{required: true, message: '请输入角色名称！'}],
                                })(
                                    <Input placeholder="请输入角色名称"/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="是否可用"
                            >
                                {getFieldDecorator('status', {
                                    initialValue: role.status === undefined ? true : role.status === '1',
                                    valuePropName: 'checked',
                                    rules: [
                                        {
                                            required: false, message: '请选择是否可用!',
                                        },
                                    ],
                                })(
                                    <Switch checkedChildren={'是'} unCheckedChildren={'否'}/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="备注">
                                {getFieldDecorator('remark', {
                                    initialValue: role.remark,
                                })(
                                    <Input placeholder="请输入角色备注"/>
                                )}
                            </FormItem>
                            <FormItem
                                label=" "
                                colon={false}
                                {...formItemLayout}
                            >
                                <Button type="primary" htmlType="submit" style={{marginRight: '16px'}}>{isEdit ? '修改' : '添加' }</Button>
                                <Button
                                    type="ghost" htmlType="reset" size="large"
                                    onClick={() => this.props.form.resetFields()}>
                                    重置
                                </Button>
                            </FormItem>
                        </Form>
                    </Col>
                    <Col span={12}>
                        <div>选择权限</div>
                        <Tree
                            checkable
                            onCheck={this.handleTreeCheck}
                            checkedKeys={treeCheckedKeys}
                            loadData={this.onLoadData}>
                            {treeNodes}
                        </Tree>
                    </Col>
                </Row>
            </PageContent>
        );
    }
}
export default Form.create()(AddEdit);
