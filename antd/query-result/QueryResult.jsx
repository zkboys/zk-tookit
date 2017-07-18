import React from 'react';
import './style.less';

/**
 * 查询结果，对table的一个包装，统一列表页结构
 */
export default class QueryResult extends React.Component {
    static defaultProps = {
        className: '',
    };

    render() {
        const className = this.props.className;
        const classNames = `query-result ${className}`;
        return (
            <div {...this.props} className={classNames}>
                {this.props.children}
            </div>
        );
    }
}
