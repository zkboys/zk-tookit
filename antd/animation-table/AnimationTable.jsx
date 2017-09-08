import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Table} from 'antd';
import 'animate.css';

export default class TableAnimation extends Component {
    constructor(props) {
        super(props);
        this.state.dataSource = props.dataSource;
    }

    static defaultProps = {
        uniqueKey: 'id',
        animationDuring: 500,
        inAnimationClass: 'animated fadeInLeft',
        outAnimationClass: 'animated zoomOutRight',
    };

    static propTypes = {
        uniqueKey: PropTypes.string, // 数据的唯一key值
        animationDuring: PropTypes.number, // 动画持续时间
        inAnimationClass: PropTypes.string, // 插入动画 class
        outAnimationClass: PropTypes.string, // 移除动画 class
    };

    state = {
        dataSource: [],
    };

    componentWillReceiveProps(nextProps) {
        const {uniqueKey, animationDuring} = this.props;
        const nextDataSource = nextProps.dataSource || [];
        const dataSource = this.props.dataSource || [];

        // 筛选原dataSource中有哪些数据新的dataSource中已经删除
        let hasDeletedRecord = false;
        dataSource.forEach(item => {
            const exist = nextDataSource.find(it => it[uniqueKey] === item[uniqueKey]);
            if (!exist) {
                hasDeletedRecord = true;
                item.__isDeleted__ = true;
            }
        });

        nextDataSource.forEach(item => {
            const exist = dataSource.find(it => it[uniqueKey] === item[uniqueKey]);
            if (!exist) {
                item.__isNewAdd__ = true;
            }
        });

        if (hasDeletedRecord) {
            this.setState({dataSource});

            setTimeout(() => {
                this.setState({dataSource: nextDataSource});
            }, animationDuring);
        } else {
            this.setState({dataSource: nextDataSource});
        }
    }

    render() {
        const {
            rowKey,
            rowClassName,
            uniqueKey,
            inAnimationClass,
            outAnimationClass,
        } = this.props;
        const {dataSource} = this.state;
        return (
            <Table
                {...this.props}
                dataSource={dataSource}
                rowKey={(record, index) => {
                    if (rowKey) {
                        if (typeof rowKey === 'string') {
                            return record[rowKey];
                        }

                        return rowKey(record, index);
                    }
                    return record[uniqueKey];
                }}
                rowClassName={(record, index) => {
                    let cn = '';
                    if (rowClassName) {
                        cn = rowClassName(record, index);
                    }

                    if (record.__isDeleted__) return `${outAnimationClass} ${cn}`;
                    if (record.__isNewAdd__) return `${inAnimationClass} ${cn}`;
                }}
            />
        );
    }
}
