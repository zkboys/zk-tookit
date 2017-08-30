/**
 * 列表页的封装，通过传入相应的配置，生成列表页
 */

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

export default class extends Component {
    static defaultProps = {
        searchOnMount: true,
        showSearchButton: true,
        showResetButton: true,
        showPagination: true,
        showIndexColumn: true,
        total: 0,
    };

    static propTypes = {
        searchOnMount: PropTypes.bool,
        showSearchButton: PropTypes.bool,
        showResetButton: PropTypes.bool,
        showPagination: PropTypes.bool,
        showIndexColumn: PropTypes.bool,
        toolItems: PropTypes.array,
        queryItems: PropTypes.array,
        total: PropTypes.number,
        tableProps: PropTypes.object,
        form: PropTypes.object, // 表单对象
    };

    state = {
        query: {},
        pageNum: 1,
        pageSize: 20,
        loading: false,
    };

    componentDidMount() {
        const {searchOnMount} = this.props;
        if (searchOnMount) {
            this.search();
        }
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
            columns = [],
            toolItems = [],
            queryItems = [],
            showSearchButton,
            showResetButton,
            showPagination,
            tableProps = {},
            total,
            form,
        } = this.props;

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
                                outerForm={form}
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
