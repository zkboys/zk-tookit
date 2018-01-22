import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Table} from 'antd';
import {
    PageContent,
    QueryBar,
    QueryItem,
    ToolBar,
    QueryResult,
    PaginationComponent,
    ToolItem,
} from 'zk-tookit/antd';

/**
 * 列表页的封装，通过传入相应的配置，生成列表页
 */
export default class extends Component {
    static defaultProps = {
        columns: [],
        toolItems: [],
        queryItems: [],
        searchOnMount: true,
        showSearchButton: true,
        showResetButton: true,
        showPagination: true,
        showSequenceNumber: true,
        total: 0,
        tableProps: {},
        dataSource: [],
        rowKey: (record) => record.id,

        pageNum: 1,
    };

    static propTypes = {
        columns: PropTypes.array.isRequired, // FIXME: 这个将被启用，table 的 props 统一使用tableProps传入
        toolItems: PropTypes.array,
        queryItems: PropTypes.array,
        searchOnMount: PropTypes.bool,
        showSearchButton: PropTypes.bool,
        showResetButton: PropTypes.bool,
        showPagination: PropTypes.bool,
        showSequenceNumber: PropTypes.bool,
        total: PropTypes.number,
        dataSource: PropTypes.array, // FIXME: 这个将被启用，table 的 props 统一使用tableProps传入
        tableProps: PropTypes.object,
        rowSelection: PropTypes.object, // FIXME: 这个将被启用，table 的 props 统一使用tableProps传入
        rowKey: PropTypes.func, // FIXME: 这个将被启用，table 的 props 统一使用tableProps传入
        form: PropTypes.object, // 表单对象

        pageNum: PropTypes.number,
        onPageNumChange: PropTypes.func,
    };

    state = {
        query: {},
        loading: false,
        dataSource: [],
        total: 0,
        pageSize: 20,
    };

    componentWillMount() {
    }

    componentDidMount() {
        const {searchOnMount} = this.props;
        if (searchOnMount) {
            this.search();
        }
    }

    componentWillUnmount() {
    }

    search = (args) => {
        const {onSearch, showPagination} = this.props;
        const {query} = this.state;
        let params = {};
        if (showPagination) {
            const {pageNum} = this.props;
            const {pageSize} = this.state;
            params = {
                ...query,
                pageNum,
                pageSize,
                ...args,
            };
        } else {
            params = {
                ...query,
                ...args,
            };
        }
        this.setState({loading: true});
        onSearch(params).finally(() => this.setState({loading: false}));
    };

    handleQuery = (query = {}) => {
        const {pageNum} = this.props;
        const {showPagination} = this.props;
        let params = query;
        if (showPagination) {
            params = {
                ...query,
                pageNum,
            };
        }

        this.setState({query}, () => this.search(params));
    };

    handlePageNumChange = (pageNum) => {
        const {onPageNumChange} = this.props;
        onPageNumChange && onPageNumChange(pageNum);
    };

    handlePageSizeChange = pageSize => {
        this.setState({pageSize}, () => this.search({pageNum: 1, pageSize}));
    };

    render() {
        const {
            columns,
            toolItems,
            queryItems,
            showSearchButton,
            showResetButton,
            showPagination,
            showSequenceNumber,
            total,
            dataSource,
            rowSelection,
            rowKey,
            form,
        } = this.props;

        // 解决如果各个组件都不传递tableProps，组件将都使用默认tableProps，而且是同一个tableProps，会产生互相干扰
        let tableProps = {...this.props.tableProps};

        if (rowSelection) {
            tableProps.rowSelection = rowSelection;
        }

        const {loading, pageSize} = this.state;
        let {pageNum} = this.props;
        pageNum = pageNum <= 0 ? 1 : pageNum;

        // columns key可以缺省，默认与dataIndex，如果有相同dataIndex列，需要指定key；
        const tableColumns = columns.map(item => {
            if (!item.key) {
                item.key = item.dataIndex;
            }
            return item;
        });


        showSequenceNumber && tableColumns.unshift({
            title: '序号',
            key: '__num__',
            width: 60,
            render: (text, record, index) => (index + 1) + ((pageNum - 1) * pageSize),
        });

        const queryItemFormProps = form ? {form} : {};
        return (
            <PageContent className="example-users">
                {
                    queryItems && queryItems.length ?
                        <QueryBar>
                            <QueryItem
                                {...queryItemFormProps}
                                items={queryItems}
                                showSearchButton={showSearchButton}
                                showResetButton={showResetButton}
                                onSubmit={this.handleQuery}
                            />
                        </QueryBar>
                        : null
                }
                {
                    toolItems && toolItems.length ?
                        <ToolBar>
                            <ToolItem items={toolItems}/>
                        </ToolBar>
                        : null
                }
                <QueryResult>
                    <Table
                        loading={loading}
                        size="large"
                        rowKey={rowKey}
                        columns={tableColumns}
                        dataSource={dataSource}
                        pagination={false}
                        {...tableProps}
                    />
                </QueryResult>
                {
                    showPagination ?
                        <PaginationComponent
                            pageSize={pageSize}
                            pageNum={pageNum}
                            total={total}
                            onPageNumChange={this.handlePageNumChange}
                            onPageSizeChange={this.handlePageSizeChange}
                        />
                        : null
                }
            </PageContent>
        );
    }
}
