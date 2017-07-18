import React from 'react';
import './style.less';

/**
 * 页面内容用此组件进行包裹，统一添加了padding
 */
export default class PageContent extends React.Component {
    static defaultProps = {
        className: '',
    }

    render() {
        const className = this.props.className;
        const classNames = `page-content ${className}`;
        return (
            <div {...this.props} className={classNames}>
                {this.props.children}
            </div>
        );
    }
}
