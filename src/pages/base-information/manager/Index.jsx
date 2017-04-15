import React, {Component} from 'react';
import {Form, Input, Button, Table, Icon, Switch} from 'antd';
import {Link} from 'react-router';
import './style.less';
import Operator from '../../../components/Operator';
import PageContent from '../../../components/page-content/PageContent';
import QueryBar from '../../../components/query-bar/QueryBar';
import ToolBar from '../../../components/tool-bar/ToolBar';
import QueryResult from '../../../components/query-result/QueryResult';
import PaginationComponent from '../../../components/pagination/PaginationComponent';
import InputCloseSuffix from '../../../components/InputCloseSuffix';
import * as promiseAjax from '../../../commons/promise-ajax';
import {PAGE_ROUTE as ADD_PAGE_ROUTE} from './AddEdit';
import EditableCell from '../../../components/editable-cell/EditableCell';
import Permission from '../../../components/Permission';

export const PAGE_ROUTE = '/base-information/manager';

const FormItem = Form.Item;

class AdminList extends Component {
    state = {
        pageNum: 1,
        pageSize: 20,
        gettingAdmins: false,
        admins: [],
        total: 0,
        statusLoading: {},
    };
    columns = [
        {title: '#', render: (text, record, index) => (index + 1) + ((this.state.pageNum - 1) * this.state.pageSize)},
        {title: '登陆名称', dataIndex: 'loginName', key: 'loginName', width: '20%'},
        {title: '系统', dataIndex: 'systems', key: 'systems', render: (...args) => this.renderSystemColumn(...args)},
        {title: '备注', dataIndex: 'remark', key: 'remark'},
        {title: '是否可用', dataIndex: 'status', key: 'status', render: (...args) => this.renderStatusColumn(...args)},
        {title: '操作', key: 'operator', render: (...args) => this.renderOperatorColumn(...args)},
    ];

    renderLoginNameColumn = (text) => {
        return (
            <EditableCell
                rules={[{required: true, message: '登录名不能为空！'}]} field="loginName" value={text}
                onChange={value => console.log(value)}/>
        );
    };
    renderSystemColumn = (text) => {
        if (text && text.length) {
            return text.map(t => t.name).join(',');
        }
        return '无系统';
    };
    renderStatusColumn = (text, record) => {
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
                checked={status}
                onChange={checked => {
                    const {statusLoading} = this.state;
                    if (loading) return;

                    statusLoading[id] = true;
                    this.setState({
                        statusLoading,
                    });

                    promiseAjax.patch(`/admins/${id}`, {status: !status}).then(() => {
                        const {admins} = this.state;
                        const admin = admins.find(u => u.id === id);
                        if (admin) {
                            admin.status = checked;
                        }
                        this.setState({
                            admins,
                        });
                    }).finally(() => {
                        statusLoading[id] = false;
                        this.setState({
                            statusLoading,
                        });
                    });
                }}
            />
        );
    };
    renderOperatorColumn = (text, record) => {
        const items = [
            {
                label: '修改',
                permission: 'admin-update',
                onClick: () => this.handleEdit(record),
            },
            {
                label: '删除',
                permission: 'admin-delete',
                confirm: {
                    title: `您确定要删除“${record.loginName}”？`,
                },
                onClick: () => this.handleDelete(record),
            },
        ];

        return (<Operator items={items}/>);
    };

    search = (args) => {
        const {form: {getFieldsValue}} = this.props;
        const {pageNum, pageSize} = this.state;
        let params = {
            ...getFieldsValue(),
            pageNum,
            pageSize,
            ...args,
        };
        this.setState({
            gettingAdmins: true,
        });
        promiseAjax.get('/admins', params).then(data => {
            this.setState({
                pageNum: data.pageNum,
                pageSize: data.pageSize,
                total: data.total,
                admins: data.list,
            });
        }).finally(() => {
            this.setState({
                gettingAdmins: false,
            });
        });
    }
    handleEdit = (record) => {
        const {router} = this.props;
        router.push(ADD_PAGE_ROUTE.replace(':adminId', record.id));
    };
    handleDelete = (record) => {
        const options = {
            successTip: `删除"${record.name}"成功`,
            errorTip: `删除"${record.name}"失败`,
        };
        promiseAjax.del(`/admins/${record.id}`, {}, options).then(() => {
            const admins = this.state.admins.filter(adm => adm.id !== record.id);
            this.setState({admins});
        });
    }
    handleQuery = (e) => {
        e.preventDefault();
        this.search({pageNum: 1});
    };
    handlePageNumChange = (pageNum) => {
        this.setState({pageNum});
        this.search({pageNum});
    };
    handlePageSizeChange = pageSize => {
        this.setState({
            pageNum: 1,
            pageSize,
        });
        this.search({
            pageNum: 1,
            pageSize,
        });
    };

    componentWillMount() {
        this.search();
    }

    render() {
        const {
            form,
            form: {getFieldDecorator},
        } = this.props;

        const {
            gettingAdmins,
            admins,
            total,
            pageNum,
            pageSize,
        } = this.state;

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
            <PageContent className="base-manager">
                <QueryBar>
                    <Form onSubmit={this.handleQuery} layout="inline">
                        <FormItem
                            style={{marginBottom: 16}}
                            {...formItemLayout}
                            label="登录名">
                            {getFieldDecorator('loginName')(
                                <Input
                                    ref={node => this.lni = node}
                                    placeholder="请输入登录账号"
                                    suffix={<InputCloseSuffix form={form} field="loginName" dom={this.lni}/>}
                                />
                            )}
                        </FormItem>
                        <Button type="primary" size="large" htmlType="submit">查询</Button>
                    </Form>
                </QueryBar>
                <ToolBar>
                    <Permission code={addPermissionCode}>
                        <Link to={ADD_PAGE_ROUTE}>
                            <Button type="primary">添加</Button>
                        </Link>
                    </Permission>
                </ToolBar>
                <QueryResult>
                    <Table
                        loading={gettingAdmins}
                        size="large"
                        rowKey={(record) => record.id}
                        columns={this.columns}
                        dataSource={admins}
                        pagination={false}
                    />
                </QueryResult>
                <PaginationComponent
                    pageSize={pageSize}
                    pageNum={pageNum}
                    total={total}
                    onPageNumChange={this.handlePageNumChange}
                    onPageSizeChange={this.handlePageSizeChange}
                />
            </PageContent>
        );
    }
}

export default Form.create()(AdminList);
