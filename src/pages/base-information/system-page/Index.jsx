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
import {PAGE_ROUTE as ADD_PAGE_ROUTE} from './AddEdit';
import * as promiseAjax from '../../../commons/promise-ajax';
import Permission from '../../../components/Permission';

export const PAGE_ROUTE = '/base-information/system_page';

const FormItem = Form.Item;

class SystemList extends Component {
    state = {
        pageNum: 1,
        pageSize: 20,
        gettingSystems: false,
        systems: [],
        total: 0,
        statusLoading: {},
    }
    columns = [
        {title: '#', render: (text, record, index) => (index + 1) + ((this.state.pageNum - 1) * this.state.pageSize)},
        {title: '系统名称', dataIndex: 'name', key: 'name'},
        {title: '系统url', dataIndex: 'url', key: 'url'},
        {title: '系统path', dataIndex: 'path', key: 'path'},
        {title: '排序', dataIndex: 'sort', key: 'sort'},
        {title: '系统图标', dataIndex: 'icon', key: 'icon'},
        {title: '备注', dataIndex: 'remark', key: 'remark'},
        {title: '是否可用', dataIndex: 'status', key: 'status', render: (...args) => this.renderStatusColumn(...args)},
        {title: '操作', key: 'operator', render: (...args) => this.renderOperatorColumn(...args)},
    ];

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
                    promiseAjax.patch(`/systems/${id}`, {status: !status}).then(() => {
                        const {systems} = this.state;
                        const system = systems.find(u => u.id === id);
                        if (system) {
                            system.status = checked;
                        }
                        this.setState({
                            systems,
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
    }

    renderOperatorColumn = (text, record) => {
        const items = [
            {
                label: '修改',
                permission: 'system-update',
                onClick: () => this.handleEdit(record),
            },
        ];
        if (record.code !== 'PORTAL') {
            items.push({
                label: '删除',
                permission: 'system-delete',
                confirm: {
                    title: `您确定要删除“${record.name}”？`,
                },
                onClick: () => this.handleDelete(record),
            });
        }
        return (<Operator items={items}/>);
    }

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
            gettingSystems: true,
        });
        promiseAjax.get('/systems', params).then(data => {
            this.setState({
                pageNum: data.pageNum,
                pageSize: data.pageSize,
                total: data.total,
                systems: data.list,
            });
        }).finally(() => {
            this.setState({
                gettingSystems: false,
            });
        });
    }

    handleEdit = (record) => {
        const {router} = this.props;
        router.push(ADD_PAGE_ROUTE.replace(':systemId', record.id));
    }
    handleDelete = (record) => {
        const options = {
            successTip: `删除"${record.name}"成功`,
            errorTip: `删除"${record.name}"失败`,
        };
        promiseAjax.del(`/systems/${record.id}`, {}, options).then(() => {
            const systems = this.state.systems.filter(sys => sys.id !== record.id);
            this.setState({systems});
        });
    }
    handleQuery = (e) => {
        e.preventDefault();
        this.search({
            pageNum: 1,
        });
    }

    handlePageNumChange = (pageNum) => {
        this.setState({
            pageNum,
        });
        this.search({
            pageNum,
        });
    }
    handlePageSizeChange = pageSize => {
        this.setState({
            pageNum: 1,
            pageSize,
        });
        this.search({
            pageNum: 1,
            pageSize,
        });
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.search();
    }

    render() {
        const {
            form,
            form: {getFieldDecorator},
        } = this.props;

        const {
            gettingSystems,
            systems,
            total,
            pageNum,
            pageSize,
        } = this.state;
        const addPermissionCode = 'add-admin'; // TODO 权限code
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
        return (
            <PageContent className="base-business-system">
                <QueryBar>
                    <Form onSubmit={this.handleQuery} layout="inline">
                        <FormItem
                            style={{marginBottom: 16}}
                            {...formItemLayout}
                            label="系统名">
                            {getFieldDecorator('name')(
                                <Input
                                    ref={node => this.lni = node}
                                    placeholder="请输入系统名"
                                    suffix={<InputCloseSuffix form={form} field="name" dom={this.lni}/>}
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
                        loading={gettingSystems}
                        size="middle"
                        rowKey={(record) => record.id}
                        columns={this.columns}
                        dataSource={systems}
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

export default Form.create()(SystemList);

