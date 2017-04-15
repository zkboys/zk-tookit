import React, {Component} from 'react';
import {Form, Input, Button, Table, Icon, Switch, Select} from 'antd';
import {Link} from 'react-router';
import _ from 'lodash';
import './style.less';
import Operator from '../../../components/Operator';
import PageContent from '../../../components/page-content/PageContent';
import QueryBar from '../../../components/query-bar/QueryBar';
import ToolBar from '../../../components/tool-bar/ToolBar';
import QueryResult from '../../../components/query-result/QueryResult';
import PaginationComponent from '../../../components/pagination/PaginationComponent';
import * as promiseAjax from '../../../commons/promise-ajax';
import Permission from '../../../components/Permission';

const FormItem = Form.Item;
const Option = Select.Option;
const addEditPageRoute = '/base-information/roles/+add';

export const PAGE_ROUTE = '/base-information/roles';

class Role extends Component {
    state = {
        pageNum: 1,
        pageSize: 20,
        gettingRoles: false,
        roles: [],
        total: 0,
        statusLoading: {},
        detailUser: null,
    }
    columns = [
        {
            title: '#',
            render: (text, record, index) => (index + 1) + ((this.state.pageNum - 1) * this.state.pageSize),
        },
        {
            title: '系统名称',
            dataIndex: 'systemName',
            key: 'systemName',
        },
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
        },
        // {
        //     title: '角色编码',
        //     dataIndex: 'code',
        //     key: 'code',
        // },
        {
            title: '是否可用',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                const id = record.id;
                const status = record.status;
                const loading = this.state.statusLoading[id];
                const loadingChildren = <Icon type="loading"/>;
                let checkedChildren = '是';
                let unCheckedChildren = '否';
                if (loading) {
                    checkedChildren = loadingChildren;
                    unCheckedChildren = loadingChildren;
                }

                return (
                    <Switch
                        unCheckedChildren={unCheckedChildren}
                        checkedChildren={checkedChildren}
                        checked={Number(status)}
                        onChange={checked => {
                            const {statusLoading, roles} = this.state;
                            if (loading) return;
                            statusLoading[id] = true;
                            this.setState({
                                statusLoading,
                            });
                            const user = roles.find(u => u.id === id);
                            let updateStatus = parseInt(user.status, 10);
                            const userSet = _.omit(user, 'status');
                            promiseAjax.post('/role/update', {
                                ...userSet,
                                status: !updateStatus ? 1 : 0,
                            }).then(() => {
                                const role = roles.find(u => u.id === id);
                                if (role) {
                                    role.status = checked;
                                }
                                this.setState({
                                    roles,
                                });
                                statusLoading[id] = false;
                                this.setState({
                                    statusLoading,
                                });
                            });
                        }}
                    />
                );
            },
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '操作',
            key: 'operator',
            render: (text, record) => {
                const {router} = this.props;
                const items = [
                    {
                        label: '修改',
                        permission: 'user-update',
                        onClick: () => {
                            router.push({
                                pathname: `${addEditPageRoute}/${record.id}`,
                                state: {
                                    detailUser: record,
                                },
                            });
                        },
                    },
                    {
                        label: '删除',
                        permission: 'user-delete',
                        confirm: {
                            title: `您确定要删除“${record.name}”？`,
                        },
                        onClick: () => this.handleDelete(record),
                    },
                ];

                return (<Operator items={items}/>);
            },
        },
    ];

    search = (args) => {
        const {pageNum, pageSize} = this.state;
        const {form: {getFieldsValue}} = this.props;
        let params = {
            ...getFieldsValue(),
            pageNum,
            pageSize,
            ...args,
        };
        this.setState({gettingRoles: true});
        promiseAjax.get('/role/get', params).then((data) => {
            this.setState({
                pageNum: data.pageNum,
                pageSize: data.pageSize,
                total: data.total,
                roles: data.list,
            });
        }).finally(() => {
            this.setState({gettingRoles: false});
        });
    }

    handleDelete = (record) => {
        const options = {
            successTip: `删除"${record.name}"成功`,
            errorTip: `删除"${record.name}"失败`,
        };
        promiseAjax.get('/role/del', {id: record.id}, options).then(() => {
            const roles = this.state.roles.filter(role => role.id !== record.id);
            this.setState({roles});
        });
    }

    handleQuery = (e) => {
        e.preventDefault();
        this.search({pageNum: 1});
    }

    handlePageChange = (pageNum, pageSize) => {
        this.setState({
            pageNum,
            pageSize,
        });

        if (pageSize) {
            this.search({
                pageNum: 1,
                pageSize,
            });
        } else {
            this.search({
                pageNum,
            });
        }
    }

    componentDidMount() {
        this.search();
    }

    render() {
        const {
            gettingRoles,
            roles,
            total,
            pageNum,
            pageSize,
        } = this.state;
        const {form: {getFieldDecorator}} = this.props;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };
        const addPermissionCode = 'admin-add'; // TODO 修改权限code
        return (
            <PageContent className="base-business-user">
                <QueryBar>
                    <Form onSubmit={this.handleQuery} layout="inline" style={{marginBottom: 16}}>
                        <FormItem
                            {...formItemLayout}
                            label="角色名称">
                            {getFieldDecorator('name')(
                                <Input placeholder="请输入角色名称"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="角色状态">
                            {getFieldDecorator('status')(
                                <Select style={{width: 150}}>
                                    <Option value="1">正常</Option>
                                    <Option value="0">停用</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            label=" "
                            colon={false}
                            {...formItemLayout}
                        >
                            <Button type="primary" htmlType="submit" style={{marginRight: '16px'}}>查询</Button>
                        </FormItem>
                    </Form>
                </QueryBar>
                <ToolBar>
                    <Permission code={addPermissionCode}>
                        <Link to={`${addEditPageRoute}/:roleId`}>
                            <Button type="primary" onClick={this.handleAdd}>添加</Button>
                        </Link>
                    </Permission>
                </ToolBar>
                <QueryResult>
                    <Table
                        loading={gettingRoles}
                        size="middle"
                        rowKey={(record) => record.id}
                        columns={this.columns}
                        dataSource={roles}
                        pagination={false}
                    />
                </QueryResult>
                <PaginationComponent
                    pageSize={pageSize}
                    pageNum={pageNum}
                    total={total}
                    onChange={this.handlePageChange}
                />
            </PageContent>
        );
    }
}

export default Form.create()(Role);
