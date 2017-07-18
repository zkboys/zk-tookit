import React from 'react';
import './style.less';

/**
 * 工具条，一般用于列表页，表格上
 */
export default class ToolBar extends React.Component {
    static defaultProps = {
        className: '',
    };

    render() {
        const className = this.props.className;
        const classNames = `tool-bar ${className}`;
        return (
            <div {...this.props} className={classNames}>
                {this.props.children}
            </div>
        );
    }
}
