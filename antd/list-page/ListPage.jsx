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
        total: 0,
        tableProps: {},
        dataSource: [],
        rowKey: (record) => record.id,
    };

    static propTypes = {
        columns: PropTypes.array.isRequired, // FIXME: 这个将被启用，table 的 props 统一使用tableProps传入
        toolItems: PropTypes.array,
        queryItems: PropTypes.array,
        searchOnMount: PropTypes.bool,
        showSearchButton: PropTypes.bool,
        showResetButton: PropTypes.bool,
        showPagination: PropTypes.bool,
        total: PropTypes.number,
        dataSource: PropTypes.array, // FIXME: 这个将被启用，table 的 props 统一使用tableProps传入
        tableProps: PropTypes.object,
        rowSelection: PropTypes.object, // FIXME: 这个将被启用，table 的 props 统一使用tableProps传入
        rowKey: PropTypes.func, // FIXME: 这个将被启用，table 的 props 统一使用tableProps传入
        form: PropTypes.object, // 表单对象
    };

    state = {
        query: {},
        pageNum: 1,
        pageSize: 20,
        loading: false,
        dataSource: [],
        total: 0,
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
            const {pageNum, pageSize} = this.state;
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

    handleQuery = (query) => {
        const {showPagination} = this.props;
        this.setState({query});
        if (showPagination) {
            this.search({pageNum: 1, ...query});
        } else {
            this.search({...query});
        }
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

    render() {
        const {
            columns,
            toolItems,
            queryItems,
            showSearchButton,
            showResetButton,
            showPagination,
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

        const {
            loading,
            pageNum,
            pageSize,
        } = this.state;

        // columns key可以缺省，默认与dataIndex，如果有相同dataIndex列，需要指定key；
        const tableColumns = columns.map(item => {
            if (!item.key) {
                item.key = item.dataIndex;
            }
            return item;
        });
        tableColumns.unshift({title: '序号', width: 50, render: (text, record, index) => (index + 1) + ((pageNum - 1) * pageSize)});

        return (
            <PageContent className="example-users">
                {
                    queryItems && queryItems.length ?
                        <QueryBar>
                            <QueryItem
                                outerForm={form} // fixme: 会改成form
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
