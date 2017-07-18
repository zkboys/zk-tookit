import React from 'react';
import './style.less';

/**
 * 查询条件容器，只具有简单样式
 */
export default class QueryBar extends React.Component {
    state = {};

    componentDidMount() {
    }

    render() {
        return (
            <div className="query-bar">
                {this.props.children}
            </div>
        );
    }
}
