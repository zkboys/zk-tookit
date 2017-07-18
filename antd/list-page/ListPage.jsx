import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Table} from 'antd';
import {
    PageContent,
    QueryBar,
    QueryItem,
    ToolBar,
    QueryResult,
    PaginationComponent,
    FontIcon,
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
        hasPermission: () => true,
    };

    static propTypes = {
        columns: PropTypes.array.isRequired,
        toolItems: PropTypes.array,
        queryItems: PropTypes.array,
        searchOnMount: PropTypes.bool,
        showSearchButton: PropTypes.bool,
        showResetButton: PropTypes.bool,
        showPagination: PropTypes.bool,
        total: PropTypes.number,
        dataSource: PropTypes.array,
        tableProps: PropTypes.object,
        hasPermission: PropTypes.func,
        rowKey: PropTypes.func,
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
        const {onSearch} = this.props;
        const {pageNum, pageSize, query} = this.state;
        let params = {
            ...query,
            pageNum,
            pageSize,
            ...args,
        };
        this.setState({loading: true});
        onSearch(params).finally(() => this.setState({loading: false}));
    };

    handleQuery = (query) => {
        this.setState({query});
        this.search({pageNum: 1, ...query});
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
            tableProps,
            rowSelection,
            rowKey,
            hasPermission,
        } = this.props;

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
                            {
                                toolItems.map((item, index) => {
                                    const {
                                        type = 'primary',
                                        icon,
                                        text,
                                        permission,
                                        onClick = () => {
                                        },
                                    } = item;
                                    if (permission && !hasPermission(permission)) return null;
                                    return (
                                        <Button key={index} type={type} onClick={onClick}>
                                            {
                                                icon ?
                                                    <FontIcon type={icon}/>
                                                    : null
                                            }
                                            {text}
                                        </Button>
                                    );
                                })
                            }
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
